import { getCurrentUser } from "@/lib/auth";
import { getCalendarData } from "@/features/calendar/queries";
import { getSiteSettings } from "@/features/site/queries";
import { getActiveFaqs } from "@/features/faqs/queries";
import { getActiveSocialLinks } from "@/features/social-links/queries";
import { getHomepageData } from "@/features/homepage/queries";

import { Navbar } from "@/components/home/Navbar";
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
      {/* OPER NAMA TOKO DARI DATABASE KE NAVBAR */}
      <Navbar user={user} storeName={settings.storeInfo.name} />

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