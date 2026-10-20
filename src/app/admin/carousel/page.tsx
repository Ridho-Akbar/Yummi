import { getActiveCarouselImages } from "@/features/carousel/queries";
import { CarouselManager } from "@/components/admin/CarouselManager";

export const metadata = {
  title: "Carousel Menu — Admin Yumm!",
};

export default async function AdminCarouselPage() {
  const images = await getActiveCarouselImages();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          Gambar Carousel
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Gambar promosi yang muncul di bagian paling atas halaman Menu.
          Rasio gambar otomatis akan dipotong menjadi 21:9.
        </p>
      </header>

      <CarouselManager initialImages={images} />
    </div>
  );
}
