"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Cake, Minus, Plus, Search, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MenuProduct } from "@/features/orders/queries";
import { toDateString } from "@/lib/calendar";

type FilterType = "ready" | "habis" | "cheap";

export function MenuClient({ products }: { products: MenuProduct[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("ready");
  
  const [cart, setCart] = useState<Record<string, number>>({});

  let filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    if (!matchSearch) return false;

    if (filter === "ready") return p.ready_stock > 0;
    if (filter === "habis") return p.ready_stock <= 0;
    return true; // cheap
  });

  // Urutkan: Yang habis pindah ke paling bawah
  filtered.sort((a, b) => {
    if (a.ready_stock > 0 && b.ready_stock <= 0) return -1;
    if (a.ready_stock <= 0 && b.ready_stock > 0) return 1;
    return a.name.localeCompare(b.name);
  });

  if (filter === "cheap") {
    filtered.sort((a, b) => Number(a.price) - Number(b.price));
  }

  function updateCart(id: string, delta: number, maxStock: number) {
    setCart((prev) => {
      const current = prev[id] ?? 0;
      let next = current + delta;
      if (next > maxStock) next = maxStock;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  }

  const cartItems = Object.entries(cart);
  const totalItems = cartItems.reduce((sum, [_, qty]) => sum + qty, 0);
  const totalPrice = cartItems.reduce((sum, [id, qty]) => {
    const p = products.find((prod) => prod.id === id);
    return sum + (p ? Number(p.price) * qty : 0);
  }, 0);

  function handleCheckout() {
    if (cartItems.length === 0) return;
    const today = toDateString(new Date());
    // Format: id1:qty1,id2:qty2
    const query = cartItems.map(([id, qty]) => `${id}:${qty}`).join(",");
    // Tambahkan parameter date=hari-ini
    router.push(`/order?date=${today}&items=${query}`);
  }

  return (
    <div className="space-y-8">
      {/* Filter & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "ready", label: "Ready" },
            { id: "cheap", label: "Paling Murah" },
            { id: "habis", label: "Habis" },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id as FilterType)}
              className={cn(
                "shrink-0 rounded-full px-5 py-2 font-display text-xs font-semibold transition-all sm:text-sm",
                filter === f.id
                  ? "bg-yumm-pink text-white shadow-md shadow-yumm-pink/20"
                  : "bg-white text-ink-muted hover:bg-surface-muted hover:text-ink"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Cari makanan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-neutral-200 bg-white py-2 pl-10 pr-4 text-sm text-ink outline-none placeholder:text-ink-muted/60 focus:border-yumm-pink focus:ring-2 focus:ring-yumm-pink/20"
          />
          <Search size={16} className="absolute left-4 top-2.5 text-ink-muted" />
        </div>
      </div>

      {/* Grid Produk */}
      {filtered.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-neutral-200 bg-white py-16 text-center">
          <p className="font-display text-lg font-bold text-ink">Menu tidak ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 lg:gap-5">
          {filtered.map((p) => {
            const isOut = p.ready_stock <= 0;
            const qtyInCart = cart[p.id] ?? 0;

            return (
              <div
                key={p.id}
                className={cn(
                  "group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all",
                  isOut ? "border-neutral-100 opacity-60 grayscale-[50%]" : "border-neutral-100 hover:-translate-y-1 hover:shadow-md"
                )}
              >
                <div className="relative aspect-square w-full overflow-hidden bg-surface-muted">
                  {p.image_url ? (
                    <Image src={p.image_url} alt={p.name} fill sizes="20vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-yumm-pink/10 via-yumm-lilac/10 to-yumm-mint/20">
                      <Cake size={24} className="text-yumm-pink/40" />
                    </div>
                  )}

                  {/* BADGE KATEGORI */}
                  {p.badge && !isOut && (
                    <div className="absolute left-2 top-2 flex flex-col gap-1">
                      {p.badge === "terlaris" && (
                        <span className="rounded-full bg-yumm-coral px-2 py-0.5 text-[9px] font-bold text-white shadow-sm">Terlaris</span>
                      )}
                      {p.badge === "best_seller" && (
                        <span className="rounded-full bg-yumm-lilac px-2 py-0.5 text-[9px] font-bold text-white shadow-sm">Best Seller</span>
                      )}
                      {p.badge === "terbaru" && (
                        <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-bold text-white shadow-sm">Baru</span>
                      )}
                    </div>
                  )}

                  {isOut && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px]">
                      <span className="rounded-full bg-ink px-3 py-1 font-display text-[10px] font-bold text-white shadow-lg">HABIS</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-2.5 sm:p-3">
                  <h3 className="truncate font-display text-xs font-bold text-ink sm:text-sm">{p.name}</h3>
                  <p className="mt-0.5 font-display text-xs font-bold text-yumm-pink sm:text-sm">
                    Rp{Number(p.price).toLocaleString("id-ID")}
                  </p>
                  
                  <p className="mt-1 text-[10px] text-ink-muted">
                    Terjual {p.totalSold} kali
                  </p>

                  <div className="mt-auto pt-3">
                    {isOut ? (
                      <button disabled className="w-full rounded-full bg-neutral-200 py-1.5 text-[10px] font-bold text-ink-muted sm:text-xs">Habis</button>
                    ) : qtyInCart > 0 ? (
                      <div className="flex items-center justify-between rounded-full bg-yumm-pink/10 p-1">
                        <button onClick={() => updateCart(p.id, -1, p.ready_stock)} className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-yumm-pink shadow-sm hover:bg-yumm-pink hover:text-white">
                          <Minus size={12} />
                        </button>
                        <span className="font-display text-xs font-bold text-yumm-pink">{qtyInCart}</span>
                        <button onClick={() => updateCart(p.id, 1, p.ready_stock)} className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-yumm-pink shadow-sm hover:bg-yumm-pink hover:text-white">
                          <Plus size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => updateCart(p.id, 1, p.ready_stock)}
                        className="flex w-full items-center justify-center gap-1.5 rounded-full bg-yumm-pink/10 py-1.5 text-[10px] font-bold text-yumm-pink transition-colors hover:bg-yumm-pink hover:text-white sm:text-xs"
                      >
                        <ShoppingCart size={12} strokeWidth={2.5} /> Tambah
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FLOATING CART BUTTON (Desain Baru) */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 animate-in slide-in-from-bottom-5">
          <button
            onClick={handleCheckout}
            className="flex w-full max-w-md items-center justify-between gap-4 rounded-full bg-yumm-pink px-5 py-3.5 text-white shadow-xl shadow-yumm-pink/30 transition-transform hover:scale-105 active:scale-95"
          >
            <div className="flex items-center gap-3">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <ShoppingCart size={16} />
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-yumm-pink">
                  {totalItems}
                </span>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-medium text-white/90">Total Pesanan</p>
                <p className="font-display text-sm font-bold">Rp{totalPrice.toLocaleString("id-ID")}</p>
              </div>
            </div>
            <span className="rounded-full bg-white px-4 py-1.5 font-display text-sm font-bold text-yumm-pink">
              Lanjut
            </span>
          </button>
        </div>
      )}
    </div>
  );
}