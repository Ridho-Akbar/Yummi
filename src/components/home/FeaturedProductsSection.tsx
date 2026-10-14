import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Cake, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/lib/icons";
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
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-yumm-pink">
            Produk Unggulan
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
            Pilihan favorit pelanggan
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
            Klik produk untuk langsung pesan.
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

        <div className="mt-10 text-center">
          <Link
            href="/order"
            className="group inline-flex items-center gap-2 rounded-full border-2 border-yumm-pink/30 bg-white px-6 py-3 font-display text-sm font-semibold text-yumm-pink transition-all hover:-translate-y-0.5 hover:border-yumm-pink hover:bg-yumm-pink hover:text-white"
          >
            Lihat semua produk
            <ArrowRight
              size={ICON_SIZE.sm}
              strokeWidth={2.5}
              className="transition-transform group-hover:translate-x-0.5"
            />
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
        "rounded-yumm-lg border p-4",
        isCenter
          ? "border-yumm-pink/30 bg-gradient-to-b from-yumm-pink/[0.04] to-white"
          : "border-neutral-100 bg-white"
      )}
    >
      <header className="mb-4 text-center">
        <div className="inline-flex items-center gap-1.5">
          {isCenter ? (
            <Sparkles
              size={14}
              strokeWidth={2.5}
              className="text-yumm-pink"
            />
          ) : null}
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink">
            {info.label}
          </h3>
        </div>
        <p className="mt-1 text-[11px] text-ink-muted">{info.description}</p>
      </header>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-yumm border border-dashed border-neutral-200 py-8 text-center">
          <Cake size={24} className="text-ink-muted/50" />
          <p className="mt-2 text-xs text-ink-muted">Belum ada produk</p>
        </div>
      ) : (
        <div className="space-y-3">
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
      className="group block overflow-hidden rounded-yumm border border-neutral-100 bg-white transition-all hover:-translate-y-0.5 hover:border-yumm-pink/40 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-muted">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-yumm-pink/10 via-yumm-lilac/10 to-yumm-mint/20">
            <Cake size={40} className="text-yumm-pink/40" strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="p-3">
        <p className="truncate font-display text-sm font-semibold text-ink">
          {product.name}
        </p>
        <p className="mt-1 font-display text-sm font-bold text-yumm-pink">
          Rp{product.price.toLocaleString("id-ID")}
        </p>
        {product.minOrderQty > 1 && (
          <p className="mt-0.5 text-[10px] text-ink-muted">
            Min. order {product.minOrderQty}
          </p>
        )}
      </div>
    </Link>
  );
}