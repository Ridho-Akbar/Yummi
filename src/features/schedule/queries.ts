import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getMonthRange, toDateString } from "@/lib/calendar";

export interface ScheduleEntry {
  date: string;
  isAvailable: boolean;
  note: string | null;
}

export async function getMonthSchedule(
  year: number,
  month: number
): Promise<ScheduleEntry[]> {
  const supabase = await createClient();
  const { firstDay, lastDay } = getMonthRange(year, month);

  const { data, error } = await supabase
    .from("schedule")
    .select("date, is_available, note")
    .gte("date", toDateString(firstDay))
    .lte("date", toDateString(lastDay))
    .order("date");

  if (error) throw error;

  return (data ?? []).map((s) => ({
    date: s.date,
    isAvailable: s.is_available,
    note: s.note,
  }));
}

export async function getOrderCountsByMonth(
  year: number,
  month: number
): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { firstDay, lastDay } = getMonthRange(year, month);

  const { data, error } = await supabase
    .from("orders")
    .select("order_date")
    .gte("order_date", toDateString(firstDay))
    .lte("order_date", toDateString(lastDay))
    .neq("status", "cancelled")
    .is("deleted_at", null);

  if (error) throw error;

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.order_date] = (counts[row.order_date] ?? 0) + 1;
  }
  return counts;
}