import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ICON_SIZE } from "@/lib/icons";
import { WhatsappIcon } from "./SocialIcon";
import type { HeroContent } from "@/features/site/types";

interface HeroSectionProps {
  hero: HeroContent;
  whatsappUrl: string | null;
}

export function HeroSection({ hero, whatsappUrl }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-yumm-pink/5 via-yumm-lilac/5 to-yumm-mint/5 px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
      {/* Dekorasi Background */}
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
        <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl">
          {hero.tagline}
        </h1>

        {hero.subtitle && (
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
            {hero.subtitle}
          </p>
        )}

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {/* Tombol Utama */}
          <Link
            href="/order"
            className="group inline-flex items-center gap-2 rounded-full bg-yumm-pink px-8 py-4 font-display text-sm font-semibold text-white shadow-lg shadow-yumm-pink/25 transition-all duration-300 hover:-translate-y-1 hover:bg-yumm-coral hover:shadow-xl"
          >
            Pesan Sekarang
            <ArrowRight
              size={ICON_SIZE.sm}
              strokeWidth={2.5}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          {/* Tombol WhatsApp */}
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-full border border-neutral-200 bg-white px-8 py-4 font-display text-sm font-semibold text-ink shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-yumm-pink/30 hover:shadow-md"
            >
              <span className="text-emerald-500 transition-transform duration-300 group-hover:scale-110">
                <WhatsappIcon size={18} />
              </span>
              Tanya Admin
            </a>
          )}
        </div>
      </div>
    </section>
  );
}