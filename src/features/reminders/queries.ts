import "server-only";
import { createClient } from "@/lib/supabase/server";
import { toDateString } from "@/lib/calendar";
import type {
  AdminReminder,
  GroupedReminders,
  ReminderCategory,
  ReminderSeverity,
} from "./types";

interface RawOrder {
  id: string;
  order_code: string;
  customer_name: string;
  order_date: string;
  status: string;
  payment_status: string;
}

function computeReminder(
  order: RawOrder,
  diffDays: number
): AdminReminder | null {
  let category: ReminderCategory;
  let message: string;
  let severity: ReminderSeverity;

  if (diffDays === 2) category = "h-2";
  else if (diffDays === 1) category = "h-1";
  else if (diffDays === 0) category = "h";
  else if (diffDays < 0) category = "h+";
  else return null;

  if (category === "h-2") {
    if (order.status === "pending") {
      message = "Belum dikonfirmasi ke pelanggan";
      severity = "warning";
    } else if (order.status === "confirmed") {
      message = "Konfirmasi persiapan pesanan";
      severity = "info";
    } else return null;
  } else if (category === "h-1") {
    if (order.status === "pending") {
      message = "Belum dikonfirmasi, acara besok";
      severity = "urgent";
    } else if (order.status === "confirmed") {
      message = "Siapkan pesanan untuk besok";
      severity = "warning";
    } else return null;
  } else if (category === "h") {
    if (order.status === "pending") {
      message = "Acara hari ini, belum dikonfirmasi";
      severity = "urgent";
    } else if (order.status === "confirmed") {
      message = "Kirim pesanan hari ini";
      severity = "warning";
    } else return null;
  } else {
    if (order.status === "pending") {
      message = "Terlambat! Belum dikonfirmasi";
      severity = "urgent";
    } else if (order.status === "confirmed") {
      if (order.payment_status === "paid") {
        message = "Sudah lewat, belum ditandai selesai";
        severity = "warning";
      } else if (order.payment_status === "dp") {
        message = "Sudah lewat, sisa pembayaran belum lunas";
        severity = "warning";
      } else {
        message = "Sudah lewat, belum lunas";
        severity = "warning";
      }
    } else if (order.status === "done") {
      if (order.payment_status === "paid") return null;
      if (order.payment_status === "dp") {
        message = "Selesai, sisa pembayaran belum lunas";
        severity = "warning";
      } else {
        message = "Selesai, tapi belum dibayar";
        severity = "warning";
      }
    } else return null;
  }

  return {
    key: `${category}|${order.id}`,
    orderId: order.id,
    orderCode: order.order_code,
    customerName: order.customer_name,
    orderDate: order.order_date,
    category,
    message,
    severity,
  };
}

export async function getAdminReminders(): Promise<GroupedReminders> {
  const supabase = await createClient();
  const today = new Date();
  const todayNorm = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const sixtyDaysAgo = new Date(todayNorm);
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const threeDaysFromNow = new Date(todayNorm);
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, order_code, customer_name, order_date, status, payment_status"
    )
    .is("deleted_at", null)
    .neq("status", "cancelled")
    .gte("order_date", toDateString(sixtyDaysAgo))
    .lte("order_date", toDateString(threeDaysFromNow));

  if (error) throw error;

  const grouped: GroupedReminders = {
    "h-2": [],
    "h-1": [],
    h: [],
    "h+": [],
  };

  for (const order of data ?? []) {
    const [y, m, d] = order.order_date.split("-").map(Number);
    const orderDate = new Date(y, m - 1, d);
    const diffDays = Math.round(
      (orderDate.getTime() - todayNorm.getTime()) / 86_400_000
    );

    const reminder = computeReminder(order, diffDays);
    if (!reminder) continue;

    grouped[reminder.category].push(reminder);
  }

  (Object.keys(grouped) as ReminderCategory[]).forEach((key) => {
    grouped[key].sort((a, b) => a.orderDate.localeCompare(b.orderDate));
  });

  return grouped;
}

export function countReminders(grouped: GroupedReminders): number {
  return (
    grouped["h-2"].length +
    grouped["h-1"].length +
    grouped.h.length +
    grouped["h+"].length
  );
}
