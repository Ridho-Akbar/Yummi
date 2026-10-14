import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getMonthRange, toDateString, getMonthName } from "@/lib/calendar";
import type {
  MonthlyRevenue,
  TopProduct,
  TopCustomer,
  ReportData,
} from "./types";

export async function getReportData(
  year: number,
  month: number
): Promise<ReportData> {
  const supabase = await createClient();
  const { firstDay, lastDay } = getMonthRange(year, month);

  const startDate = toDateString(firstDay);
  const endDate = toDateString(lastDay);

  const [revenueResult, productsResult, customersResult] = await Promise.all([
    supabase.rpc("get_monthly_revenue", { p_months: 12 }),
    supabase.rpc("get_top_products", {
      p_start_date: startDate,
      p_end_date: endDate,
      p_limit: 10,
    }),
    supabase.rpc("get_top_customers", {
      p_start_date: startDate,
      p_end_date: endDate,
      p_limit: 10,
    }),
  ]);

  if (revenueResult.error) throw revenueResult.error;
  if (productsResult.error) throw productsResult.error;
  if (customersResult.error) throw customersResult.error;

  const monthlyRevenue: MonthlyRevenue[] = (revenueResult.data ?? []).map(
    (row) => ({
      monthKey: row.month_key,
      monthLabel: row.month_label,
      orderCount: row.order_count,
      revenue: Number(row.revenue),
    })
  );

  const topProducts: TopProduct[] = (productsResult.data ?? []).map((row) => ({
    productId: row.product_id,
    productName: row.product_name,
    totalQty: row.total_qty,
    totalRevenue: Number(row.total_revenue),
  }));

  const topCustomers: TopCustomer[] = (customersResult.data ?? []).map(
    (row) => ({
      customerPhone: row.customer_phone,
      customerName: row.customer_name,
      orderCount: row.order_count,
      totalSpent: Number(row.total_spent),
    })
  );

  const periodRevenue = topProducts.reduce(
    (sum, p) => sum + p.totalRevenue,
    0
  );
  const periodOrderCount = topCustomers.reduce(
    (sum, c) => sum + c.orderCount,
    0
  );

  return {
    periodLabel: `${getMonthName(month)} ${year}`,
    startDate,
    endDate,
    monthlyRevenue,
    topProducts,
    topCustomers,
    periodRevenue,
    periodOrderCount,
  };
}
