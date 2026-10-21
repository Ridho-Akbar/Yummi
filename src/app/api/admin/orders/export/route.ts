import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { buildOrdersCsv } from "@/features/orders/export";
import { toDateString } from "@/lib/calendar";

export const dynamic = "force-dynamic";

const VALID_PERIODS = ["all", "today", "week", "month"] as const;
type Period = (typeof VALID_PERIODS)[number];

const VALID_STATUSES = ["pending", "confirmed", "done", "cancelled"] as const;
type Status = (typeof VALID_STATUSES)[number];

const VALID_PAYMENT_STATUSES = ["unpaid", "dp", "paid"] as const;
type PaymentStatus = (typeof VALID_PAYMENT_STATUSES)[number];

const MAX_ROWS = 5000;

interface DateRange {
  start: string | null;
  end: string | null;
  label: string;
}

function getDateRange(period: Period): DateRange {
  if (period === "all") {
    return { start: null, end: null, label: "semua" };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (period === "today") {
    const d = toDateString(today);
    return { start: d, end: d, label: "hari-ini" };
  }

  if (period === "week") {
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - diff);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return {
      start: toDateString(monday),
      end: toDateString(sunday),
      label: "minggu-ini",
    };
  }

  // month
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return {
    start: toDateString(firstDay),
    end: toDateString(lastDay),
    label: "bulan-ini",
  };
}

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);

  const rawPeriod = searchParams.get("period") ?? "all";
  const period: Period = (VALID_PERIODS as readonly string[]).includes(
    rawPeriod
  )
    ? (rawPeriod as Period)
    : "all";

  const rawStatus = searchParams.get("status");
  const status: Status | undefined =
    rawStatus && (VALID_STATUSES as readonly string[]).includes(rawStatus)
      ? (rawStatus as Status)
      : undefined;

  const rawPayment = searchParams.get("payment");
  const payment: PaymentStatus | undefined =
    rawPayment &&
    (VALID_PAYMENT_STATUSES as readonly string[]).includes(rawPayment)
      ? (rawPayment as PaymentStatus)
      : undefined;

  const { start, end, label } = getDateRange(period);

  const supabase = await createClient();

  // Count first to enforce row limit
  let countQuery = supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .is("deleted_at", null);

  if (start) countQuery = countQuery.gte("order_date", start);
  if (end) countQuery = countQuery.lte("order_date", end);
  if (status) countQuery = countQuery.eq("status", status);
  if (payment) countQuery = countQuery.eq("payment_status", payment);

  const { count, error: countError } = await countQuery;

  if (countError) {
    return NextResponse.json(
      { error: "Gagal menghitung data pesanan." },
      { status: 500 }
    );
  }

  if (count !== null && count > MAX_ROWS) {
    return NextResponse.json(
      {
        error: `Data terlalu besar (${count.toLocaleString("id-ID")} pesanan). Gunakan filter waktu yang lebih spesifik. Maksimal ${MAX_ROWS.toLocaleString("id-ID")} pesanan per export.`,
      },
      { status: 413 }
    );
  }

  let query = supabase
    .from("orders")
    .select(
      "order_code, order_date, customer_name, customer_phone, customer_address, items, total, status, payment_status, amount_paid, note, created_at"
    )
    .is("deleted_at", null)
    .order("order_date", { ascending: true })
    .limit(MAX_ROWS);

  if (start) query = query.gte("order_date", start);
  if (end) query = query.lte("order_date", end);
  if (status) query = query.eq("status", status);
  if (payment) query = query.eq("payment_status", payment);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data pesanan." },
      { status: 500 }
    );
  }

  const csv = buildOrdersCsv(data ?? []);
  const today = new Date().toISOString().slice(0, 10);
  const filename = `pesanan-${label}-${today}.csv`;

  return new NextResponse("\uFEFF" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}