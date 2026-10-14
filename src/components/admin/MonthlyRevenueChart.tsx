import { cn } from "@/lib/utils";
import type { MonthlyRevenue } from "@/features/reports/types";

interface MonthlyRevenueChartProps {
  data: MonthlyRevenue[];
  highlightMonthKey: string;
}

export function MonthlyRevenueChart({
  data,
  highlightMonthKey,
}: MonthlyRevenueChartProps) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-ink-muted">Belum ada data pendapatan.</p>
    );
  }

  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-1 sm:gap-2">
        {data.map((month) => {
          const heightPercent = (month.revenue / maxRevenue) * 100;
          const isHighlighted = month.monthKey === highlightMonthKey;

          return (
            <div
              key={month.monthKey}
              className="group flex flex-1 flex-col items-center gap-2"
            >
              <div className="relative flex h-32 w-full items-end sm:h-40">
                <div
                  className={cn(
                    "w-full rounded-t-md transition-all duration-200",
                    isHighlighted
                      ? "bg-yumm-pink"
                      : "bg-yumm-pink/30 group-hover:bg-yumm-pink/50"
                  )}
                  style={{
                    height: `${Math.max(heightPercent, 2)}%`,
                    minHeight: "4px",
                  }}
                />
                <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-yumm bg-ink px-2 py-1 text-[10px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                  Rp{month.revenue.toLocaleString("id-ID")}
                </div>
              </div>
              <span
                className={cn(
                  "truncate text-[10px] font-semibold uppercase tracking-tight sm:text-[11px]",
                  isHighlighted ? "text-yumm-pink" : "text-ink-muted"
                )}
              >
                {month.monthLabel.split(" ")[0]}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between border-t border-neutral-100 pt-3 text-xs text-ink-muted">
        <span>12 bulan terakhir</span>
        <span>
          Total:{" "}
          <span className="font-semibold text-ink">
            Rp
            {data
              .reduce((sum, d) => sum + d.revenue, 0)
              .toLocaleString("id-ID")}
          </span>
        </span>
      </div>
    </div>
  );
}
