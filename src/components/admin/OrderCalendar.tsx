"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { OrderCalendarDayModal } from "./OrderCalendarDayModal";
import {
  getCalendarGrid,
  getDayNames,
  getMonthName,
  isSameMonth,
  toDateString,
} from "@/lib/calendar";
import type {
  AdminOrderListItem,
  DayOrderSummary,
  OrderStatus,
} from "@/features/orders/queries";

interface OrderCalendarProps {
  year: number;
  month: number;
  summary: DayOrderSummary[];
  ordersByDate: Record<string, AdminOrderListItem[]>;
  totalRevenue: number;
  totalCount: number;
}

const STATUS_PRIORITY: OrderStatus[] = [
  "pending",
  "confirmed",
  "done",
  "cancelled",
];

function dominantStatus(statuses: OrderStatus[]): OrderStatus | null {
  for (const status of STATUS_PRIORITY) {
    if (statuses.includes(status)) return status;
  }
  return null;
}

function dayBackground(status: OrderStatus | null): string {
  switch (status) {
    case "pending":
      return "bg-yumm-pink/20";
    case "confirmed":
      return "bg-yumm-lilac/15";
    case "done":
      return "bg-yumm-mint/30";
    case "cancelled":
      return "bg-neutral-200";
    default:
      return "bg-surface-muted";
  }
}

export function OrderCalendar({
  year,
  month,
  summary,
  ordersByDate,
  totalRevenue,
  totalCount,
}: OrderCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const grid = getCalendarGrid(year, month);
  const summaryMap = new Map(summary.map((s) => [s.date, s]));

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  const selectedOrders = selectedDate
    ? ordersByDate[selectedDate] ?? []
    : [];

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <Link
          href={`/admin/orders?year=${prevYear}&month=${prevMonth}`}
          className="rounded-yumm px-4 py-2 font-display text-sm font-semibold text-ink transition-colors hover:bg-surface-muted"
        >
          ← Sebelumnya
        </Link>
        <div className="text-center">
          <p className="font-display text-sm font-semibold text-ink-muted">
            {getMonthName(month)} {year}
          </p>
          {totalCount > 0 && (
            <p className="mt-0.5 text-xs text-ink-muted">
              {totalCount} pesanan ·{" "}
              <span className="font-semibold text-yumm-pink">
                Rp{totalRevenue.toLocaleString("id-ID")}
              </span>
            </p>
          )}
        </div>
        <Link
          href={`/admin/orders?year=${nextYear}&month=${nextMonth}`}
          className="rounded-yumm px-4 py-2 font-display text-sm font-semibold text-ink transition-colors hover:bg-surface-muted"
        >
          Berikutnya →
        </Link>
      </div>

      <div className="rounded-yumm-lg border border-neutral-100 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-2 grid grid-cols-7 gap-1">
          {getDayNames().map((name) => (
            <div
              key={name}
              className="py-2 text-center text-xs font-semibold uppercase tracking-wide text-ink-muted"
            >
              {name}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {grid.map((date) => {
            const key = toDateString(date);
            const entry = summaryMap.get(key);
            const inMonth = isSameMonth(date, year, month);
            const count = entry?.count ?? 0;
            const dominant = entry ? dominantStatus(entry.statuses) : null;

            return (
              <button
                key={key}
                type="button"
                disabled={!inMonth || count === 0}
                onClick={() => count > 0 && setSelectedDate(key)}
                className={cn(
                  "relative flex aspect-square flex-col items-center justify-center",
                  "rounded-yumm p-1 transition-all duration-150",
                  !inMonth && "cursor-default opacity-30",
                  inMonth && count > 0 && "hover:scale-105",
                  inMonth && dayBackground(dominant),
                  inMonth && count === 0 && "bg-surface-muted"
                )}
              >
                {count > 0 && inMonth && (
                  <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-yumm-pink px-1 font-display text-[10px] font-bold text-white">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
                <span className="font-display text-sm font-semibold text-ink">
                  {date.getDate()}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-ink-muted">
          <Legend color="bg-yumm-pink/30" label="Ada pending" />
          <Legend color="bg-yumm-lilac/25" label="Dikonfirmasi" />
          <Legend color="bg-yumm-mint/50" label="Selesai" />
          <Legend color="bg-neutral-300" label="Dibatalkan" />
        </div>
      </div>

      {selectedDate && (
        <OrderCalendarDayModal
          date={selectedDate}
          orders={selectedOrders}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("h-3 w-3 rounded-sm", color)} />
      <span>{label}</span>
    </div>
  );
}