"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  PencilLine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/lib/icons";
import { ProductModal } from "./ProductModal";
import { formatLongDate } from "@/lib/calendar";
import type { Product } from "@/types";
import type { CapacityAlertGroup } from "@/features/admin/queries";

interface CapacityAlertPanelProps {
  groups: CapacityAlertGroup[];
  products: Product[];
}

export function CapacityAlertPanel({
  groups,
  products,
}: CapacityAlertPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const productMap = new Map(products.map((p) => [p.id, p]));

  const totalItems = groups.reduce((sum, g) => sum + g.items.length, 0);

  if (groups.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-yumm-lg border border-neutral-100 bg-white px-5 py-4 shadow-sm">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yumm-mint/30">
          <CheckCircle2
            size={16}
            className="text-emerald-700"
            strokeWidth={2.2}
          />
        </div>
        <p className="text-sm text-ink-muted">
          <span className="font-display font-semibold text-ink">
            Kapasitas aman.
          </span>{" "}
          Tidak ada produk yang hampir limit.
        </p>
      </div>
    );
  }

  // Preview: tampilkan maksimal 3 item pertama secara ringkas
  const flatItems = groups.flatMap((g) =>
    g.items.map((item) => ({
      ...item,
      date: g.date,
    }))
  );
  const previewItems = flatItems.slice(0, 3);
  const remainingCount = flatItems.length - previewItems.length;

  return (
    <div className="overflow-hidden rounded-yumm-lg border border-yumm-lemon/40 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-yumm-lemon/5"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yumm-lemon/50">
            <AlertTriangle
              size={14}
              className="text-ink"
              strokeWidth={2.5}
            />
          </span>
          <span className="font-display text-sm font-bold text-ink">
            Produk yang Hampir Limit
          </span>
          <span className="rounded-full bg-yumm-lemon/60 px-2 py-0.5 font-display text-[10px] font-bold text-ink">
            {totalItems}
          </span>
        </div>
        <span className="flex items-center gap-1 text-xs text-ink-muted">
          {expanded ? "Sembunyikan" : "Lihat detail"}
          {expanded ? (
            <ChevronDown size={14} strokeWidth={2.5} />
          ) : (
            <ChevronRight size={14} strokeWidth={2.5} />
          )}
        </span>
      </button>

      {!expanded && (
        <div className="space-y-1 px-5 pb-4">
          {previewItems.map((item, index) => {
            const percent = Math.min(
              Math.round(item.utilization * 100),
              100
            );
            const isFull = item.utilization >= 1;
            const remaining = Math.max(
              item.dailyCapacity - item.usedQty,
              0
            );

            return (
              <div
                key={`${item.productId}-${item.date}-${index}`}
                className="flex items-center justify-between gap-3 text-xs"
              >
                <span className="truncate text-ink">
                  <span className="font-display font-semibold">
                    {item.productName}
                  </span>{" "}
                  <span className="text-ink-muted">
                    · {formatLongDate(item.date)}
                  </span>
                </span>
                <span
                  className={cn(
                    "shrink-0 font-display font-semibold",
                    isFull ? "text-yumm-coral" : "text-ink-muted"
                  )}
                >
                  {isFull ? "PENUH" : `${remaining} sisa`}
                </span>
              </div>
            );
          })}
          {remainingCount > 0 && (
            <p className="pt-1 text-[11px] text-ink-muted">
              + {remainingCount} lainnya
            </p>
          )}
        </div>
      )}

      {expanded && (
        <div className="space-y-4 border-t border-yumm-lemon/30 bg-yumm-lemon/[0.03] px-5 py-4">
          {groups.map((group) => (
            <div key={group.date} className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                {formatLongDate(group.date)}
              </p>
              <div className="space-y-1.5">
                {group.items.map((item) => {
                  const product = productMap.get(item.productId);
                  const percent = Math.min(
                    Math.round(item.utilization * 100),
                    100
                  );
                  const isFull = item.utilization >= 1;
                  const remaining = Math.max(
                    item.dailyCapacity - item.usedQty,
                    0
                  );

                  return (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between gap-3 rounded-yumm border border-neutral-100 bg-white px-3 py-2"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-sm font-semibold text-ink">
                          {item.productName}
                        </p>
                        <p className="mt-0.5 text-xs text-ink-muted">
                          {isFull ? (
                            <span className="font-semibold text-yumm-coral">
                              Penuh — {item.usedQty} dari {item.dailyCapacity}
                            </span>
                          ) : (
                            <>
                              {item.usedQty} dari {item.dailyCapacity} · sisa{" "}
                              {remaining}
                            </>
                          )}
                        </p>
                      </div>

                      {product && (
                        <ProductModal
                          product={product}
                          trigger={
                            <button
                              type="button"
                              title="Naikkan kapasitas"
                              className={cn(
                                "inline-flex shrink-0 items-center gap-1.5 rounded-yumm border px-2.5 py-1.5",
                                "font-display text-[11px] font-semibold transition-colors",
                                isFull
                                  ? "border-yumm-coral/40 text-yumm-coral hover:bg-yumm-coral/10"
                                  : "border-neutral-200 text-ink-muted hover:border-yumm-pink hover:bg-yumm-pink/5 hover:text-yumm-pink"
                              )}
                            >
                              <PencilLine size={12} strokeWidth={2.5} />
                              Edit
                            </button>
                          }
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="pt-1 text-right">
            <Link
              href="/admin/products"
              className="text-xs font-semibold text-yumm-pink underline-offset-4 hover:underline"
            >
              Kelola produk →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}