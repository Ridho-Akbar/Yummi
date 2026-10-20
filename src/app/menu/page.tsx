import { getMenuProducts } from "@/features/orders/queries";
import { getActiveCarouselImages } from "@/features/carousel/queries";
import { getSiteSettings } from "@/features/site/queries";
import { MenuCarousel } from "@/components/menu/MenuCarousel";
import { MenuClient } from "@/components/menu/MenuClient";
import { PublicHeader } from "@/components/layout/PublicHeader";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: `Menu Hari Ini — ${settings.storeInfo.name}`,
  };
}

export default async function MenuPage() {
  const [products, carouselImages, settings] = await Promise.all([
    getMenuProducts(),
    getActiveCarouselImages(),
    getSiteSettings(),
  ]);

  return (
    <div className="min-h-dvh bg-surface pb-24">
      <PublicHeader 
        storeName={settings.storeInfo.name} 
        backUrl="/" 
        backLabel="Beranda" 
      />

      <main className="pb-12 pt-6 sm:pb-16 sm:pt-8">
        <div className="w-full">
          <MenuCarousel images={carouselImages} />
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 mt-12 text-center sm:mt-16">
            <h1 className="mt-3 font-display text-3xl font-bold text-ink sm:text-5xl">
              Siap Antar <span className="text-yumm-pink">Hari Ini</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
              Menu di bawah tersedia untuk pengiriman/pengambilan hari ini.
              Tambahkan ke keranjang, lalu lanjutkan ke form pesanan.
            </p>
          </div>

          <MenuClient products={products} />
        </div>
      </main>
    </div>
  );
}