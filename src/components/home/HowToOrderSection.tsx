import Link from "next/link";
import type { HowToOrderItem } from "@/features/site/types";

interface HowToOrderSectionProps {
  items: HowToOrderItem[];
}

export function HowToOrderSection({ items }: HowToOrderSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="bg-yumm-pink/10 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Cara Mudah <span className="text-yumm-pink">Pesan</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
            Hanya butuh beberapa langkah sederhana untuk memulai pesananmu.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-yumm-pink/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:ring-yumm-pink/40"
            >
              {/* Angka Raksasa Transparan di Latar Belakang (Watermark) */}
              <span
                aria-hidden
                className="absolute -right-2 -top-6 font-display text-8xl font-black tracking-tighter text-yumm-pink/5 transition-colors duration-300 group-hover:text-yumm-pink/10"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Konten di Atas Watermark */}
              <div className="relative">
                <span className="font-display text-xs font-bold uppercase tracking-widest text-yumm-pink">
                  Langkah {index + 1}
                </span>
                <h3 className="mt-2 font-display text-lg font-bold text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          {/* Tombol dikembalikan ke style standar (Pink) */}
          <Link
            href="/order"
            className="inline-flex items-center justify-center rounded-full bg-yumm-pink px-8 py-3.5 font-display text-sm font-semibold text-white shadow-lg shadow-yumm-pink/25 transition-all hover:-translate-y-0.5 hover:bg-yumm-coral"
          >
            Mulai pesan sekarang
          </Link>
        </div>
      </div>
    </section>
  );
}