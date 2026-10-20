import type { WhyChooseItem } from "@/features/site/types";

interface WhyChooseSectionProps {
  items: WhyChooseItem[];
}

export function WhyChooseSection({ items }: WhyChooseSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Kenapa Pilih <span className="text-yumm-pink">Kami?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
            Bukan sekadar jualan, ini alasan utama mengapa pelanggan mempercayakan acaranya kepada kami.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="group relative flex flex-col items-start rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-neutral-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:ring-yumm-pink/30"
            >
              {/* Badge Angka */}
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yumm-pink/10 text-yumm-pink transition-all duration-300 group-hover:bg-yumm-pink group-hover:text-white">
                <span className="font-display text-sm font-bold">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Judul & Deskripsi */}
              <h3 className="mt-5 font-display text-lg font-bold text-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}