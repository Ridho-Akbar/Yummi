import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  Phone,
  Truck,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/lib/icons";
import type {
  TodayOrderItem,
} from "@/features/admin/queries";
import type { OrderStatus } from "@/features/orders/queries";

interface TodayOrdersPanelProps {
  orders: TodayOrderItem[];
}

const STATUS_META: Record<
  OrderStatus,
  { label: string; Icon: typeof CircleDashed; color: string; bg: string }
> = {
  pending: {
    label: "Pending",
    Icon: CircleDashed,
    color: "text-yumm-coral",
    bg: "bg-yumm-coral/10",
  },
  confirmed: {
    label: "Siap kirim",
    Icon: Truck,
    color: "text-yumm-lilac",
    bg: "bg-yumm-lilac/15",
  },
  done: {
    label: "Selesai",
    Icon: CheckCircle2,
    color: "text-emerald-700",
    bg: "bg-yumm-mint/30",
  },
  cancelled: {
    label: "Batal",
    Icon: XCircle,
    color: "text-ink-muted",
    bg: "bg-neutral-200",
  },
};

const PAYMENT_META: Record<string, { label: string; color: string }> = {
  unpaid: { label: "Belum bayar", color: "text-yumm-coral" },
  dp: { label: "DP", color: "text-ink" },
  paid: { label: "Lunas", color: "text-emerald-700" },
};

export function TodayOrdersPanel({ orders }: TodayOrdersPanelProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-yumm-lg border border-neutral-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-muted">
            <CheckCircle2
              size={20}
              className="text-ink-muted"
              strokeWidth={2.2}
            />
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-ink">
              Pesanan Hari Ini
            </h2>
            <p className="mt-0.5 text-xs text-ink-muted">
              Tidak ada pesanan yang harus dikirim hari ini.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const actionable = orders.filter((o) => o.status !== "done");
  const doneCount = orders.filter((o) => o.status === "done").length;

  return (
    <div className="rounded-yumm-lg border-2 border-yumm-pink/30 bg-gradient-to-br from-yumm-pink/[0.06] to-white p-5 shadow-sm sm:p-6">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-yumm-pink text-white">
              <Truck size={14} strokeWidth={2.5} />
            </span>
            <h2 className="font-display text-base font-bold text-ink">
              Pesanan Hari Ini
            </h2>
            <span className="rounded-full bg-yumm-coral px-2 py-0.5 font-display text-[10px] font-bold text-white">
              {actionable.length}
            </span>
          </div>
          <p className="mt-1.5 text-xs text-ink-muted">
            {actionable.length > 0
              ? `${actionable.length} pesanan perlu ditangani, ${doneCount} sudah selesai.`
              : `${doneCount} pesanan sudah selesai. Mantap!`}
          </p>
        </div>
        <Link
          href="/admin/orders?view=list&date=today"
          className="inline-flex items-center gap-1.5 rounded-yumm border border-yumm-pink/30 bg-white px-3 py-1.5 font-display text-xs font-semibold text-yumm-pink transition-colors hover:bg-yumm-pink hover:text-white"
        >
          Lihat semua
          <ArrowRight size={12} strokeWidth={2.5} />
        </Link>
      </header>

      <div className="grid gap-2 sm:grid-cols-2">
        {orders.map((order) => {
          const meta = STATUS_META[order.status];
          const StatusIcon = meta.Icon;
          const paymentMeta =
            PAYMENT_META[order.paymentStatus] ?? PAYMENT_META.unpaid;
          const remaining = order.total - order.amountPaid;
          const isActionable = order.status !== "done";

          return (
            <Link
              key={order.id}
              href={`/admin/orders/${order.orderCode}`}
              className={cn(
                "group rounded-yumm border bg-white p-3 transition-all hover:-translate-y-0.5 hover:shadow-md",
                isActionable
                  ? "border-neutral-100 hover:border-yumm-pink"
                  : "border-neutral-100 opacity-75"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-mono text-[10px] font-semibold text-ink-muted">
                  {order.orderCode}
                </p>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-display text-[10px] font-semibold uppercase",
                    meta.bg,
                    meta.color
                  )}
                >
                  <StatusIcon size={10} strokeWidth={2.5} />
                  {meta.label}
                </span>
              </div>

              <p className="mt-2 truncate font-display text-sm font-semibold text-ink">
                {order.customerName}
              </p>

              <div className="mt-1 flex items-center gap-2 text-[11px] text-ink-muted">
                <Phone size={10} strokeWidth={2.5} />
                <span className="truncate">{order.customerPhone}</span>
              </div>

              <div className="mt-2 flex items-center justify-between border-t border-neutral-100 pt-2">
                <div className="text-[10px]">
                  <span className={cn("font-semibold", paymentMeta.color)}>
                    {paymentMeta.label}
                  </span>
                  {order.paymentStatus === "dp" && remaining > 0 && (
                    <span className="ml-1.5 text-ink-muted">
                      · sisa Rp{remaining.toLocaleString("id-ID")}
                    </span>
                  )}
                </div>
                <p className="font-display text-xs font-bold text-yumm-pink">
                  Rp{order.total.toLocaleString("id-ID")}
                </p>
              </div>

              <p className="mt-1.5 text-[10px] text-ink-muted">
                {order.itemCount} item
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
