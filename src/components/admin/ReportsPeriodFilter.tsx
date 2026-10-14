"use client";

import { useRouter } from "next/navigation";
import { getMonthName } from "@/lib/calendar";

interface ReportsPeriodFilterProps {
  year: number;
  month: number;
}

export function ReportsPeriodFilter({
  year,
  month,
}: ReportsPeriodFilterProps) {
  const router = useRouter();
  const now = new Date();

  const years: number[] = [];
  for (let y = now.getFullYear() - 2; y <= now.getFullYear() + 1; y++) {
    years.push(y);
  }

  function handleChange(newYear: number, newMonth: number) {
    router.replace(`/admin/reports?year=${newYear}&month=${newMonth}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={month}
        onChange={(e) => handleChange(year, Number(e.target.value))}
        className="rounded-yumm border border-neutral-200 bg-white px-4 py-2.5 font-display text-sm font-semibold text-ink focus:border-yumm-pink focus:outline-hidden focus:ring-2 focus:ring-yumm-pink/20"
      >
        {Array.from({ length: 12 }, (_, i) => (
          <option key={i} value={i}>
            {getMonthName(i)}
          </option>
        ))}
      </select>

      <select
        value={year}
        onChange={(e) => handleChange(Number(e.target.value), month)}
        className="rounded-yumm border border-neutral-200 bg-white px-4 py-2.5 font-display text-sm font-semibold text-ink focus:border-yumm-pink focus:outline-hidden focus:ring-2 focus:ring-yumm-pink/20"
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}