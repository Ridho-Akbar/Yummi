import Link from "next/link";
import {
  getMonthSchedule,
  getOrderCountsByMonth,
} from "@/features/schedule/queries";
import { ScheduleCalendar } from "@/components/admin/ScheduleCalendar";
import { BulkScheduleModal } from "@/components/admin/BulkScheduleModal";
import { getMonthName } from "@/lib/calendar";

export const metadata = {
  title: "Jadwal — Admin",
};

interface SchedulePageProps {
  searchParams: Promise<{ year?: string; month?: string }>;
}

export default async function AdminSchedulePage({
  searchParams,
}: SchedulePageProps) {
  const params = await searchParams;
  const now = new Date();
  const year = params.year ? Number(params.year) : now.getFullYear();
  const month = params.month ? Number(params.month) : now.getMonth();

  const [entries, orderCounts] = await Promise.all([
    getMonthSchedule(year, month),
    getOrderCountsByMonth(year, month),
  ]);

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            Jadwal
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Klik tanggal untuk menandai tersedia atau tidak tersedia.
          </p>
        </div>

        <BulkScheduleModal
          trigger={
            <button
              type="button"
              className="rounded-yumm border border-neutral-200 px-5 py-2.5 font-display text-sm font-semibold text-ink transition-colors hover:border-yumm-pink hover:bg-yumm-pink/5 hover:text-yumm-pink"
            >
              Atur rentang tanggal
            </button>
          }
        />
      </header>

      <div className="flex items-center justify-between gap-2">
        <Link
          href={`/admin/schedule?year=${prevYear}&month=${prevMonth}`}
          className="rounded-yumm px-4 py-2 font-display text-sm font-semibold text-ink transition-colors hover:bg-surface-muted"
        >
          ← Sebelumnya
        </Link>
        <p className="font-display text-sm font-semibold text-ink-muted">
          {getMonthName(month)} {year}
        </p>
        <Link
          href={`/admin/schedule?year=${nextYear}&month=${nextMonth}`}
          className="rounded-yumm px-4 py-2 font-display text-sm font-semibold text-ink transition-colors hover:bg-surface-muted"
        >
          Berikutnya →
        </Link>
      </div>

      <ScheduleCalendar
        year={year}
        month={month}
        entries={entries}
        orderCounts={orderCounts}
      />
    </div>
  );
}
