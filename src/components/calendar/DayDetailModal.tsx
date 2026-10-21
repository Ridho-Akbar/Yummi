"use client";

import Link from "next/link";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { isPast } from "@/lib/calendar";
import type { CalendarDayData } from "@/features/calendar/queries";

interface DayDetailModalProps {
  date: Date;
  data: CalendarDayData | null;
  isAdmin?: boolean;
  onClose: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Dikonfirmasi",
  done: "Selesai",
  cancelled: "Dibatalkan",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yumm-coral/15 text-yumm-coral",
  confirmed: "bg-yumm-lilac/15 text-yumm-lilac",
  done: "bg-yumm-mint/30 text-emerald-700",
  cancelled: "bg-neutral-200 text-ink-muted",
};

export function DayDetailModal({
  date,
  data,
  isAdmin = false,
  onClose,
}: DayDetailModalProps) {
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const formatted = date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const orderCount = data?.orders.length ?? 0;
  const unavailable = data?.isAvailable === false;

  // LOGIKA BATAS TANGGAL (Maksimal 2 bulan ke depan)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const maxDate = new Date(today);
  maxDate.setMonth(today.getMonth() + 2);
  
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);

  const past = isPast(date);
  const isTooFar = compareDate > maxDate;
  
  // Tombol hanya muncul jika: (Bukan tanggal lampau DAN tidak lebih dari 2 bulan) ATAU user adalah Admin
  const canOrder = isAdmin || (!past && !isTooFar);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md space-y-4 rounded-yumm-lg bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Detail Tanggal
            </p>
            <h2 className="mt-1 font-display text-xl font-bold text-ink">
              {formatted}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-full p-2 text-ink-muted transition-colors hover:bg-surface-muted"
          >
            ×
          </button>
        </div>

        {unavailable && (
          <div className="rounded-yumm bg-neutral-100 px-4 py-3 text-sm text-ink-muted">
            Admin menandai tanggal ini tidak tersedia untuk pesanan.
          </div>
        )}

        {data?.scheduleNote && (
          <div className="rounded-yumm bg-yumm-lemon/30 px-4 py-3 text-sm text-ink">
            <span className="font-semibold">Catatan: </span>
            {data.scheduleNote}
          </div>
        )}

        {orderCount > 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              {orderCount} pesanan
            </p>
            {data!.orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between gap-3 rounded-yumm border border-neutral-100 px-4 py-3"
              >
                <p className="truncate font-display text-sm font-semibold text-ink">
                  {order.customerName}
                </p>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1 text-xs font-semibold",
                    STATUS_COLORS[order.status]
                  )}
                >
                  {STATUS_LABELS[order.status]}
                </span>
              </div>
            ))}
          </div>
        ) : (
          !unavailable && (
            <p className="text-sm text-ink-muted">
              Belum ada pesanan di tanggal ini. Masih kosong!
            </p>
          )
        )}

        {/* Hanya render tombol jika diizinkan */}
        {canOrder && (
          <Link
            href={`/order?date=${data?.date ?? ""}`}
            className="block rounded-yumm bg-yumm-pink px-5 py-2.5 text-center font-display text-sm font-semibold text-white transition-colors hover:bg-yumm-coral"
          >
            Pesan di tanggal ini
          </Link>
        )}
      </div>
    </div>
  );
}