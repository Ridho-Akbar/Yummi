import Image from "next/image";
import { Cake } from "lucide-react";
import { getAllProducts } from "@/features/products/queries";
import { ProductModal } from "@/components/admin/ProductModal";
import { InlineStockEditor } from "@/components/admin/InlineStockEditor";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

export const metadata = {
  title: "Produk — Admin Yumm!",
};

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            Produk
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {products.length} produk terdaftar.
          </p>
        </div>

        <ProductModal
          trigger={
            <button
              type="button"
              className="rounded-yumm bg-yumm-pink px-5 py-2.5 font-display text-sm font-semibold text-white transition-colors hover:bg-yumm-coral"
            >
              + Tambah produk
            </button>
          }
        />
      </header>

      {products.length === 0 ? (
        <div className="rounded-yumm-lg border border-neutral-100 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-ink-muted">
            Belum ada produk. Tambah produk pertama untuk mulai berjualan.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile: Kartu */}
          <div className="space-y-3 md:hidden">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Desktop: Tabel */}
          <div className="hidden overflow-hidden rounded-yumm-lg border border-neutral-100 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-sm">
                <thead className="bg-surface-muted">
                  <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                    <th className="px-4 py-3">Produk</th>
                    <th className="px-4 py-3">Harga</th>
                    <th className="px-4 py-3">Stok Jadi</th>
                    <th className="px-4 py-3">Max Pre-Order</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="w-16 px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-t border-neutral-100 transition-colors hover:bg-surface-muted/30"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-neutral-100 bg-surface-muted">
                            {product.image_url ? (
                              <Image
                                src={product.image_url}
                                alt={product.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Cake
                                  size={18}
                                  className="text-ink-muted/30"
                                />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-display font-semibold text-ink">
                              {product.name}
                            </p>
                            {product.description && (
                              <p className="mt-0.5 line-clamp-1 text-xs text-ink-muted">
                                {product.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-display font-semibold text-ink">
                        Rp{Number(product.price).toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3">
                        <InlineStockEditor
                          productId={product.id}
                          currentStock={product.ready_stock}
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={cn(
                            "font-display font-semibold",
                            product.daily_capacity < 5
                              ? "text-yumm-coral"
                              : "text-ink"
                          )}
                        >
                          {product.daily_capacity} / hari
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge isAvailable={product.is_available} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <ProductModal
                          product={product}
                          trigger={
                            <button
                              type="button"
                              className="text-xs font-semibold text-yumm-pink underline-offset-4 hover:underline"
                            >
                              Edit
                            </button>
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="rounded-yumm-lg border border-neutral-100 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-neutral-100 bg-surface-muted">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Cake size={24} className="text-ink-muted/30" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="font-display font-semibold text-ink">
              {product.name}
            </p>
            <StatusBadge isAvailable={product.is_available} />
          </div>
          <p className="mt-0.5 line-clamp-1 text-xs text-ink-muted">
            {product.description || "Tanpa deskripsi"}
          </p>
          <p className="mt-2 font-display font-semibold text-ink">
            Rp{Number(product.price).toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-neutral-100 pt-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
            Stok Jadi
          </p>
          <div className="mt-1">
            <InlineStockEditor
              productId={product.id}
              currentStock={product.ready_stock}
            />
          </div>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
            Max Pre-Order
          </p>
          <p
            className={cn(
              "mt-1 font-display text-sm font-semibold",
              product.daily_capacity < 5 ? "text-yumm-coral" : "text-ink"
            )}
          >
            {product.daily_capacity} / hari
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-end border-t border-neutral-100 pt-3">
        <ProductModal
          product={product}
          trigger={
            <button
              type="button"
              className="rounded-yumm border border-neutral-200 px-4 py-1.5 font-display text-xs font-semibold text-ink transition-colors hover:border-yumm-pink hover:bg-yumm-pink/5 hover:text-yumm-pink"
            >
              Edit
            </button>
          }
        />
      </div>
    </div>
  );
}

function StatusBadge({ isAvailable }: { isAvailable: boolean | null }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-3 py-1 text-xs font-semibold",
        isAvailable
          ? "bg-yumm-mint/30 text-emerald-700"
          : "bg-neutral-200 text-ink-muted"
      )}
    >
      {isAvailable ? "Aktif" : "Nonaktif"}
    </span>
  );
}