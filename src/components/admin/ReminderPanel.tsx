import Link from "next/link";
import { CalendarClock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/lib/icons";
import type {
  GroupedReminders,
  ReminderCategory,
} from "@/features/reminders/types";

interface ReminderPanelProps {
  reminders: GroupedReminders;
  totalCount: number;
}

const CATEGORY_META: Record<
  ReminderCategory,
  { label: string; dotColor: string }
> = {
  "h+": { label: "Sudah lewat", dotColor: "bg-yumm-coral" },
  h: { label: "Hari ini", dotColor: "bg-yumm-pink" },
  "h-1": { label: "Besok", dotColor: "bg-yumm-lilac" },
  "h-2": { label: "2 hari lagi", dotColor: "bg-neutral-300" },
};

const CATEGORY_ORDER: ReminderCategory[] = ["h+", "h", "h-1", "h-2"];

export function ReminderPanel({ reminders, totalCount }: ReminderPanelProps) {
  if (totalCount === 0) {
    return (
      <div className="rounded-yumm-lg border border-neutral-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yumm-mint/30">
            <CheckCircle2 size={20} className="text-emerald-700" />
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-ink">
              Semua beres!
            </h2>
            <p className="mt-0.5 text-xs text-ink-muted">
              Tidak ada pengingat yang perlu ditindaklanjuti hari ini.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-yumm-lg border border-neutral-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarClock
            size={ICON_SIZE.md}
            className="text-yumm-pink"
            strokeWidth={2.5}
          />
          <h2 className="font-display text-base font-bold text-ink">
            Pengingat
          </h2>
          <span className="rounded-full bg-yumm-coral px-2 py-0.5 font-display text-[10px] font-bold text-white">
            {totalCount}
          </span>
        </div>
        <Link
          href="/admin/reminders"
          className="text-xs font-semibold text-yumm-pink underline-offset-4 hover:underline"
        >
          Lihat semua →
        </Link>
      </div>

      <div className="space-y-3">
        {CATEGORY_ORDER.map((cat) => {
          const items = reminders[cat];
          if (items.length === 0) return null;
          const meta = CATEGORY_META[cat];
          const preview = items.slice(0, 2);
          const more = items.length - preview.length;

          return (
            <div key={cat} className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span
                  className={cn("h-1.5 w-1.5 rounded-full", meta.dotColor)}
                />
                <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  {meta.label} · {items.length}
                </span>
              </div>
              <div className="space-y-1 pl-3">
                {preview.map((r) => (
                  <Link
                    key={r.key}
                    href={`/admin/orders/${r.orderCode}`}
                    className="block rounded-yumm border border-neutral-100 px-3 py-2 transition-colors hover:border-yumm-pink hover:bg-yumm-pink/5"
                  >
                    <p className="truncate font-display text-sm font-semibold text-ink">
                      {r.customerName}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-ink-muted">
                      {r.message}
                    </p>
                  </Link>
                ))}
                {more > 0 && (
                  <Link
                    href="/admin/reminders"
                    className="block px-3 py-1 text-xs font-semibold text-ink-muted hover:text-yumm-pink"
                  >
                    + {more} lainnya
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}