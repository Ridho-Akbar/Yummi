"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { updateOrderSchema, deleteOrderSchema } from "./update-schema";
import type { OrderItemInput } from "./schema";

export interface UpdateOrderState {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string[]>;
}

interface RpcUpdateResult {
  success?: boolean;
  error?: string;
  total?: number;
}

export async function updateOrder(
  _prevState: UpdateOrderState,
  formData: FormData
): Promise<UpdateOrderState> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Akses ditolak." };
  }

  const rawItems = formData.get("items");
  let parsedItems: OrderItemInput[] = [];

  try {
    parsedItems = JSON.parse(String(rawItems ?? "[]"));
  } catch {
    return { error: "Format produk tidak valid." };
  }

  const parsed = updateOrderSchema.safeParse({
    orderId: formData.get("orderId"),
    customerName: formData.get("customerName"),
    customerPhone: formData.get("customerPhone"),
    customerAddress: formData.get("customerAddress"),
    orderDate: formData.get("orderDate"),
    note: formData.get("note") ?? "",
    items: parsedItems,
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      error: "Ada data yang belum benar.",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("update_order_data", {
    p_order_id: parsed.data.orderId,
    p_customer_name: parsed.data.customerName,
    p_customer_phone: parsed.data.customerPhone,
    p_customer_address: parsed.data.customerAddress,
    p_order_date: parsed.data.orderDate,
    p_note: parsed.data.note ?? "",
    p_items: parsed.data.items,
  });

  if (error) {
    return { error: "Gagal menyimpan perubahan. Coba lagi." };
  }

  const result = data as RpcUpdateResult | null;

  if (!result) {
    return { error: "Respons server tidak dikenali." };
  }

  if (result.error) {
    return { error: result.error };
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${parsed.data.orderId}`);
  revalidatePath("/");

  return { success: "Perubahan berhasil disimpan." };
}

export interface DeleteOrderState {
  error?: string;
}

export async function deleteOrder(
  _prevState: DeleteOrderState,
  formData: FormData
): Promise<DeleteOrderState> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Akses ditolak." };
  }

  const parsed = deleteOrderSchema.safeParse({
    orderId: formData.get("orderId"),
  });

  if (!parsed.success) {
    return { error: "ID pesanan tidak valid." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("soft_delete_order", {
    p_order_id: parsed.data.orderId,
  });

  if (error) {
    return { error: "Gagal menghapus pesanan. Coba lagi." };
  }

  const result = data as { success?: boolean; error?: string } | null;

  if (!result || result.error) {
    return { error: result?.error ?? "Respons server tidak dikenali." };
  }

  revalidatePath("/admin/orders");
  revalidatePath("/");

  redirect("/admin/orders");
}