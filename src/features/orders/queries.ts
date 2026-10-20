import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getMonthRange, toDateString } from "@/lib/calendar";
import type { Product } from "@/types";

export type OrderStatus = "pending" | "confirmed" | "done" | "cancelled";
export type PaymentStatus = "unpaid" | "dp" | "paid";

export async function getAvailableProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_available", true)
    .gt("daily_capacity", 0)
    .order("name");

  if (error) throw error;
  return data ?? [];
}

export interface ProductCapacity {
  productId: string;
  dailyCapacity: number;
  usedQty: number;
  remaining: number;
}

export async function getProductCapacitiesForDate(
  orderDate: string
): Promise<Record<string, ProductCapacity>> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_product_capacity_for_date",
    { p_order_date: orderDate }
  );

  if (error) throw error;

  const map: Record<string, ProductCapacity> = {};
  for (const row of data ?? []) {
    map[row.product_id] = {
      productId: row.product_id,
      dailyCapacity: row.daily_capacity,
      usedQty: row.used_qty,
      remaining: row.remaining,
    };
  }
  return map;
}

export interface AdminOrderListItem {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string | null;
  orderDate: string;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  isAnonymous: boolean;
  createdAt: string;
}

interface RawOrderRow {
  id: string;
  order_code: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string | null;
  order_date: string;
  total: number;
  status: string;
  payment_status: string;
  amount_paid: number;
  is_anonymous: boolean;
  created_at: string;
}

function mapRow(o: RawOrderRow): AdminOrderListItem {
  return {
    id: o.id,
    orderCode: o.order_code,
    customerName: o.customer_name,
    customerPhone: o.customer_phone,
    customerAddress: o.customer_address,
    orderDate: o.order_date,
    total: Number(o.total),
    status: o.status as OrderStatus,
    paymentStatus: o.payment_status as PaymentStatus,
    amountPaid: Number(o.amount_paid),
    isAnonymous: o.is_anonymous,
    createdAt: o.created_at,
  };
}

const LIST_COLUMNS =
  "id, order_code, customer_name, customer_phone, customer_address, order_date, total, status, payment_status, amount_paid, is_anonymous, created_at";

export interface DayOrderSummary {
  date: string;
  count: number;
  statuses: OrderStatus[];
}

export interface MonthOrders {
  summary: DayOrderSummary[];
  ordersByDate: Record<string, AdminOrderListItem[]>;
  totalRevenue: number;
  totalCount: number;
}

export async function getMonthOrders(
  year: number,
  month: number
): Promise<MonthOrders> {
  const supabase = await createClient();
  const { firstDay, lastDay } = getMonthRange(year, month);

  const { data, error } = await supabase
    .from("orders")
    .select(LIST_COLUMNS)
    .gte("order_date", toDateString(firstDay))
    .lte("order_date", toDateString(lastDay))
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const ordersByDate: Record<string, AdminOrderListItem[]> = {};
  let totalRevenue = 0;
  let totalCount = 0;

  for (const row of data ?? []) {
    const item = mapRow(row);
    if (!ordersByDate[item.orderDate]) ordersByDate[item.orderDate] = [];
    ordersByDate[item.orderDate].push(item);

    totalCount++;
    if (item.status === "confirmed" || item.status === "done") {
      totalRevenue += item.total;
    }
  }

  const summary: DayOrderSummary[] = Object.entries(ordersByDate).map(
    ([date, orders]) => ({
      date,
      count: orders.length,
      statuses: orders.map((o) => o.status),
    })
  );

  return { summary, ordersByDate, totalRevenue, totalCount };
}

function escapeLike(value: string): string {
  return value.replace(/[%_\\]/g, (m) => `\\${m}`);
}

export type DateFilter = "all" | "today" | "week" | "month";

function getDateRange(filter: DateFilter): {
  start: string | null;
  end: string | null;
} {
  if (filter === "all") return { start: null, end: null };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (filter === "today") {
    const d = toDateString(today);
    return { start: d, end: d };
  }

  if (filter === "week") {
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - diff);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return { start: toDateString(monday), end: toDateString(sunday) };
  }

  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  return { start: toDateString(firstDay), end: toDateString(lastDay) };
}

export interface SearchAdminOrdersParams {
  query?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  dateFilter?: DateFilter;
  limit?: number;
  offset?: number;
}

export interface SearchAdminOrdersResult {
  orders: AdminOrderListItem[];
  total: number;
}

export async function searchAdminOrders({
  query = "",
  status,
  paymentStatus,
  dateFilter = "all",
  limit = 15,
  offset = 0,
}: SearchAdminOrdersParams = {}): Promise<SearchAdminOrdersResult> {
  const supabase = await createClient();

  const trimmed = query.trim();
  const escaped = trimmed ? escapeLike(trimmed) : "";
  const orClause = trimmed
    ? `order_code.ilike.%${escaped}%,customer_name.ilike.%${escaped}%,customer_phone.ilike.%${escaped}%,customer_address.ilike.%${escaped}%`
    : null;
  const { start, end } = getDateRange(dateFilter);

  // List query
  let listQuery = supabase
    .from("orders")
    .select(LIST_COLUMNS)
    .is("deleted_at", null);

  if (orClause) listQuery = listQuery.or(orClause);
  if (status) listQuery = listQuery.eq("status", status);
  if (paymentStatus) listQuery = listQuery.eq("payment_status", paymentStatus);
  if (start) listQuery = listQuery.gte("order_date", start);
  if (end) listQuery = listQuery.lte("order_date", end);

  // Count query (same filters, head-only)
  let countQuery = supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .is("deleted_at", null);

  if (orClause) countQuery = countQuery.or(orClause);
  if (status) countQuery = countQuery.eq("status", status);
  if (paymentStatus) countQuery = countQuery.eq("payment_status", paymentStatus);
  if (start) countQuery = countQuery.gte("order_date", start);
  if (end) countQuery = countQuery.lte("order_date", end);

  const [listResult, countResult] = await Promise.all([
    listQuery.order("created_at", { ascending: false }).range(offset, offset + limit - 1),
    countQuery,
  ]);

  if (listResult.error) throw listResult.error;
  if (countResult.error) throw countResult.error;

  return {
    orders: (listResult.data ?? []).map((row: RawOrderRow) => mapRow(row)),
    total: countResult.count ?? 0,
  };
}

export interface AdminOrderDetail {
  id: string;
  orderCode: string;
  userId: string | null;
  customerName: string;
  customerPhone: string;
  customerAddress: string | null;
  orderDate: string;
  items: { productId: string; name: string; price: number; qty: number }[];
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  note: string | null;
  isAnonymous: boolean;
  createdAt: string;
}

export async function getAdminOrderDetailByCode(
  orderCode: string
): Promise<AdminOrderDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_code", orderCode)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    orderCode: data.order_code,
    userId: data.user_id,
    customerName: data.customer_name,
    customerPhone: data.customer_phone,
    customerAddress: data.customer_address,
    orderDate: data.order_date,
    items: (data.items ?? []) as AdminOrderDetail["items"],
    total: Number(data.total),
    status: data.status as OrderStatus,
    paymentStatus: data.payment_status as PaymentStatus,
    amountPaid: Number(data.amount_paid),
    note: data.note,
    isAnonymous: data.is_anonymous,
    createdAt: data.created_at,
  };
}

export interface MenuProduct extends Product {
  totalSold: number;
  badge?: "terbaru" | "terlaris" | "best_seller";
}

export async function getMenuProducts(): Promise<MenuProduct[]> {
  const supabase = await createClient();

  const [productsRes, pinsRes, salesRes] = await Promise.all([
    supabase.from("products").select("*").eq("is_available", true).order("name"),
    supabase.from("homepage_pins").select("product_id, category"),
    supabase.rpc("get_product_total_sales"),
  ]);

  if (productsRes.error) throw productsRes.error;

  // 1. Map pins (hanya ambil 1 prioritas: terlaris > best_seller > terbaru)
  const pinsMap = new Map<string, "terbaru" | "terlaris" | "best_seller">();
  const priority = { terlaris: 3, best_seller: 2, latest: 1 };
  
  for (const pin of pinsRes.data ?? []) {
    const current = pinsMap.get(pin.product_id);
    const pinType = pin.category === "latest" ? "terbaru" : pin.category;
    if (!current || priority[pinType] > priority[current]) {
      pinsMap.set(pin.product_id, pinType as any);
    }
  }

  // 2. Map total sales
  const salesMap = new Map<string, number>();
  for (const row of salesRes.data ?? []) {
    salesMap.set(row.product_id, Number(row.total_sold));
  }

  // 3. Gabungkan data
  return (productsRes.data ?? []).map((p) => ({
    ...p,
    totalSold: salesMap.get(p.id) ?? 0,
    badge: pinsMap.get(p.id),
  }));
}
