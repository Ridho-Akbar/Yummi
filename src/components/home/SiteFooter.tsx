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
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="font-display text-3xl font-bold text-yumm-pink"
            >
              {store.name}
            </Link>
            {store.tagline && (
              <p className="mt-2 text-sm text-ink-muted">{store.tagline}</p>
            )}
            {footer.tagline && (
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
                {footer.tagline}
              </p>
            )}

            {hasSocial && (
              <div className="mt-6 flex flex-wrap gap-2">
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
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-ink-muted transition-all hover:-translate-y-0.5 hover:border-yumm-pink hover:bg-yumm-pink hover:text-white"
                    >
                      <meta.Icon size={ICON_SIZE.md} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {hasContact && (
            <div>
              <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink">
                Hubungi Kami
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                {store.address && (
                  <li className="flex gap-2.5 text-ink-muted">
                    <MapPin
                      size={16}
                      strokeWidth={2.2}
                      className="mt-0.5 shrink-0 text-yumm-pink"
                    />
                    <span>{store.address}</span>
                  </li>
                )}
                {store.phone && (
                  <li className="flex gap-2.5 text-ink-muted">
                    <Phone
                      size={16}
                      strokeWidth={2.2}
                      className="mt-0.5 shrink-0 text-yumm-pink"
                    />
                    <span>{store.phone}</span>
                  </li>
                )}
                {store.email && (
                  <li className="flex gap-2.5 text-ink-muted">
                    <Mail
                      size={16}
                      strokeWidth={2.2}
                      className="mt-0.5 shrink-0 text-yumm-pink"
                    />
                    <a
                      href={`mailto:${store.email}`}
                      className="underline-offset-4 hover:text-yumm-pink hover:underline"
                    >
                      {store.email}
                    </a>
                  </li>
                )}
                {store.hours && (
                  <li className="flex gap-2.5 text-ink-muted">
                    <Clock
                      size={16}
                      strokeWidth={2.2}
                      className="mt-0.5 shrink-0 text-yumm-pink"
                    />
                    <span>{store.hours}</span>
                  </li>
                )}
              </ul>
            </div>
          )}

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink">
              Navigasi
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-ink-muted transition-colors hover:text-yumm-pink"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/order"
                  className="text-ink-muted transition-colors hover:text-yumm-pink"
                >
                  Pesan Sekarang
                </Link>
              </li>
              <li>
                <Link
                  href="/documentation/features"
                  className="text-ink-muted transition-colors hover:text-yumm-pink"
                >
                  Fitur
                </Link>
              </li>
              <li>
                <Link
                  href="/documentation/developer"
                  className="text-ink-muted transition-colors hover:text-yumm-pink"
                >
                  Setup
                </Link>
              </li>
              <li>
                <Link
                  href="/documentation/admin-guide"
                  className="text-ink-muted transition-colors hover:text-yumm-pink"
                >
                  Panduan Admin
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-ink-muted transition-colors hover:text-yumm-pink"
                >
                  Masuk
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-100 pt-6 text-center">
          <p className="text-xs text-ink-muted">
            {footer.copyright ||
              `© ${new Date().getFullYear()} ${store.name}. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
