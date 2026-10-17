"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/lib/icons";
import type { OrderStatus } from "@/features/orders/queries";
import type { OrderTimelineEntry } from "@/features/orders/timeline-types";

interface OrderTimelineProps {
  entries: OrderTimelineEntry[];
  orderCreatedAt: string;
  customerName: string;
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Dikonfirmasi",
  done: "Selesai",
  cancelled: "Dibatalkan",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yumm-coral",
  confirmed: "bg-yumm-lilac",
  done: "bg-emerald-500",
  cancelled: "bg-neutral-400",
};

const STATUS_TEXT: Record<OrderStatus, string> = {
  pending: "text-yumm-coral",
  confirmed: "text-yumm-lilac",
  done: "text-emerald-600",
  cancelled: "text-ink-muted",
};

export function OrderTimeline({
  entries,
  orderCreatedAt,
  customerName,
}: OrderTimelineProps) {
  // Default tampilkan maksimal 3 perubahan status terakhir
  const INITIAL_LIMIT = 3;
  const [isExpanded, setIsExpanded] = useState(false);

  // Balik urutan: terbaru di paling atas, terlama di bawah
  const reversedEntries = [...entries].reverse();
  const visibleEntries = isExpanded
    ? reversedEntries
    : reversedEntries.slice(0, INITIAL_LIMIT);
  const hiddenCount = reversedEntries.length - INITIAL_LIMIT;

  const createdAtFormatted = new Date(orderCreatedAt).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-1">
      {/* 1. Daftar Status (Terbaru ke Terlama) */}
      {visibleEntries.map((entry) => {
        const actorName =
          entry.changedByName ?? entry.changedByEmail ?? "Sistem";

        return (
          <TimelineItem
            key={entry.id}
            dotColor={STATUS_COLORS[entry.toStatus]}
            title={
              <>
                Diubah ke{" "}
                <span className={cn("font-semibold", STATUS_TEXT[entry.toStatus])}>
                  {STATUS_LABELS[entry.toStatus]}
                </span>
              </>
            }
            subtitle={`oleh ${actorName}`}
            timestamp={new Date(entry.createdAt).toLocaleString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
            isLast={false} // Selalu tarik garis ke bawah, karena selalu ada item di bawahnya
          />
        );
      })}

      {/* 2. Tombol Expand (Lihat Lebih Banyak) */}
      {!isExpanded && hiddenCount > 0 && (
        <div className="relative flex gap-3 py-2 pl-1">
          <span
            className="absolute left-[10px] top-0 h-full w-0.5 bg-neutral-200"
            aria-hidden
          />
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="relative z-10 flex w-full items-center gap-2 rounded-yumm border border-neutral-200 bg-white py-2 pl-7 pr-3 text-left text-xs font-semibold text-ink-muted transition-colors hover:border-yumm-pink hover:text-yumm-pink"
          >
            <ChevronDown size={ICON_SIZE.sm} strokeWidth={2.5} />
            Lihat {hiddenCount} riwayat sebelumnya
          </button>
        </div>
      )}

      {/* 3. Tombol Collapse (Sembunyikan) */}
      {isExpanded && hiddenCount > 0 && (
        <div className="relative flex gap-3 py-2 pl-1">
          <span
            className="absolute left-[10px] top-0 h-full w-0.5 bg-neutral-200"
            aria-hidden
          />
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="relative z-10 flex w-full items-center gap-2 rounded-yumm border border-transparent py-2 pl-7 pr-3 text-left text-xs font-semibold text-ink-muted transition-colors hover:text-yumm-pink"
          >
            <ChevronUp size={ICON_SIZE.sm} strokeWidth={2.5} />
            Sembunyikan riwayat lama
          </button>
        </div>
      )}

      {/* 4. Entri Paling Awal: Pesanan dibuat (Paling Bawah) */}
      <TimelineItem
        dotColor="bg-yumm-pink"
        title="Pesanan dibuat"
        subtitle={customerName}
        timestamp={createdAtFormatted}
        isFirst // Tetap pakai ring agar terlihat menonjol
        isLast // Tidak perlu tarik garis ke bawah lagi
      />
    </div>
  );
}

interface TimelineItemProps {
  dotColor: string;
  title: React.ReactNode;
  subtitle: string;
  timestamp: string;
  isFirst?: boolean;
  isLast?: boolean;
}

function TimelineItem({
  dotColor,
  title,
  subtitle,
  timestamp,
  isFirst,
  isLast,
}: TimelineItemProps) {
  return (
    <div className="relative flex gap-3 pb-4 pl-1 last:pb-0">
      {/* Garis vertikal yang menyambung ke item di bawahnya */}
      {!isLast && (
        <span
          className="absolute left-[10px] top-4 h-full w-0.5 bg-neutral-200"
          aria-hidden
        />
      )}
      
      {/* Titik (Dot) */}
      <span
        className={cn(
          "relative z-10 mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
          dotColor,
          isFirst && "ring-4 ring-yumm-pink/15"
        )}
        aria-hidden
      />
      
      {/* Konten Teks */}
      <div className="min-w-0 flex-1">
        <p className="text-sm text-ink">{title}</p>
        <p className="mt-0.5 text-xs text-ink-muted">{subtitle}</p>
        <p className="mt-1 font-mono text-[11px] text-ink-muted/70">
          {timestamp}
        </p>
      </div>
    </div>
  );
}