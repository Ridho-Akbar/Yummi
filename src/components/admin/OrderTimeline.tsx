import { cn } from "@/lib/utils";
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
  const createdAtFormatted = new Date(orderCreatedAt).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-1">
      {/* Entri pertama: pesanan dibuat */}
      <TimelineItem
        dotColor="bg-yumm-pink"
        title="Pesanan dibuat"
        subtitle={customerName}
        timestamp={createdAtFormatted}
        isFirst
      />

      {entries.map((entry, index) => {
        const isLast = index === entries.length - 1;
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
            isLast={isLast}
          />
        );
      })}
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
      {!isLast && (
        <span
          className="absolute left-[10px] top-4 h-full w-0.5 bg-neutral-200"
          aria-hidden
        />
      )}
      <span
        className={cn(
          "relative z-10 mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
          dotColor,
          isFirst && "ring-4 ring-yumm-pink/15"
        )}
        aria-hidden
      />
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
