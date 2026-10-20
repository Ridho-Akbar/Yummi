import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSiteSettings } from "@/features/site/queries";
import { getAllSocialLinks } from "@/features/social-links/queries";
import { getActiveCarouselImages } from "@/features/carousel/queries";
import { getRecentSettingsAuditLogs } from "@/features/site/audit-queries";
import { getAllFaqs } from "@/features/faqs/queries";
import { getAllPins, getAllProductsForPin } from "@/features/homepage/queries"; // Import Pin queries
import { SettingsTabs } from "@/components/admin/settings/SettingsTabs";
import { StoreInfoForm } from "@/components/admin/settings/StoreInfoForm";
import { HeroForm } from "@/components/admin/settings/HeroForm";
import { RepeaterForm } from "@/components/admin/settings/RepeaterForm";
import { WhatsappForm } from "@/components/admin/settings/WhatsappForm";
import { FooterForm } from "@/components/admin/settings/FooterForm";
import { HomepageConfigForm } from "@/components/admin/settings/HomepageConfigForm";
import { SocialLinksForm } from "@/components/admin/settings/SocialLinksForm";
import { OrderPasswordForm } from "@/components/admin/settings/OrderPasswordForm";
import { AuditLogList } from "@/components/admin/settings/AuditLogList";
import { CarouselManager } from "@/components/admin/CarouselManager";
import { FaqManager } from "@/components/admin/faqs/FaqManager";
import { HomepagePinManager } from "@/components/admin/homepage/HomepagePinManager"; // Import Pin Manager
import { updateWhyChoose, updateHowToOrder } from "@/features/site/actions";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `Pengaturan — ${settings.storeInfo.name}`,
  };
}

const VALID_TABS = [
  "store", "hero", "why", "how", "whatsapp", "social",
  "footer", "homepage", "pins", "carousel", "faq", "security", "audit",
];

interface SettingsPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function AdminSettingsPage({
  searchParams,
}: SettingsPageProps) {
  const params = await searchParams;
  const tab = params.tab && VALID_TABS.includes(params.tab) ? params.tab : "store";

  const [
    settings,
    socialLinks,
    carouselImages,
    faqs,
    pins,
    products,
  ] = await Promise.all([
    getSiteSettings(),
    getAllSocialLinks(),
    getActiveCarouselImages(),
    getAllFaqs(),
    getAllPins(),
    getAllProductsForPin(),
  ]);

  const auditLogs = tab === "audit" ? await getRecentSettingsAuditLogs(30) : [];
  
  const categoryCounts = {
    latest: settings.homepageConfig.latestCount,
    terlaris: settings.homepageConfig.terlarisCount,
    best_seller: settings.homepageConfig.bestSellerCount,
  };

  return (
    <div className="space-y-6">
      <header>
        <Link
          href="/admin"
          className="mb-2 inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-yumm-pink hover:underline"
        >
          <ArrowLeft size={12} /> Kembali ke Dasbor
        </Link>
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          Pengaturan
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Atur profil toko, konten halaman depan, halaman menu, dan keamanan.
        </p>
      </header>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <SettingsTabs current={tab} />

        <div className="min-w-0 flex-1">
          {tab === "store" && <StoreInfoForm initial={settings.storeInfo} />}
          {tab === "hero" && <HeroForm initial={settings.hero} />}
          
          {tab === "why" && (
            <RepeaterForm
              action={updateWhyChoose}
              initialItems={settings.whyChoose}
              sectionTitle={`Kenapa Pilih ${settings.storeInfo.name}`}
              description={`Tiga sampai enam alasan singkat kenapa pelanggan harus pilih ${settings.storeInfo.name}.`}
              minItems={1}
              maxItems={6}
              titlePlaceholder="Contoh: Cepat"
              descPlaceholder="Penjelasan singkat dalam 1 kalimat"
              emptyMessage="Belum ada item. Tambah minimal 1 item untuk ditampilkan di halaman depan."
            />
          )}
          {tab === "how" && (
            <RepeaterForm
              action={updateHowToOrder}
              initialItems={settings.howToOrder}
              sectionTitle="Cara Pesan"
              description="Langkah-langkah yang harus dilakukan pelanggan untuk memesan."
              minItems={2}
              maxItems={6}
              titlePlaceholder="Contoh: Pilih Produk"
              descPlaceholder="Penjelasan singkat dalam 1 kalimat"
              emptyMessage="Belum ada langkah. Tambah minimal 2 langkah untuk ditampilkan."
            />
          )}
          
          {tab === "homepage" && (
            <HomepageConfigForm initial={settings.homepageConfig} />
          )}

          {/* TAB PIN PRODUK BARU */}
          {tab === "pins" && (
            <div className="space-y-5 rounded-yumm-lg border border-neutral-100 bg-white p-5 shadow-sm sm:p-6">
              <header>
                <h2 className="font-display text-base font-bold text-ink">
                  Pin Produk Unggulan
                </h2>
                <p className="mt-1 text-xs text-ink-muted">
                  Tentukan produk spesifik yang tampil di halaman depan. Slot yang dikosongkan akan diisi otomatis.
                </p>
              </header>
              {products.length === 0 ? (
                <p className="text-sm text-ink-muted">Belum ada produk aktif.</p>
              ) : (
                <HomepagePinManager
                  initialPins={pins}
                  products={products}
                  categoryCounts={categoryCounts}
                />
              )}
            </div>
          )}

          {tab === "whatsapp" && <WhatsappForm initial={settings.whatsapp} />}
          {tab === "social" && <SocialLinksForm initial={socialLinks} />}
          {tab === "footer" && <FooterForm initial={settings.footer} />}
          
          {tab === "carousel" && (
            <div className="space-y-5 rounded-yumm-lg border border-neutral-100 bg-white p-5 shadow-sm sm:p-6">
              <header>
                <h2 className="font-display text-base font-bold text-ink">
                  Gambar Carousel Menu
                </h2>
                <p className="mt-1 text-xs text-ink-muted">
                  Gambar promosi di bagian atas halaman Menu. Rasio gambar otomatis dipotong menjadi 21:9.
                </p>
              </header>
              <CarouselManager initialImages={carouselImages} />
            </div>
          )}

          {tab === "faq" && (
            <div className="space-y-5 rounded-yumm-lg border border-neutral-100 bg-white p-5 shadow-sm sm:p-6">
              <header>
                <h2 className="font-display text-base font-bold text-ink">
                  Pertanyaan Umum (FAQ)
                </h2>
                <p className="mt-1 text-xs text-ink-muted">
                  Daftar pertanyaan yang sering ditanyakan pelanggan.
                </p>
              </header>
              <FaqManager initial={faqs} />
            </div>
          )}

          {tab === "security" && (
            <OrderPasswordForm initial={settings.orderAccess} />
          )}
          {tab === "audit" && (
            <div className="rounded-yumm-lg border border-neutral-100 bg-white p-5 shadow-sm sm:p-6">
              <header className="mb-4">
                <h2 className="font-display text-base font-bold text-ink">
                  Riwayat Perubahan
                </h2>
                <p className="mt-1 text-xs text-ink-muted">
                  30 perubahan terakhir pada pengaturan toko.
                </p>
              </header>
              <AuditLogList logs={auditLogs} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}