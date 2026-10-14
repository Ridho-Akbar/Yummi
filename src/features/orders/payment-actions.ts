"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { updatePaymentSchema } from "./payment-schema";

export interface UpdatePaymentState {
  error?: string;
  success?: string;
}

interface RpcResult {
  success?: boolean;
  error?: string;
  no_change?: boolean;
}

export async function updateOrderPayment(
  _prevState: UpdatePaymentState,
  formData: FormData
): Promise<UpdatePaymentState> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Akses ditolak." };
  }

  const parsed = updatePaymentSchema.safeParse({
    orderId: formData.get("orderId"),
    status: formData.get("status"),
    amountPaid: formData.get("amountPaid") ?? 0,
  });

  if (!parsed.success) {
    const firstError = parsed.error.flatten().fieldErrors;
    return {
      error:
        firstError.amountPaid?.[0] ??
        firstError.status?.[0] ??
        "Data tidak valid.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("update_order_payment", {
    p_order_id: parsed.data.orderId,
    p_new_status: parsed.data.status,
    p_amount_paid: parsed.data.amountPaid,
  });

  if (error) {
    return { error: "Gagal menyimpan. Coba lagi." };
  }

  const result = data as RpcResult | null;

  if (!result) {
    return { error: "Respons server tidak dikenali." };
  }

  if (result.error) {
    return { error: result.error };
  }

  if (result.no_change) {
    return { success: "Tidak ada perubahan." };
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin");

  return { success: "Status pembayaran berhasil diubah." };
}
