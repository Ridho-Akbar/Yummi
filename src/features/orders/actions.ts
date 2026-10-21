"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { checkOrderRateLimit, recordOrderAttempt } from "@/lib/rate-limit";
import { checkPasswordRateLimit, recordPasswordAttempt } from "@/lib/password-rate-limit";
import { verifyPassword } from "@/lib/password";
import { getOrderPasswordHash } from "@/features/site/queries";
import { notifyNewOrder } from "@/lib/telegram";
import { revalidatePath } from "next/cache";
import { createOrderSchema, type OrderItemInput } from "./schema";
import { toDateString } from "@/lib/calendar";

export interface CreateOrderState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function createOrder(
  _prevState: CreateOrderState,
  formData: FormData
): Promise<CreateOrderState> {
  const rawItems = formData.get("items");
  let parsedItems: OrderItemInput[] = [];

  try {
    parsedItems = JSON.parse(String(rawItems ?? "[]"));
  } catch {
    return { error: "Format produk tidak valid." };
  }

  const parsed = createOrderSchema.safeParse({
    customerName: formData.get("customerName"),
    customerPhone: formData.get("customerPhone"),
    customerAddress: formData.get("customerAddress"),
    orderDate: formData.get("orderDate"),
    note: formData.get("note") ?? "",
    items: parsedItems,
    accessPassword: formData.get("accessPassword") ?? "",
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      error: "Ada data yang belum benar. Cek lagi ya.",
    };
  }

  const user = await getCurrentUser();
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  const isAnonymous = !user;

  // Validasi Tanggal: Anonim maksimal 2 bulan, admin bebas
  if (!isAdmin) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxDate = new Date(today);
    maxDate.setMonth(today.getMonth() + 2);

    const orderDate = new Date(parsed.data.orderDate);
    orderDate.setHours(0, 0, 0, 0);

    if (orderDate < today) {
      return {
        fieldErrors: { orderDate: ["Tidak bisa memesan untuk tanggal yang sudah lewat."] },
        error: "Tanggal tidak valid.",
      };
    }
    if (orderDate > maxDate) {
      return {
        fieldErrors: { orderDate: ["Pemesanan maksimal 2 bulan dari hari ini."] },
        error: "Tanggal terlalu jauh.",
      };
    }
  }

  if (isAnonymous) {
    const rate = await checkPasswordRateLimit();
    if (!rate.allowed) {
      return { error: "Terlalu banyak percobaan sandi yang salah. Coba lagi dalam 15 menit." };
    }

    const provided = parsed.data.accessPassword;
    if (!provided) {
      return {
        fieldErrors: { accessPassword: ["Sandi akses wajib diisi untuk pesanan anonim."] },
        error: "Sandi akses wajib diisi.",
      };
    }

    const hashFromDb = await getOrderPasswordHash();
    const envPassword = process.env.ADMIN_ORDER_PASSWORD ?? "";
    let passwordValid = false;

    if (hashFromDb) {
      passwordValid = await verifyPassword(provided, hashFromDb);
    } else if (envPassword) {
      passwordValid = provided === envPassword;
    } else {
      return { error: "Sandi akses belum dikonfigurasi oleh admin." };
    }

    await recordPasswordAttempt(passwordValid);

    if (!passwordValid) {
      return {
        fieldErrors: { accessPassword: ["Sandi akses salah. Minta lagi ke admin lewat WA."] },
        error: "Sandi akses salah.",
      };
    }

    const orderRate = await checkOrderRateLimit();
    if (!orderRate.allowed) {
      return { error: "Kamu baru saja mengirim pesanan. Tunggu 1 menit sebelum kirim lagi." };
    }
  }

  const verified = await verifyAndBuildItems(parsed.data.items, parsed.data.orderDate);
  if ("error" in verified) {
    return { error: verified.error };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      customer_name: parsed.data.customerName,
      customer_phone: parsed.data.customerPhone,
      customer_address: parsed.data.customerAddress,
      order_date: parsed.data.orderDate,
      items: verified.items,
      total: verified.total,
      note: parsed.data.note || null,
      is_anonymous: isAnonymous,
      status: "pending",
    })
    .select("id, order_code")
    .single();

  if (error || !data) {
    return { error: "Gagal menyimpan pesanan. Coba lagi sebentar." };
  }

  if (isAnonymous) {
    await recordOrderAttempt();
  }

  try {
    await supabase.from("notifications").insert({
      type: "new_order",
      title: `Pesanan baru: ${data.order_code}`,
      body: `${parsed.data.customerName} — Rp${verified.total.toLocaleString("id-ID")}`,
      link_url: `/admin/orders/${data.order_code}`,
    });
  } catch (notifyErr) {
    console.error("[createOrder] Failed to create notification:", notifyErr);
  }

  try {
    await createCapacityAlerts(supabase, verified.items.map((i) => i.productId), parsed.data.orderDate);
  } catch (alertErr) {
    console.error("[createOrder] Failed to check capacity alerts:", alertErr);
  }

  try {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      (await headers()).get("origin") ??
      "http://localhost:3000";

    await notifyNewOrder(
      {
        orderCode: data.order_code,
        customerName: parsed.data.customerName,
        customerPhone: parsed.data.customerPhone,
        orderDate: parsed.data.orderDate,
        total: verified.total,
        items: verified.items.map((i) => ({ name: i.name, qty: i.qty })),
        note: parsed.data.note || null,
        isAnonymous,
      },
      siteUrl
    );
  } catch (notifyErr) {
    console.error("[createOrder] Failed to send Telegram notification:", notifyErr);
  }

  redirect(`/order/success?code=${data.order_code}`);
}

interface VerifiedItems {
  items: OrderItemInput[];
  total: number;
}

async function verifyAndBuildItems(
  inputItems: OrderItemInput[],
  orderDate: string
): Promise<VerifiedItems | { error: string }> {
  const supabase = await createClient();
  const productIds = inputItems.map((i) => i.productId);

  const [productsResult, capacityResult] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, price, is_available, daily_capacity, min_order_qty")
      .in("id", productIds),
    supabase.rpc("get_product_capacity_for_date", { p_order_date: orderDate }),
  ]);

  if (productsResult.error || !productsResult.data) {
    return { error: "Gagal verifikasi produk. Coba lagi." };
  }
  if (capacityResult.error) {
    return { error: "Gagal verifikasi kapasitas. Coba lagi." };
  }

  const products = productsResult.data;
  const productMap = new Map(products.map((p) => [p.id, p]));

  const capacityMap = new Map<string, { dailyCapacity: number; usedQty: number; remaining: number }>();
  for (const row of capacityResult.data ?? []) {
    capacityMap.set(row.product_id, {
      dailyCapacity: row.daily_capacity,
      usedQty: row.used_qty,
      remaining: row.remaining,
    });
  }

  const verifiedItems: OrderItemInput[] = [];
  let total = 0;

  for (const item of inputItems) {
    const product = productMap.get(item.productId);

    if (!product) return { error: "Ada produk yang tidak ditemukan. Refresh halaman." };
    if (!product.is_available) return { error: `Produk ${product.name} sedang tidak tersedia.` };
    if (product.daily_capacity <= 0) return { error: `Produk ${product.name} sedang tidak menerima pre-order.` };
    if (item.qty > product.daily_capacity) return { error: `Produk ${product.name} maksimal ${product.daily_capacity} per hari.` };

    const minQty = product.min_order_qty ?? 1;
    if (item.qty < minQty) return { error: `Produk ${product.name} minimal ${minQty} per pesanan.` };

    const capacityInfo = capacityMap.get(product.id);
    if (capacityInfo) {
      if (capacityInfo.remaining <= 0) return { error: `Produk ${product.name} sudah penuh untuk tanggal ini. Pilih tanggal lain.` };
      if (item.qty > capacityInfo.remaining) return { error: `Produk ${product.name} hanya sisa ${capacityInfo.remaining} untuk tanggal ini.` };
    }

    const price = Number(product.price);
    verifiedItems.push({ productId: product.id, name: product.name, price, qty: item.qty });
    total += price * item.qty;
  }

  return { items: verifiedItems, total };
}

async function createCapacityAlerts(
  supabase: Awaited<ReturnType<typeof createClient>>,
  productIds: string[],
  orderDate: string
): Promise<void> {
  const uniqueIds = Array.from(new Set(productIds));

  for (const productId of uniqueIds) {
    const { data, error } = await supabase.rpc("check_and_create_capacity_alert", {
      p_product_id: productId,
      p_order_date: orderDate,
    });

    if (error) continue;

    const result = data as { alert?: boolean; product_name?: string; used?: number; capacity?: number; utilization?: number } | null;
    if (!result || !result.alert) continue;

    const used = result.used ?? 0;
    const capacity = result.capacity ?? 0;
    const percent = Math.round((result.utilization ?? 0) * 100);

    try {
      await supabase.from("notifications").insert({
        type: "system",
        title: `${result.product_name ?? "Produk"} hampir limit`,
        body: `${used} dari ${capacity} (${percent}%) untuk ${orderDate}.`,
        link_url: "/admin",
      });
    } catch (notifyErr) {
      console.error("[createCapacityAlerts] Failed to insert notification:", notifyErr);
    }
  }
}

// FITUR BARU: Restore Pesanan
export async function restoreOrder(orderId: string) {
  try {
    await requireAdmin();
  } catch {
    return { error: "Akses ditolak." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ deleted_at: null })
    .eq("id", orderId);

  if (error) {
    return { error: "Gagal memulihkan pesanan." };
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin/orders/deleted");
  revalidatePath("/");
  return { success: true };
}