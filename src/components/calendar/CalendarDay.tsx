"use client";

import { cn } from "@/lib/utils";
import { isSameMonth, isPast } from "@/lib/calendar";
import type { CalendarDayData } from "@/features/calendar/queries"; // Perbaikan import

interface CalendarDayProps {
  date: Date;
  currentYear: number;
  currentMonth: number;
  data?: CalendarDayData;
  onClick: (data: CalendarDayData | null, date: Date) => void;
}

export function CalendarDay({ date, currentYear, currentMonth, data, onClick }: CalendarDayProps) {
  const inMonth = isSameMonth(date, currentYear, currentMonth);
  const past = isPast(date);
  const orderCount = data?.orders.length ?? 0;
  const unavailable = data?.isAvailable === false;

  const hasContent = orderCount > 0 || unavailable;
  const clickable = inMonth && (hasContent || !past);

  return (
    <button
      type="button"
      onClick={() => clickable && onClick(data ?? null, date)}
      disabled={!clickable}
      className={cn(
        "relative flex aspect-square flex-col items-center justify-center",
        "rounded-yumm p-1 transition-all duration-150",
        inMonth ? "text-ink" : "text-ink-muted/40",
        past && "opacity-50",
        unavailable && inMonth && "bg-neutral-200 text-ink-muted",
        orderCount > 0 && inMonth && "bg-yumm-pink/15",
        clickable && "hover:scale-105 hover:bg-yumm-lemon/40",
        !clickable && "cursor-default"
      )}
    >
      <span className="font-display text-sm font-semibold">{date.getDate()}</span>

      {orderCount > 0 && inMonth && (
        <span className="absolute bottom-1 flex gap-0.5">
          {data!.orders.slice(0, 3).map((order: { id: string; status: string }) => (
            <span
              key={order.id}
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                order.status === "pending" && "bg-yumm-coral",
                order.status === "confirmed" && "bg-yumm-lilac",
                order.status === "done" && "bg-yumm-mint",
                order.status === "cancelled" && "bg-neutral-400"
              )}
            />
          ))}
        </span>
      )}

      {unavailable && inMonth && orderCount === 0 && (
        <span className="absolute bottom-1 text-[10px] font-bold text-ink-muted">×</span>
      )}
    </button>
  );
}