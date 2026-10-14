import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { ICON_SIZE } from "@/lib/icons";
import type { HeroContent } from "@/features/site/types";

interface HeroSectionProps {
  hero: HeroContent;
  whatsappUrl: string | null;
}

export function HeroSection({ hero, whatsappUrl }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-yumm-pink/5 via-yumm-lilac/5 to-yumm-mint/5 px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
      <div
        aria-hidden
        className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-yumm-mint/30 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-yumm-lilac/30 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yumm-pink/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-yumm-pink">
          Yumm! · Pre-order makanan viral
        </p>

        <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl">
          {hero.tagline}
        </h1>

        {hero.subtitle && (
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
            {hero.subtitle}
          </p>
        )}

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/order"
            className="group inline-flex items-center gap-2 rounded-full bg-yumm-pink px-7 py-3.5 font-display text-sm font-semibold text-white shadow-lg shadow-yumm-pink/25 transition-all hover:-translate-y-0.5 hover:bg-yumm-coral hover:shadow-xl"
          >
            Pesan Sekarang
            <ArrowRight
              size={ICON_SIZE.sm}
              strokeWidth={2.5}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>

          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-yumm-pink/30 bg-white/80 px-7 py-3.5 font-display text-sm font-semibold text-yumm-pink backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-yumm-pink hover:bg-white"
            >
              <MessageCircle size={ICON_SIZE.sm} strokeWidth={2.5} />
              Tanya Admin
            </a>
          )}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-ink-muted">
          <FeaturePill>Buatan tangan segar</FeaturePill>
          <FeaturePill>Custom sesuai tema</FeaturePill>
          <FeaturePill>Konfirmasi cepat</FeaturePill>
        </div>
      </div>
    </section>
  );
}

function FeaturePill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-1.5 w-1.5 rounded-full bg-yumm-pink" />
      {children}
    </span>
  );
}
