"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/lib/icons";
import type {
  AdminOrderListItem,
  PaymentStatus,
} from "@/features/orders/queries";

interface OrderListProps {
  orders: AdminOrderListItem[];
  query: string;
  status: string | undefined;
  paymentStatus: string | undefined;
  dateFilter: string;
  total: number;
  perPage: number;
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

function formatShortDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function OrderList({
  orders,
  query,
  status,
  paymentStatus,
  dateFilter,
  total,
  perPage,
}: OrderListProps) {
  const isFiltered =
    query.trim() !== "" ||
    status !== undefined ||
    paymentStatus !== undefined ||
    dateFilter !== "all";

  if (orders.length === 0) {
    return (
      <div className="rounded-yumm-lg border border-neutral-100 bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-ink-muted">
          {isFiltered
            ? "Tidak ada pesanan yang cocok dengan filter."
            : "Belum ada pesanan."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-ink-muted">
        Menampilkan {orders.length} dari {total} pesanan
        {total > perPage && ` · ${perPage} per halaman`}.
      </p>

      <div className="hidden overflow-hidden rounded-yumm-lg border border-neutral-100 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-surface-muted">
              <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                <th className="px-4 py-3">Kode</th>
                <th className="px-4 py-3">Pelanggan</th>
                <th className="px-4 py-3">Tanggal & Status</th>
                <th className="px-4 py-3 text-right">Total & Bayar</th>
                <th className="w-10 px-2 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="group relative border-t border-neutral-100 transition-colors hover:bg-surface-muted/50"
                >
                  <td className="whitespace-nowrap px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.orderCode}`}
                      className="rounded-md bg-surface-muted px-2 py-1 font-mono text-[11px] font-semibold text-ink transition-colors group-hover:bg-yumm-pink/10 group-hover:text-yumm-pink"
                    >
                      {order.orderCode}
                    </Link>
                  </td>

                  <td className="px-4 py-3">
                    <p className="font-display font-semibold text-ink">
                      {order.customerName}
                    </p>
                    <p className="whitespace-nowrap text-xs text-ink-muted">
                      {order.customerPhone}
                      {order.isAnonymous && (
                        <span className="ml-2 rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-semibold uppercase text-ink-muted">
                          Anonim
                        </span>
                      )}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-4 py-3">
                    <p className="text-xs text-ink-muted">
                      {formatShortDate(order.orderDate)}
                    </p>
                    <span
                      className={cn(
                        "mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        STATUS_COLORS[order.status]
                      )}
                    >
                      {STATUS_LABELS[order.status]}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <p className="font-display text-sm font-semibold text-ink">
                      Rp{order.total.toLocaleString("id-ID")}
                    </p>
                    <span
                      className={cn(
                        "mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        PAYMENT_COLORS[order.paymentStatus]
                      )}
                    >
                      {PAYMENT_LABELS[order.paymentStatus]}
                    </span>
                  </td>

                  <td className="px-2 py-3 text-right">
                    <Link
                      href={`/admin/orders/${order.orderCode}`}
                      aria-label={`Buka detail pesanan ${order.orderCode}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors group-hover:bg-yumm-pink group-hover:text-white"
                    >
                      <ChevronRight size={ICON_SIZE.md} strokeWidth={2.5} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-2 md:hidden">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/admin/orders/${order.orderCode}`}
            className="block rounded-yumm-lg border border-neutral-100 bg-white p-4 shadow-sm transition-colors active:bg-surface-muted"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="rounded-md bg-surface-muted px-2 py-0.5 font-mono text-[10px] font-semibold text-ink">
                {order.orderCode}
              </span>
              <div className="flex shrink-0 gap-1.5">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase",
                    PAYMENT_COLORS[order.paymentStatus]
                  )}
                >
                  {PAYMENT_LABELS[order.paymentStatus]}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase",
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
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-ink-muted">
                {formatShortDate(order.orderDate)}
              </p>
              <p className="font-display text-sm font-semibold text-yumm-pink">
                Rp{order.total.toLocaleString("id-ID")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}