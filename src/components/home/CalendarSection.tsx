import Link from "next/link";
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
    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Cek Tanggal <span className="text-yumm-pink">Tersedia</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
            Klik tanggal di kalender untuk melihat siapa saja yang sudah memesan atau memilih jadwal pengirimanmu.
          </p>
        </div>

        {/* Navigasi Bulan */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href={`/?year=${prevYear}&month=${prevMonth}#kalender`}
            className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-5 py-2.5 font-display text-sm font-semibold text-ink-muted transition-all hover:-translate-y-0.5 hover:border-yumm-pink hover:text-yumm-pink hover:shadow-sm"
          >
            ← Sebelumnya
          </Link>
          
          <p className="text-center font-display text-lg font-bold text-ink sm:text-xl">
            {getMonthName(month)} {year}
          </p>

          <Link
            href={`/?year=${nextYear}&month=${nextMonth}#kalender`}
            className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-5 py-2.5 font-display text-sm font-semibold text-ink-muted transition-all hover:-translate-y-0.5 hover:border-yumm-pink hover:text-yumm-pink hover:shadow-sm"
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