import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { ICON_SIZE } from "@/lib/icons";
import {
  FacebookIcon,
  InstagramIcon,
  ShopeeIcon,
  TikTokIcon,
  TokopediaIcon,
  TwitterIcon,
  WhatsappIcon,
  YoutubeIcon,
  GlobeIcon,
} from "./SocialIcon";
import type { StoreInfo, FooterContent } from "@/features/site/types";
import type { SocialLink } from "@/features/social-links/types";

interface SiteFooterProps {
  store: StoreInfo;
  footer: FooterContent;
  socialLinks: SocialLink[];
}

type IconComponent = (props: {
  size?: number;
  className?: string;
}) => React.ReactElement;

const PLATFORM_META: Record<
  string,
  { label: string; Icon: IconComponent }
> = {
  instagram: { label: "Instagram", Icon: InstagramIcon },
  facebook: { label: "Facebook", Icon: FacebookIcon },
  tiktok: { label: "TikTok", Icon: TikTokIcon },
  twitter: { label: "Twitter/X", Icon: TwitterIcon },
  youtube: { label: "YouTube", Icon: YoutubeIcon },
  whatsapp: { label: "WhatsApp", Icon: WhatsappIcon },
  shopee: { label: "Shopee", Icon: ShopeeIcon },
  tokopedia: { label: "Tokopedia", Icon: TokopediaIcon },
  website: { label: "Website", Icon: GlobeIcon },
};

export function SiteFooter({
  store,
  footer,
  socialLinks,
}: SiteFooterProps) {
  const hasContact =
    store.address || store.phone || store.email || store.hours;
  const hasSocial = socialLinks.length > 0;

  return (
    <footer className="border-t border-neutral-100 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        
        {/* Layout: 3 kolom (Brand, Kontak, Jelajahi) */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr] lg:gap-12">
          
          {/* KOLOM 1: Brand & Sosmed */}
          <div className="lg:pr-4">
            <Link
              href="/"
              className="font-display text-3xl font-bold tracking-tight text-yumm-pink"
            >
              {store.name}
            </Link>
            {store.tagline && (
              <p className="mt-2 text-sm font-semibold text-ink">
                {store.tagline}
              </p>
            )}
            {footer.tagline && (
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
                {footer.tagline}
              </p>
            )}

            {hasSocial && (
              <div className="mt-8 flex flex-wrap gap-2.5">
                {socialLinks.map((link) => {
                  const meta = PLATFORM_META[link.platform];
                  if (!meta) return null;
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={meta.label}
                      title={meta.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-muted text-ink-muted transition-all duration-300 hover:-translate-y-1 hover:bg-yumm-pink hover:text-white hover:shadow-md"
                    >
                      <meta.Icon size={18} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* KOLOM 2: Kontak */}
          {hasContact && (
            <div>
              <h3 className="font-display text-sm font-bold tracking-wide text-ink">
                Hubungi Kami
              </h3>
              <ul className="mt-5 space-y-4 text-sm">
                {store.address && (
                  <li className="flex gap-3 text-ink-muted">
                    <MapPin
                      size={18}
                      strokeWidth={2.2}
                      className="mt-0.5 shrink-0 text-yumm-pink"
                    />
                    <span className="leading-relaxed">{store.address}</span>
                  </li>
                )}
                {store.phone && (
                  <li className="flex gap-3 text-ink-muted">
                    <Phone
                      size={18}
                      strokeWidth={2.2}
                      className="mt-0.5 shrink-0 text-yumm-pink"
                    />
                    <span>{store.phone}</span>
                  </li>
                )}
                {store.email && (
                  <li className="flex gap-3 text-ink-muted">
                    <Mail
                      size={18}
                      strokeWidth={2.2}
                      className="mt-0.5 shrink-0 text-yumm-pink"
                    />
                    <a
                      href={`mailto:${store.email}`}
                      className="transition-colors hover:text-yumm-pink"
                    >
                      {store.email}
                    </a>
                  </li>
                )}
                {store.hours && (
                  <li className="flex gap-3 text-ink-muted">
                    <Clock
                      size={18}
                      strokeWidth={2.2}
                      className="mt-0.5 shrink-0 text-yumm-pink"
                    />
                    <span>{store.hours}</span>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* KOLOM 3: Jelajahi */}
          <div>
            <h3 className="font-display text-sm font-bold tracking-wide text-ink">
              Jelajahi
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link href="/" className="inline-block text-ink-muted transition-all duration-200 hover:translate-x-1 hover:text-yumm-pink">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/menu" className="inline-block text-ink-muted transition-all duration-200 hover:translate-x-1 hover:text-yumm-pink">
                  Menu Hari Ini
                </Link>
              </li>
              <li>
                <Link href="/order" className="inline-block text-ink-muted transition-all duration-200 hover:translate-x-1 hover:text-yumm-pink">
                  Pesan Pre-Order
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* BARIS BAWAH: Copyright & Legal */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-neutral-100 pt-8 sm:flex-row">
          <p className="text-xs font-medium text-ink-muted/70">
            {footer.copyright ||
              `© ${new Date().getFullYear()} ${store.name}. All rights reserved.`}
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/terms"
              className="text-xs font-semibold text-ink-muted transition-colors hover:text-yumm-pink"
            >
              Ketentuan Layanan
            </Link>
            <Link
              href="/terms"
              className="text-xs font-semibold text-ink-muted transition-colors hover:text-yumm-pink"
            >
              Kebijakan Privasi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}