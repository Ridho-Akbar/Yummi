"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ScheduleDayModal } from "./ScheduleDayModal";
import {
  getCalendarGrid,
  getDayNames,
  getMonthName,
  isSameMonth,
  toDateString,
} from "@/lib/calendar";
import type { ScheduleEntry } from "@/features/schedule/queries";

interface ScheduleCalendarProps {
  year: number;
  month: number;
  entries: ScheduleEntry[];
  orderCounts: Record<string, number>;
}

export function ScheduleCalendar({
  year,
  month,
  entries,
  orderCounts,
}: ScheduleCalendarProps) {
  const [selected, setSelected] = useState<Date | null>(null);
  const grid = getCalendarGrid(year, month);
  const entryMap = new Map(entries.map((e) => [e.date, e]));

  return (
    <>
      <div className="rounded-yumm-lg border border-neutral-100 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="mb-4 text-center font-display text-xl font-bold text-ink">
          {getMonthName(month)} {year}
        </h2>

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
            const entry = entryMap.get(key);
            const orderCount = orderCounts[key] ?? 0;
            const inMonth = isSameMonth(date, year, month);

            // Klasifikasi tampilan:
            // - entry.isAvailable = false → coral (tutup)
            // - entry.isAvailable = true + note → mint (tersedia dengan catatan)
            // - entry.isAvailable = true tanpa note → default (legacy, anggap kosong)
            // - tidak ada entry → default
            const isClosed = entry?.isAvailable === false;
            const isAvailableWithNote =
              entry?.isAvailable === true && Boolean(entry.note);

            return (
              <button
                key={key}
                type="button"
                disabled={!inMonth}
                onClick={() => setSelected(date)}
                className={cn(
                  "relative flex aspect-square flex-col items-center justify-center",
                  "rounded-yumm p-1 transition-all duration-150",
                  !inMonth && "cursor-default opacity-30",
                  inMonth && "hover:scale-105",
                  inMonth && isClosed && "bg-yumm-coral/15",
                  inMonth && isAvailableWithNote && "bg-yumm-mint/30",
                  inMonth &&
                    !isClosed &&
                    !isAvailableWithNote &&
                    "bg-surface-muted hover:bg-yumm-lemon/40"
                )}
              >
                {orderCount > 0 && inMonth && (
                  <span
                    className={cn(
                      "absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center",
                      "rounded-full px-1 font-display text-[10px] font-bold",
                      "bg-yumm-pink text-white"
                    )}
                  >
                    {orderCount > 9 ? "9+" : orderCount}
                  </span>
                )}

                <span className="font-display text-sm font-semibold text-ink">
                  {date.getDate()}
                </span>

                {inMonth && entry?.note && (
                  <span className="absolute bottom-0.5 h-1.5 w-1.5 rounded-full bg-yumm-lilac" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-ink-muted">
          <Legend color="bg-surface-muted" label="Default" />
          <Legend color="bg-yumm-mint/50" label="Tersedia + catatan" />
          <Legend color="bg-yumm-coral/30" label="Tutup" />
          <Legend color="bg-yumm-lilac" label="Ada catatan" dot />
          <Legend color="bg-yumm-pink" label="Ada pesanan" dot />
        </div>
      </div>

      {selected && (
        <ScheduleDayModal
          date={selected}
          entry={entryMap.get(toDateString(selected))}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

function Legend({
  color,
  label,
  dot,
}: {
  color: string;
  label: string;
  dot?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          dot ? "h-1.5 w-1.5 rounded-full" : "h-3 w-3 rounded-sm",
          color
        )}
      />
      <span>{label}</span>
    </div>
  );
}