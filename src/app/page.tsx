import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getCalendarData } from "@/features/calendar/queries";
import { getSiteSettings } from "@/features/site/queries";
import { getActiveFaqs } from "@/features/faqs/queries";
import { getActiveSocialLinks } from "@/features/social-links/queries";
import { getHomepageData } from "@/features/homepage/queries";
import { SignInButton } from "@/components/auth/SignInButton";
import { UserMenu } from "@/components/auth/UserMenu";
import { HeroSection } from "@/components/home/HeroSection";
import { WhyChooseSection } from "@/components/home/WhyChooseSection";
import { FeaturedProductsSection } from "@/components/home/FeaturedProductsSection";
import { HowToOrderSection } from "@/components/home/HowToOrderSection";
import { CalendarSection } from "@/components/home/CalendarSection";
import { FaqSection } from "@/components/home/FaqSection";
import { SiteFooter } from "@/components/home/SiteFooter";
import { FloatingButton } from "@/components/home/FloatingButton";

interface HomePageProps {
  searchParams: Promise<{ year?: string; month?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const now = new Date();
  const year = params.year ? Number(params.year) : now.getFullYear();
  const month = params.month ? Number(params.month) : now.getMonth();

  const [
    user,
    settings,
    faqs,
    socialLinks,
    homepageData,
    calendarDays,
  ] = await Promise.all([
    getCurrentUser(),
    getSiteSettings(),
    getActiveFaqs(),
    getActiveSocialLinks(),
    getHomepageData(),
    getCalendarData(year, month),
  ]);

  const whatsappUrl = settings.whatsapp.url || null;
  const showFloating =
    settings.whatsapp.floatingEnabled && Boolean(whatsappUrl);

  return (
    <div className="min-h-dvh bg-surface">
      <header className="sticky top-0 z-30 border-b border-neutral-100 bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <Link
            href="/"
            className="font-display text-2xl font-bold text-yumm-pink sm:text-3xl"
          >
            Yumm!
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/documentation/features"
              className="hidden text-sm font-semibold text-ink-muted transition-colors hover:text-yumm-pink sm:inline-block"
            >
              Fitur
            </Link>
            <Link
               href="/documentation/developer"
               className="hidden text-sm font-semibold text-ink-muted transition-colors hover:text-yumm-pink sm:inline-block"
             >
               Setup
             </Link>
            <Link
               href="/documentation/admin-guide"
               className="hidden text-sm font-semibold text-ink-muted transition-colors hover:text-yumm-pink sm:inline-block"
             >
               Panduan Admin
             </Link>
            <Link
              href="/order"
              className="rounded-full bg-yumm-pink px-4 py-2 font-display text-xs font-semibold text-white transition-colors hover:bg-yumm-coral sm:text-sm"
            >
              Pesan
            </Link>
            {user ? (
              <UserMenu user={user} />
            ) : (
              <SignInButton label="Masuk" />
            )}
          </div>
        </div>
      </header>

      <main>
        <HeroSection hero={settings.hero} whatsappUrl={whatsappUrl} />

        <WhyChooseSection items={settings.whyChoose} />

        <FeaturedProductsSection data={homepageData} />

        <HowToOrderSection items={settings.howToOrder} />

        <CalendarSection year={year} month={month} days={calendarDays} />

        <FaqSection faqs={faqs} />
      </main>

      <SiteFooter
        store={settings.storeInfo}
        footer={settings.footer}
        socialLinks={socialLinks}
      />

      {showFloating && whatsappUrl && (
        <FloatingButton whatsappUrl={whatsappUrl} />
      )}
    </div>
  );
}