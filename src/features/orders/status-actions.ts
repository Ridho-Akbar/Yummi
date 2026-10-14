"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { notifyStatusChange } from "@/lib/telegram";
import { updateOrderStatusSchema } from "./status-schema";

export interface UpdateStatusState {
  error?: string;
  success?: string;
}

interface RpcResult {
  success?: boolean;
  error?: string;
  no_change?: boolean;
  old_status?: string;
  new_status?: string;
}

export async function updateOrderStatus(
  _prevState: UpdateStatusState,
  formData: FormData
): Promise<UpdateStatusState> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Akses ditolak." };
  }

  const parsed = updateOrderStatusSchema.safeParse({
    orderId: formData.get("orderId"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { error: "Data tidak valid." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("update_order_status", {
    p_order_id: parsed.data.orderId,
    p_new_status: parsed.data.status,
  });

  if (error) {
    return { error: "Gagal mengubah status. Coba lagi." };
  }

  const result = data as RpcResult | null;

  if (!result) {
    return { error: "Respons server tidak dikenali." };
  }

  if (result.error) {
    return { error: result.error };
  }

  if (result.no_change) {
    return { success: "Status sudah sama, tidak ada perubahan." };
  }

  // Ambil data order untuk notifikasi. Kalau gagal, lanjut tanpa notif.
  try {
    const { data: orderData } = await supabase
      .from("orders")
      .select("order_code, customer_name")
      .eq("id", parsed.data.orderId)
      .maybeSingle();

    if (orderData) {
      const headersList = await headers();
      const origin =
        headersList.get("origin") ??
        process.env.NEXT_PUBLIC_SITE_URL ??
        "http://localhost:3000";

      await notifyStatusChange(
        {
          orderCode: orderData.order_code,
          customerName: orderData.customer_name,
          fromStatus: result.old_status ?? "unknown",
          toStatus: result.new_status ?? parsed.data.status,
        },
        origin
      );
    }
  } catch (notifyErr) {
    console.error("[updateOrderStatus] Gagal kirim notifikasi:", notifyErr);
  }

  revalidatePath("/admin/orders");
  revalidatePath("/");

  return { success: "Status berhasil diubah." };
}