import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ICON_SIZE } from "@/lib/icons";
import type { HowToOrderItem } from "@/features/site/types";

interface HowToOrderSectionProps {
  items: HowToOrderItem[];
}

export function HowToOrderSection({ items }: HowToOrderSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="bg-surface-muted px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-yumm-pink">
            Cara Pesan
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
            Tiga langkah, langsung jadi
          </h2>
        </div>

        <div className="relative">
          <div
            aria-hidden
            className="absolute left-1/2 top-8 hidden h-0.5 w-2/3 -translate-x-1/2 border-t-2 border-dashed border-yumm-pink/30 lg:block"
          />

          <ol className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <li key={index} className="text-center">
                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-yumm-pink to-yumm-coral font-display text-xl font-bold text-white shadow-lg shadow-yumm-pink/25">
                  {index + 1}
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-ink">
                  {item.title}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-ink-muted">
                  {item.desc}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/order"
            className="group inline-flex items-center gap-2 rounded-full bg-yumm-pink px-7 py-3.5 font-display text-sm font-semibold text-white shadow-lg shadow-yumm-pink/25 transition-all hover:-translate-y-0.5 hover:bg-yumm-coral"
          >
            Mulai pesan
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
