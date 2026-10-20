import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type {
  HomepageProduct,
  HomepageData,
  HomepageCategory,
} from "@/features/homepage/types";
import { HOMEPAGE_CATEGORY_INFO } from "@/features/homepage/types";

interface FeaturedProductsSectionProps {
  data: HomepageData;
}

const DESKTOP_ORDER: HomepageCategory[] = ["latest", "best_seller", "terlaris"];

export function FeaturedProductsSection({
  data,
}: FeaturedProductsSectionProps) {
  const categoryMap: Record<HomepageCategory, HomepageProduct[]> = {
    latest: data.latest,
    best_seller: data.bestSeller,
    terlaris: data.terlaris,
  };

  const hasAny = DESKTOP_ORDER.some((cat) => categoryMap[cat].length > 0);

  if (!hasAny) return null;

  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Pilihan <span className="text-yumm-pink">Favorit</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
            Koleksi makanan yang paling sering dipesan pelanggan kami.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {DESKTOP_ORDER.map((category) => (
            <CategoryColumn
              key={category}
              category={category}
              products={categoryMap[category]}
            />
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/menu"
            className="inline-flex items-center justify-center rounded-full bg-yumm-pink px-8 py-3.5 font-display text-sm font-semibold text-white shadow-lg shadow-yumm-pink/25 transition-all hover:-translate-y-0.5 hover:bg-yumm-coral"
          >
            Lihat semua menu
          </Link>
        </div>
      </div>
    </section>
  );
}

interface CategoryColumnProps {
  category: HomepageCategory;
  products: HomepageProduct[];
}

function CategoryColumn({ category, products }: CategoryColumnProps) {
  const info = HOMEPAGE_CATEGORY_INFO[category];
  const isCenter = category === "best_seller";

  return (
    <div
      className={cn(
        "flex flex-col rounded-[2rem] p-6 transition-all",
        isCenter
          ? "bg-yumm-pink/10 ring-1 ring-yumm-pink/20" // Warna pink solid lembut
          : "bg-white ring-1 ring-neutral-100 shadow-sm"
      )}
    >
      <header className="mb-6 text-center">
        <h3
          className={cn(
            "font-display text-xl font-bold tracking-tight",
            isCenter ? "text-yumm-pink" : "text-ink"
          )}
        >
          {info.label}
        </h3>
        <p className="mt-1.5 text-xs text-ink-muted/80">{info.description}</p>
      </header>

      {products.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-neutral-200/60 py-10 text-center">
          <p className="text-xs font-medium text-ink-muted/60">Belum ada produk</p>
        </div>
      ) : (
        <div className="flex-1 space-y-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

interface ProductCardProps {
  product: HomepageProduct;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/order?product=${product.id}`}
      className="group flex items-center gap-4 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-neutral-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:ring-yumm-pink/30"
    >
      {/* Gambar Kotak di Kiri */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-yumm-pink/10 to-yumm-lilac/10" />
        )}
      </div>

      {/* Teks di Kanan */}
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <p className="line-clamp-2 font-display text-sm font-bold leading-snug text-ink">
          {product.name}
        </p>
        
        <div className="mt-1.5 flex items-baseline gap-2">
          <p className="font-display text-sm font-bold text-yumm-pink">
            Rp{product.price.toLocaleString("id-ID")}
          </p>
          {product.minOrderQty > 1 && (
            <p className="text-[10px] font-medium text-ink-muted">
              min. {product.minOrderQty}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}