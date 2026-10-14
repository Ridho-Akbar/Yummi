import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus, PaymentStatus } from "@/features/orders/queries";

export interface RevenueSummary {
  thisMonth: number;
  lastMonth: number;
  growthPercent: number | null;
  thisMonthCount: number;
}

export interface CapacityUtilizationItem {
  productId: string;
  productName: string;
  dailyCapacity: number;
  usedQty: number;
  utilization: number;
}

export interface CapacityAlertGroup {
  date: string;
  items: CapacityUtilizationItem[];
}

export interface TodayOrderItem {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  itemCount: number;
}

export interface AdminDashboardStats {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  todayOrders: number;
  revenue: RevenueSummary;
  capacityAlerts: CapacityAlertGroup[];
  todayOrdersList: TodayOrderItem[];
}

function firstDayOfMonth(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-01`;
}

function firstDayOfNextMonth(year: number, month: number): string {
  const next = new Date(year, month + 1, 1);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}-01`;
}

async function getRevenueForRange(
  startDate: string,
  endDate: string
): Promise<{ total: number; count: number }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("total")
    .in("status", ["confirmed", "done"])
    .gte("order_date", startDate)
    .lt("order_date", endDate)
    .is("deleted_at", null);

  if (error) throw error;

  const rows = data ?? [];
  return {
    total: rows.reduce((sum, r) => sum + Number(r.total), 0),
    count: rows.length,
  };
}

async function getCapacityAlerts(): Promise<CapacityAlertGroup[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_capacity_utilization");

  if (error) {
    console.error("[getCapacityAlerts] RPC error:", error);
    return [];
  }

  const grouped: Record<string, CapacityUtilizationItem[]> = {};

  for (const row of data ?? []) {
    const key = row.order_date;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push({
      productId: row.product_id,
      productName: row.product_name,
      dailyCapacity: row.daily_capacity,
      usedQty: row.used_qty,
      utilization: Number(row.utilization),
    });
  }

  return Object.entries(grouped)
    .map(([date, items]) => ({ date, items }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

async function getTodayOrdersList(): Promise<TodayOrderItem[]> {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, order_code, customer_name, customer_phone, total, status, payment_status, amount_paid, items"
    )
    .eq("order_date", today)
    .is("deleted_at", null)
    .neq("status", "cancelled")
    .order("status", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[getTodayOrdersList] error:", error);
    return [];
  }

  return (data ?? []).map((row) => {
    const items = Array.isArray(row.items) ? row.items : [];
    const itemCount = items.reduce(
      (sum: number, i: { qty?: number }) => sum + (i.qty ?? 0),
      0
    );

    return {
      id: row.id,
      orderCode: row.order_code,
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
      total: Number(row.total),
      status: row.status as OrderStatus,
      paymentStatus: row.payment_status as PaymentStatus,
      amountPaid: Number(row.amount_paid),
      itemCount,
    };
  });
}

export async function getDashboardStats(): Promise<AdminDashboardStats> {
  const supabase = await createClient();
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const year = today.getFullYear();
  const month = today.getMonth();

  const thisMonthStart = firstDayOfMonth(year, month);
  const nextMonthStart = firstDayOfNextMonth(year, month);
  const prevMonthStart = firstDayOfMonth(
    month === 0 ? year - 1 : year,
    month === 0 ? 11 : month - 1
  );

  const [
    allResult,
    pendingResult,
    confirmedResult,
    todayResult,
    thisMonthRevenue,
    lastMonthRevenue,
    capacityAlerts,
    todayOrdersList,
  ] = await Promise.all([
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .is("deleted_at", null),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")
      .is("deleted_at", null),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "confirmed")
      .is("deleted_at", null),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .gte("created_at", `${todayStr}T00:00:00`)
      .is("deleted_at", null),
    getRevenueForRange(thisMonthStart, nextMonthStart),
    getRevenueForRange(prevMonthStart, thisMonthStart),
    getCapacityAlerts(),
    getTodayOrdersList(),
  ]);

  const growthPercent =
    lastMonthRevenue.total > 0
      ? ((thisMonthRevenue.total - lastMonthRevenue.total) /
          lastMonthRevenue.total) *
        100
      : null;

  return {
    totalOrders: allResult.count ?? 0,
    pendingOrders: pendingResult.count ?? 0,
    confirmedOrders: confirmedResult.count ?? 0,
    todayOrders: todayResult.count ?? 0,
    revenue: {
      thisMonth: thisMonthRevenue.total,
      lastMonth: lastMonthRevenue.total,
      growthPercent,
      thisMonthCount: thisMonthRevenue.count,
    },
    capacityAlerts,
    todayOrdersList,
  };
}