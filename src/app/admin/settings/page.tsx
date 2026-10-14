import { getSiteSettings } from "@/features/site/queries";
import { getAllSocialLinks } from "@/features/social-links/queries";
import { getRecentSettingsAuditLogs } from "@/features/site/audit-queries";
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
import { updateWhyChoose, updateHowToOrder } from "@/features/site/actions";

export const metadata = {
  title: "Pengaturan — Admin Yumm!",
};

const VALID_TABS = [
  "store",
  "hero",
  "why",
  "how",
  "whatsapp",
  "social",
  "footer",
  "homepage",
  "security",
  "audit",
];

interface SettingsPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function AdminSettingsPage({
  searchParams,
}: SettingsPageProps) {
  const params = await searchParams;
  const tab =
    params.tab && VALID_TABS.includes(params.tab) ? params.tab : "store";

  const [settings, socialLinks] = await Promise.all([
    getSiteSettings(),
    getAllSocialLinks(),
  ]);

  const auditLogs = tab === "audit" ? await getRecentSettingsAuditLogs(30) : [];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          Pengaturan
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Atur konten yang tampil di halaman depan dan pengaturan keamanan.
        </p>
      </header>

      <SettingsTabs current={tab} />

      <div>
        {tab === "store" && <StoreInfoForm initial={settings.storeInfo} />}
        {tab === "hero" && <HeroForm initial={settings.hero} />}
        {tab === "why" && (
          <RepeaterForm
            action={updateWhyChoose}
            initialItems={settings.whyChoose}
            sectionTitle="Kenapa Pilih Yumm"
            description="Tiga sampai enam alasan singkat kenapa pelanggan harus pilih Yumm."
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
        {tab === "whatsapp" && <WhatsappForm initial={settings.whatsapp} />}
        {tab === "social" && <SocialLinksForm initial={socialLinks} />}
        {tab === "footer" && <FooterForm initial={settings.footer} />}
        {tab === "homepage" && (
          <HomepageConfigForm initial={settings.homepageConfig} />
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
  );
}