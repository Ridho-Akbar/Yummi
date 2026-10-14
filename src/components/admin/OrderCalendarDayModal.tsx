"use client";

import Link from "next/link";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { formatLongDate } from "@/lib/calendar";
import type {
  AdminOrderListItem,
  PaymentStatus,
} from "@/features/orders/queries";

interface OrderCalendarDayModalProps {
  date: string;
  orders: AdminOrderListItem[];
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

const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  unpaid: "Belum bayar",
  dp: "DP",
  paid: "Lunas",
};

const PAYMENT_COLORS: Record<PaymentStatus, string> = {
  unpaid: "bg-yumm-coral/10 text-yumm-coral",
  dp: "bg-yumm-lemon/40 text-ink",
  paid: "bg-yumm-mint/30 text-emerald-700",
};

export function OrderCalendarDayModal({
  date,
  orders,
  onClose,
}: OrderCalendarDayModalProps) {
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

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const totalPaid = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.amountPaid, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90dvh] w-full max-w-md flex-col rounded-yumm-lg bg-white p-6 shadow-xl"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              {orders.length} pesanan
            </p>
            <h2 className="mt-1 font-display text-lg font-bold text-ink">
              {formatLongDate(date)}
            </h2>
            {totalRevenue > 0 && (
              <div className="mt-1 space-y-0.5 text-xs text-ink-muted">
                <p>
                  Total nilai:{" "}
                  <span className="font-semibold text-ink">
                    Rp{totalRevenue.toLocaleString("id-ID")}
                  </span>
                </p>
                <p>
                  Sudah dibayar:{" "}
                  <span className="font-semibold text-yumm-pink">
                    Rp{totalPaid.toLocaleString("id-ID")}
                  </span>
                </p>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="shrink-0 rounded-full p-2 text-ink-muted transition-colors hover:bg-surface-muted"
          >
            ×
          </button>
        </div>

        <div className="-mr-2 flex-1 space-y-2 overflow-y-auto pr-2">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.orderCode}`}
              className="block rounded-yumm border border-neutral-100 px-4 py-3 transition-colors hover:border-yumm-pink hover:bg-yumm-pink/5"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-md bg-surface-muted px-2 py-0.5 font-mono text-[10px] font-semibold text-ink">
                  {order.orderCode}
                </span>
                <div className="flex shrink-0 gap-1">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                      PAYMENT_COLORS[order.paymentStatus]
                    )}
                  >
                    {PAYMENT_LABELS[order.paymentStatus]}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                      STATUS_COLORS[order.status]
                    )}
                  >
                    {STATUS_LABELS[order.status]}
                  </span>
                </div>
              </div>
              <p className="mt-2 truncate font-display text-sm font-semibold text-ink">
                {order.customerName}
              </p>
              <p className="mt-0.5 truncate text-xs text-ink-muted">
                {order.customerPhone}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <p className="font-display text-sm font-semibold text-yumm-pink">
                  Rp{order.total.toLocaleString("id-ID")}
                </p>
                {order.paymentStatus === "dp" && (
                  <p className="text-[11px] text-ink-muted">
                    Dibayar: Rp{order.amountPaid.toLocaleString("id-ID")}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}