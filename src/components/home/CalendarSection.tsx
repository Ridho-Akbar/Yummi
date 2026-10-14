import Link from "next/link";
import { Calendar } from "lucide-react";
import { ICON_SIZE } from "@/lib/icons";
import { getMonthName } from "@/lib/calendar";
import type { CalendarDayData } from "@/features/calendar/queries";

import { CalendarGrid } from "@/components/calendar/CalendarGrid";

interface CalendarSectionProps {
  year: number;
  month: number;
  days: CalendarDayData[];
}

export function CalendarSection({
  year,
  month,
  days,
}: CalendarSectionProps) {
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-yumm-pink">
            Jadwal Ketersediaan
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
            Cek tanggal yang masih kosong
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
            Klik tanggal untuk lihat siapa saja yang sudah pesan di hari itu.
          </p>
        </div>

        <div className="mb-3 flex items-center justify-between gap-2">
          <Link
            href={`/?year=${prevYear}&month=${prevMonth}#kalender`}
            className="rounded-yumm px-4 py-2 font-display text-sm font-semibold text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
          >
            ← Sebelumnya
          </Link>
          <div className="flex items-center gap-2 text-center">
            <Calendar
              size={ICON_SIZE.sm}
              className="text-yumm-pink"
              strokeWidth={2.5}
            />
            <p className="font-display text-sm font-semibold text-ink">
              {getMonthName(month)} {year}
            </p>
          </div>
          <Link
            href={`/?year=${nextYear}&month=${nextMonth}#kalender`}
            className="rounded-yumm px-4 py-2 font-display text-sm font-semibold text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
          >
            Berikutnya →
          </Link>
        </div>

        <div id="kalender">
          <CalendarGrid year={year} month={month} days={days} />
        </div>
      </div>
    </section>
  );
}
