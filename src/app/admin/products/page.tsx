import { getAllProducts } from "@/features/products/queries";
import { ProductModal } from "@/components/admin/ProductModal";
import { QuickRestockButtons } from "@/components/admin/QuickRestockButtons";
import { cn } from "@/lib/utils";

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
          {/* Mobile: kartu */}
          <div className="space-y-3 sm:hidden">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Desktop: tabel */}
          <div className="hidden overflow-hidden rounded-yumm-lg border border-neutral-100 bg-white shadow-sm sm:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface-muted">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    <th className="px-4 py-3">Produk</th>
                    <th className="px-4 py-3">Harga</th>
                    <th className="px-4 py-3">Stok jadi</th>
                    <th className="px-4 py-3">Kapasitas/hari</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-t border-neutral-100 transition-colors hover:bg-surface-muted/50"
                    >
                      <td className="px-4 py-3">
                        <p className="font-display font-semibold text-ink">
                          {product.name}
                        </p>
                        {product.description && (
                          <p className="mt-0.5 line-clamp-1 text-xs text-ink-muted">
                            {product.description}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 font-display font-semibold text-ink">
                        Rp{Number(product.price).toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "min-w-6 text-center font-display font-bold",
                              product.ready_stock < 3
                                ? "text-yumm-coral"
                                : "text-ink"
                            )}
                          >
                            {product.ready_stock}
                          </span>
                          <QuickRestockButtons
                            productId={product.id}
                            currentStock={product.ready_stock}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            product.daily_capacity < 5
                              ? "font-semibold text-yumm-coral"
                              : "text-ink"
                          }
                        >
                          {product.daily_capacity}
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

function ProductCard({
  product,
}: {
  product: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    ready_stock: number;
    daily_capacity: number;
    is_available: boolean;
  };
}) {
  return (
    <div className="rounded-yumm-lg border border-neutral-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-display font-semibold text-ink">
            {product.name}
          </p>
          {product.description && (
            <p className="mt-0.5 line-clamp-1 text-xs text-ink-muted">
              {product.description}
            </p>
          )}
        </div>
        <StatusBadge isAvailable={product.is_available} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
            Harga
          </p>
          <p className="mt-0.5 font-display font-semibold text-ink">
            Rp{Number(product.price).toLocaleString("id-ID")}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
            Kapasitas/hari
          </p>
          <p
            className={cn(
              "mt-0.5 font-display font-semibold",
              product.daily_capacity < 5 ? "text-yumm-coral" : "text-ink"
            )}
          >
            {product.daily_capacity}
          </p>
        </div>
      </div>

      <div className="mt-4 border-t border-neutral-100 pt-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
          Stok jadi
        </p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <span
            className={cn(
              "font-display text-xl font-bold",
              product.ready_stock < 3 ? "text-yumm-coral" : "text-ink"
            )}
          >
            {product.ready_stock}
          </span>
          <QuickRestockButtons
            productId={product.id}
            currentStock={product.ready_stock}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <ProductModal
          product={product as never}
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

function StatusBadge({ isAvailable }: { isAvailable: boolean }) {
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