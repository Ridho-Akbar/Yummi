import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  getAllPins,
  getAllProductsForPin,
} from "@/features/homepage/queries";
import { getSiteSettings } from "@/features/site/queries";
import { HomepagePinManager } from "@/components/admin/homepage/HomepagePinManager";

export const metadata = {
  title: "Produk Unggulan — Admin Yumm!",
};

export default async function AdminHomepagePage() {
  const [pins, products, settings] = await Promise.all([
    getAllPins(),
    getAllProductsForPin(),
    getSiteSettings(),
  ]);

  const counts = {
    latest: settings.homepageConfig.latestCount,
    terlaris: settings.homepageConfig.terlarisCount,
    best_seller: settings.homepageConfig.bestSellerCount,
  };

  return (
    <div className="space-y-6">
      <header>
        <Link
          href="/admin/settings?tab=homepage"
          className="inline-flex items-center gap-1.5 text-xs text-ink-muted underline-offset-4 hover:underline"
        >
          <ArrowLeft size={12} strokeWidth={2.5} />
          Kembali ke Pengaturan
        </Link>
        <h1 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
          Produk Unggulan
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Pin produk tertentu untuk tampil di homepage. Slot yang dikosongkan
          diisi otomatis oleh sistem.
        </p>
      </header>

      {products.length === 0 ? (
        <div className="rounded-yumm-lg border border-dashed border-neutral-200 bg-white px-4 py-12 text-center">
          <p className="text-sm text-ink-muted">
            Belum ada produk aktif. Tambahkan produk dulu di{" "}
            <Link
              href="/admin/products"
              className="font-semibold text-yumm-pink underline-offset-4 hover:underline"
            >
              /admin/products
            </Link>
            .
          </p>
        </div>
      ) : (
        <HomepagePinManager
          initialPins={pins}
          products={products}
          categoryCounts={counts}
        />
      )}
    </div>
  );
}
