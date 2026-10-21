import Link from "next/link";
import { AlertTriangle, CalendarClock, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/lib/icons";
import {
  getAdminReminders,
  countReminders,
} from "@/features/reminders/queries";
import type {
  ReminderCategory,
  ReminderSeverity,
} from "@/features/reminders/types";

export const metadata = {
  title: "Pengingat — Admin",
};

const CATEGORY_META: Record<
  ReminderCategory,
  { label: string; description: string; dotColor: string }
> = {
  "h+": {
    label: "Sudah lewat",
    description: "Pesanan yang tanggalnya sudah terlewat dan perlu tindak lanjut",
    dotColor: "bg-yumm-coral",
  },
  h: {
    label: "Hari ini",
    description: "Pesanan yang acaranya hari ini",
    dotColor: "bg-yumm-pink",
  },
  "h-1": {
    label: "Besok",
    description: "Pesanan yang acaranya besok",
    dotColor: "bg-yumm-lilac",
  },
  "h-2": {
    label: "2 hari lagi",
    description: "Pesanan yang acaranya 2 hari lagi",
    dotColor: "bg-neutral-300",
  },
};

// Hari ini di paling atas supaya langsung terlihat.
const CATEGORY_ORDER: ReminderCategory[] = ["h", "h+", "h-1", "h-2"];

const FEATURED_CATEGORY: ReminderCategory = "h";

const SEVERITY_ICONS: Record<ReminderSeverity, typeof Clock> = {
  info: Clock,
  warning: AlertTriangle,
  urgent: AlertTriangle,
};

const SEVERITY_COLORS: Record<ReminderSeverity, string> = {
  info: "text-ink-muted",
  warning: "text-yumm-lemon",
  urgent: "text-yumm-coral",
};

export default async function AdminRemindersPage() {
  const reminders = await getAdminReminders();
  const totalCount = countReminders(reminders);
  const todayCount = reminders.h.length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          Pengingat
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Pengingat otomatis berdasarkan tanggal acara. Diperbarui setiap hari
          pada pukul 00:00.
        </p>
      </header>

      {totalCount === 0 ? (
        <div className="rounded-yumm-lg border border-neutral-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yumm-mint/30">
            <CheckCircle2 size={28} className="text-emerald-700" />
          </div>
          <p className="mt-4 font-display text-base font-semibold text-ink">
            Semua beres!
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            Tidak ada pengingat yang perlu ditindaklanjuti hari ini.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {CATEGORY_ORDER.map((cat) => {
            const items = reminders[cat];
            if (items.length === 0) return null;

            const meta = CATEGORY_META[cat];
            const isFeatured = cat === FEATURED_CATEGORY;

            return (
              <section
                key={cat}
                className={cn(
                  "space-y-3",
                  isFeatured &&
                    "rounded-yumm-lg border-2 border-yumm-pink/30 bg-yumm-pink/[0.04] p-4 sm:p-5"
                )}
              >
                <header className="flex items-center gap-3">
                  {isFeatured && (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yumm-pink text-white">
                      <CalendarClock
                        size={ICON_SIZE.md}
                        strokeWidth={2.5}
                      />
                    </span>
                  )}
                  {!isFeatured && (
                    <span
                      className={cn(
                        "h-2.5 w-2.5 shrink-0 rounded-full",
                        meta.dotColor
                      )}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <h2
                      className={cn(
                        "font-display font-bold text-ink",
                        isFeatured ? "text-lg sm:text-xl" : "text-base"
                      )}
                    >
                      {meta.label}{" "}
                      <span
                        className={cn(
                          "font-normal",
                          isFeatured ? "text-yumm-pink" : "text-ink-muted"
                        )}
                      >
                        · {items.length}
                      </span>
                    </h2>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      {meta.description}
                    </p>
                  </div>
                </header>

                <div className="grid gap-2 sm:grid-cols-2">
                  {items.map((r) => {
                    const Icon = SEVERITY_ICONS[r.severity];
                    return (
                      <Link
                        key={r.key}
                        href={`/admin/orders/${r.orderCode}`}
                        className={cn(
                          "group rounded-yumm-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md",
                          isFeatured
                            ? "border-yumm-pink/30 hover:border-yumm-pink"
                            : "border-neutral-100 hover:border-yumm-pink"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-mono text-[10px] font-semibold text-ink-muted">
                            {r.orderCode}
                          </p>
                          <Icon
                            size={ICON_SIZE.sm}
                            className={cn(
                              SEVERITY_COLORS[r.severity],
                              r.severity === "urgent" && "animate-pulse"
                            )}
                            strokeWidth={2.5}
                          />
                        </div>
                        <p className="mt-2 font-display text-sm font-semibold text-ink">
                          {r.customerName}
                        </p>
                        <p className="mt-1 text-xs text-ink-muted">
                          {r.message}
                        </p>
                        <p className="mt-2 text-[10px] text-ink-muted">
                          Acara:{" "}
                          {new Date(r.orderDate).toLocaleDateString("id-ID", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          })}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {todayCount > 0 && (
        <p className="text-center text-xs text-ink-muted">
          Ada {todayCount} pesanan yang perlu ditangani hari ini.
        </p>
      )}
    </div>
  );
}