import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getMonthRange, toDateString } from "@/lib/calendar";

export interface CalendarDayData {
  date: string;
  isAvailable: boolean;
  scheduleNote: string | null;
  orders: CalendarOrder[];
}

export interface CalendarOrder {
  id: string;
  customerName: string;
  status: "pending" | "confirmed" | "done" | "cancelled";
}

export async function getCalendarData(
  year: number,
  month: number
): Promise<CalendarDayData[]> {
  const supabase = await createClient();
  const { firstDay, lastDay } = getMonthRange(year, month);

  const startDate = toDateString(firstDay);
  const endDate = toDateString(lastDay);

  const [scheduleResult, ordersResult] = await Promise.all([
    supabase
      .from("schedule")
      .select("date, is_available, note")
      .gte("date", startDate)
      .lte("date", endDate),
    supabase
      .from("public_orders")
      .select("id, order_date, customer_name, status")
      .gte("order_date", startDate)
      .lte("order_date", endDate),
  ]);

  if (scheduleResult.error) throw scheduleResult.error;
  if (ordersResult.error) throw ordersResult.error;

  const scheduleMap = new Map(
    (scheduleResult.data ?? []).map((s) => [s.date, s])
  );
  const ordersMap = new Map<string, CalendarOrder[]>();

  for (const order of ordersResult.data ?? []) {
    const list = ordersMap.get(order.order_date) ?? [];
    list.push({
      id: order.id,
      customerName: order.customer_name,
      status: order.status,
    });
    ordersMap.set(order.order_date, list);
  }

  const days: CalendarDayData[] = [];
  const cursor = new Date(firstDay);

  while (cursor <= lastDay) {
    const dateStr = toDateString(cursor);
    const schedule = scheduleMap.get(dateStr);
    days.push({
      date: dateStr,
      isAvailable: schedule?.is_available ?? true,
      scheduleNote: schedule?.note ?? null,
      orders: ordersMap.get(dateStr) ?? [],
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}