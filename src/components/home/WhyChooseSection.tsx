import type { WhyChooseItem } from "@/features/site/types";

interface WhyChooseSectionProps {
  items: WhyChooseItem[];
}

export function WhyChooseSection({ items }: WhyChooseSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-yumm-pink">
            Kenapa Pilih Yumm
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
            Alasan pelanggan balik lagi
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-yumm-lg border border-neutral-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <span
                aria-hidden
                className="absolute -right-3 -top-5 font-display text-7xl font-bold text-yumm-pink/10"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="relative">
                <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-yumm-pink">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-lg font-bold text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
