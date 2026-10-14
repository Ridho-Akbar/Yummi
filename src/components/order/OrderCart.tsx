"use client";

import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/lib/icons";
import type { OrderItemInput } from "@/features/orders/schema";
import type { Product } from "@/types";

interface CartProps {
  items: OrderItemInput[];
  total: number;
  itemCount: number;
  error?: string;
  products: Product[];
  onUpdateQty: (productId: string, delta: number) => void;
  onRemove: (productId: string) => void;
}

export function DesktopCart({
  items,
  total,
  itemCount,
  error,
  products,
  onUpdateQty,
  onRemove,
}: CartProps) {
  return (
    <div className="rounded-yumm-lg border border-neutral-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart
            size={ICON_SIZE.md}
            className="text-yumm-pink"
            strokeWidth={2.5}
          />
          <h2 className="font-display text-base font-bold text-ink">
            Keranjang
          </h2>
        </div>
        {itemCount > 0 && (
          <span className="rounded-full bg-yumm-pink/10 px-2.5 py-0.5 font-display text-xs font-bold text-yumm-pink">
            {itemCount}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-sm text-ink-muted">Keranjang masih kosong.</p>
          <p className="mt-1 text-xs text-ink-muted/70">
            Klik produk di sebelah kiri.
          </p>
        </div>
      ) : (
        <>
          <CartItemList
            items={items}
            products={products}
            onUpdateQty={onUpdateQty}
            onRemove={onRemove}
          />

          <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
            <span className="font-display text-sm font-semibold text-ink-muted">
              Total
            </span>
            <span className="font-display text-xl font-bold text-yumm-pink">
              Rp{total.toLocaleString("id-ID")}
            </span>
          </div>

          {error && (
            <div className="mt-4 rounded-yumm border border-yumm-coral/30 bg-yumm-coral/10 px-4 py-3 text-xs text-yumm-coral">
              {error}
            </div>
          )}

          <div className="mt-4">
            <SubmitButton />
          </div>
        </>
      )}
    </div>
  );
}

interface MobileCartProps extends CartProps {
  expanded: boolean;
  onToggle: () => void;
}

export function MobileCart({
  items,
  total,
  itemCount,
  error,
  expanded,
  products,
  onToggle,
  onUpdateQty,
  onRemove,
}: MobileCartProps) {
  return (
    <>
      {expanded && (
        <div
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
        />
      )}

      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 lg:hidden",
          "transition-transform duration-300",
          expanded ? "pointer-events-auto" : "pointer-events-auto"
        )}
      >
        <div className="mx-3 mb-3 rounded-2xl border border-neutral-200 bg-white shadow-2xl">
          <button
            type="button"
            onClick={onToggle}
            className="flex w-full items-center justify-between gap-3 px-4 py-3"
            aria-expanded={expanded}
            aria-label={expanded ? "Tutup keranjang" : "Buka keranjang"}
          >
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <ShoppingCart
                  size={ICON_SIZE.lg}
                  className="text-yumm-pink"
                  strokeWidth={2.5}
                />
                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-yumm-pink px-1 font-display text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              </div>
              <span className="font-display text-sm font-semibold text-ink">
                {itemCount} item
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-display text-base font-bold text-yumm-pink">
                Rp{total.toLocaleString("id-ID")}
              </span>
            </div>
          </button>

          <div
            className={cn(
              "overflow-hidden transition-[max-height] duration-300 ease-out",
              expanded ? "max-h-[70vh]" : "max-h-0"
            )}
          >
            <div className="scrollbar-yumm max-h-[60vh] space-y-2 overflow-y-auto border-t border-neutral-100 px-4 py-4">
              <CartItemList
                items={items}
                products={products}
                onUpdateQty={onUpdateQty}
                onRemove={onRemove}
              />

              <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                <span className="font-display text-sm font-semibold text-ink-muted">
                  Total
                </span>
                <span className="font-display text-xl font-bold text-yumm-pink">
                  Rp{total.toLocaleString("id-ID")}
                </span>
              </div>

              {error && (
                <div className="rounded-yumm border border-yumm-coral/30 bg-yumm-coral/10 px-4 py-3 text-xs text-yumm-coral">
                  {error}
                </div>
              )}

              <div className="pt-1">
                <SubmitButton />
              </div>

              <div className="h-[env(safe-area-inset-bottom)]" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

interface CartItemListProps {
  items: OrderItemInput[];
  products: Product[];
  onUpdateQty: (productId: string, delta: number) => void;
  onRemove: (productId: string) => void;
}

function CartItemList({
  items,
  products,
  onUpdateQty,
  onRemove,
}: CartItemListProps) {
  return (
    <div className="space-y-2">
      {items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        const minQty = product?.min_order_qty ?? 1;
        const atMinimum = item.qty <= minQty;

        return (
          <div
            key={item.productId}
            className="flex items-center justify-between gap-3 rounded-yumm border border-neutral-100 px-3 py-2.5"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm font-semibold text-ink">
                {item.name}
              </p>
              <p className="text-xs text-ink-muted">
                Rp{item.price.toLocaleString("id-ID")}
                {minQty > 1 && (
                  <span className="ml-1.5 text-yumm-coral">· min {minQty}</span>
                )}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => onUpdateQty(item.productId, -1)}
                disabled={atMinimum}
                aria-label="Kurangi jumlah"
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full bg-surface-muted text-ink",
                  "transition-all hover:bg-neutral-200 active:scale-90",
                  "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface-muted disabled:active:scale-100"
                )}
              >
                <Minus size={14} strokeWidth={2.5} />
              </button>
              <span className="w-7 text-center font-display text-sm font-bold text-ink">
                {item.qty}
              </span>
              <button
                type="button"
                onClick={() => onUpdateQty(item.productId, 1)}
                aria-label="Tambah jumlah"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-yumm-pink text-white transition-all hover:bg-yumm-coral active:scale-90"
              >
                <Plus size={14} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={() => onRemove(item.productId)}
                aria-label={`Hapus ${item.name}`}
                className={cn(
                  "ml-1 flex h-8 w-8 items-center justify-center rounded-full",
                  "text-ink-muted transition-all",
                  "hover:bg-yumm-coral/10 hover:text-yumm-coral active:scale-90"
                )}
              >
                <Trash2 size={15} strokeWidth={2.2} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "w-full rounded-yumm bg-yumm-pink px-6 py-3",
        "font-display text-sm font-semibold text-white",
        "transition-all duration-150",
        "hover:bg-yumm-coral active:scale-[0.98]",
        "disabled:cursor-not-allowed disabled:opacity-60"
      )}
    >
      {pending ? "Mengirim pesanan..." : "Kirim pesanan"}
    </button>
  );
}