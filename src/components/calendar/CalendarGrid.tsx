"use client";

import { useState } from "react";
import { CalendarDay } from "./CalendarDay";
import { DayDetailModal } from "./DayDetailModal";
import { getCalendarGrid, getDayNames, toDateString} from "@/lib/calendar";
import type {CalendarDayData } from "@/features/calendar/queries"

interface CalendarGridProps {
  year: number;
  month: number;
  days: CalendarDayData[];
}

export function CalendarGrid({ year, month, days }: CalendarGridProps) {
  const [selected, setSelected] = useState<{
    date: Date;
    data: CalendarDayData | null;
  } | null>(null);

  const grid = getCalendarGrid(year, month);
  const dayNames = getDayNames();
  const dataMap = new Map(days.map((d) => [d.date, d]));

  function handleDayClick(data: CalendarDayData | null, date: Date) {
    setSelected({ date, data });
  }

  return (
    <>
      <div className="rounded-yumm-lg border border-neutral-100 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-2 grid grid-cols-7 gap-1">
          {dayNames.map((name) => (
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
            return (
              <CalendarDay
                key={key}
                date={date}
                currentYear={year}
                currentMonth={month}
                data={dataMap.get(key)}
                onClick={handleDayClick}
              />
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-ink-muted">
          <Legend color="bg-yumm-pink/30" label="Ada pesanan" />
          <Legend color="bg-neutral-300" label="Tidak tersedia" />
          <Legend color="bg-yumm-lemon/50" label="Bisa dipesan" />
        </div>
      </div>

      {selected && (
        <DayDetailModal
          date={selected.date}
          data={selected.data}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-sm ${color}`} />
      <span>{label}</span>
    </div>
  );
}