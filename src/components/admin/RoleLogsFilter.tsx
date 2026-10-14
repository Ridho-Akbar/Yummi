"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { LogDaysFilter } from "@/features/users/types";

const FILTERS: { value: LogDaysFilter; label: string; param: string }[] = [
  { value: 7, label: "7 hari terakhir", param: "7" },
  { value: 30, label: "30 hari terakhir", param: "30" },
  { value: null, label: "Semua", param: "all" },
];

interface RoleLogsFilterProps {
  current: LogDaysFilter;
}

export function RoleLogsFilter({ current }: RoleLogsFilterProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function buildHref(value: LogDaysFilter): string {
    const params = new URLSearchParams();
    if (value !== null) params.set("days", String(value));
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => {
        const active = current === filter.value;
        return (
          <Link
            key={filter.label}
            href={buildHref(filter.value)}
            className={cn(
              "rounded-full px-4 py-1.5 font-display text-xs font-semibold transition-colors",
              active
                ? "bg-yumm-pink text-white"
                : "bg-white text-ink-muted hover:text-ink"
            )}
          >
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
}
