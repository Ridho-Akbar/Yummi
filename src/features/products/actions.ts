"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { createProductSchema, updateProductSchema } from "./schema";

export interface ProductState {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string[]>;
}

function parseFormData(formData: FormData) {
  return {
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    price: formData.get("price"),
    imageUrl: formData.get("imageUrl") ?? "",
    isAvailable: formData.get("isAvailable") === "on",
    readyStock: formData.get("readyStock") ?? 0,
    dailyCapacity: formData.get("dailyCapacity") ?? 0,
    minOrderQty: formData.get("minOrderQty") ?? 1,
  };
}

export async function createProduct(
  _prevState: ProductState,
  formData: FormData
): Promise<ProductState> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Akses ditolak." };
  }

  const parsed = createProductSchema.safeParse(parseFormData(formData));

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      error: "Ada data yang belum benar.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("products").insert({
    name: parsed.data.name,
    description: parsed.data.description || null,
    price: parsed.data.price,
    image_url: parsed.data.imageUrl || null,
    is_available: parsed.data.isAvailable,
    ready_stock: parsed.data.readyStock,
    daily_capacity: parsed.data.dailyCapacity,
    min_order_qty: parsed.data.minOrderQty,
  });

  if (error) {
    return { error: "Gagal menyimpan produk. Coba lagi." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/order");

  return { success: "Produk berhasil ditambahkan." };
}

export async function updateProduct(
  _prevState: ProductState,
  formData: FormData
): Promise<ProductState> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Akses ditolak." };
  }

  const parsed = updateProductSchema.safeParse({
    productId: formData.get("productId"),
    ...parseFormData(formData),
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      error: "Ada data yang belum benar.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({
      name: parsed.data.name,
      description: parsed.data.description || null,
      price: parsed.data.price,
      image_url: parsed.data.imageUrl || null,
      is_available: parsed.data.isAvailable,
      ready_stock: parsed.data.readyStock,
      daily_capacity: parsed.data.dailyCapacity,
      min_order_qty: parsed.data.minOrderQty,
    })
    .eq("id", parsed.data.productId);

  if (error) {
    return { error: "Gagal menyimpan perubahan. Coba lagi." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/order");

  return { success: "Perubahan berhasil disimpan." };
}

export interface AdjustStockResult {
  error?: string;
  newStock?: number;
}

export async function adjustReadyStock(
  productId: string,
  delta: number
): Promise<AdjustStockResult> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Akses ditolak." };
  }

  if (!Number.isInteger(delta)) {
    return { error: "Delta tidak valid." };
  }

  const supabase = await createClient();

  const { data: current, error: fetchError } = await supabase
    .from("products")
    .select("ready_stock")
    .eq("id", productId)
    .maybeSingle();

  if (fetchError || !current) {
    return { error: "Produk tidak ditemukan." };
  }

  const newStock = Math.max(0, current.ready_stock + delta);

  const { error: updateError } = await supabase
    .from("products")
    .update({ ready_stock: newStock })
    .eq("id", productId);

  if (updateError) {
    return { error: "Gagal menyimpan. Coba lagi." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin");

  return { newStock };
}

export async function setReadyStockToZero(
  productId: string
): Promise<AdjustStockResult> {
  return adjustReadyStockFromAbsolute(productId, 0);
}

async function adjustReadyStockFromAbsolute(
  productId: string,
  value: number
): Promise<AdjustStockResult> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Akses ditolak." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ ready_stock: Math.max(0, value) })
    .eq("id", productId);

  if (error) {
    return { error: "Gagal menyimpan. Coba lagi." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin");

  return { newStock: Math.max(0, value) };
}