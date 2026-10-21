import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Package,
  Receipt,
  Settings,
  Shield,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { getSiteSettings } from "@/features/site/queries";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: `Fitur — ${settings.storeInfo.name}`,
    description: `Fitur lengkap ${settings.storeInfo.name} untuk bisnis makanan pre-order.`,
  };
}

// ============================================
// DATA
// ============================================

const CUSTOMER_POINTS = [
  {
    Icon: CalendarDays,
    title: "Kalender Ketersediaan",
    desc: "Pelanggan langsung lihat tanggal mana yang masih kosong untuk pre-order, tanpa perlu tanya lewat chat.",
  },
  {
    Icon: ShoppingCart,
    title: "Menu Hari Ini (Ready)",
    desc: "Katalog khusus makanan siap antar hari ini. Lengkap dengan filter, badge, dan info stok real-time.",
  },
  {
    Icon: Receipt,
    title: "Keranjang & Kode Unik",
    desc: "Pelanggan bisa memasukkan banyak produk ke keranjang melayang, lalu dapat kode pesanan seperti YUM-202610-0042.",
  },
  {
    Icon: Bell,
    title: "Pesan Tanpa Daftar",
    desc: "Login Google opsional. Pelanggan bisa pesan anonim lebih cepat menggunakan sandi akses dari admin.",
  },
];

const ADMIN_GROUPS = [
  {
    Icon: ClipboardList,
    groupTitle: "Kelola Pesanan",
    groupDesc:
      "Semua pesanan dalam satu tempat — dari masuk sampai selesai. Tampilan kalender untuk lihat sebaran tanggal, tampilan daftar untuk cari dan filter.",
    items: [
      "Cari berdasarkan kode, nama, HP, atau alamat",
      "Filter berdasarkan waktu, status, dan pembayaran",
      "Ubah status dalam satu klik dengan validasi kapasitas",
      "Chat WhatsApp langsung dari halaman detail",
      "Riwayat perubahan status untuk audit",
    ],
    screenshot: {
      src: "/documentation/07-admin-orders-list.png",
      alt: "Daftar pesanan admin dengan filter",
      caption: "Tampilan daftar dengan pencarian dan tiga filter aktif",
    },
  },
  {
    Icon: Package,
    groupTitle: "Kelola Produk & Stok",
    groupDesc:
      "Atur katalog makanan, harga, dan ketersediaan. Kamu bisa mengatur Stok Jadi (Ready) dan Kapasitas Pre-Order secara terpisah.",
    items: [
      "Upload gambar produk langsung dari dashboard",
      "Restock cepat dengan tombol pintas (+) dan (-)",
      "Atur minimum order per produk",
      "Sembunyikan produk dari form pesanan kalau habis",
    ],
    screenshot: {
      src: "/documentation/09-admin-products.png",
      alt: "Manajemen produk admin",
      caption: "Manajemen produk dengan gambar dan tombol restock cepat",
    },
  },
  {
    Icon: Wallet,
    groupTitle: "Kelola Pembayaran",
    groupDesc:
      "Catat DP, sisa bayar, dan pelunasan tanpa buku catatan manual. Sistem otomatis hitung sisa yang perlu ditagih.",
    items: [
      "Tandai pesanan: belum bayar, DP, atau lunas",
      "Preset nominal cepat: Rp50rb, Rp100rb, Rp200rb",
      "Sisa tagihan dihitung otomatis",
    ],
    screenshot: {
      src: "/documentation/08-admin-order-detail.png",
      alt: "Detail pesanan dengan panel pembayaran",
      caption: "Detail pesanan: status, timeline, dan panel pembayaran",
    },
  },
  {
    Icon: CalendarClock,
    groupTitle: "Kelola Jadwal & Kapasitas",
    groupDesc:
      "Kontrol tanggal mana yang buka dan berapa kapasitas produksi setiap hari. Sistem tolak pesanan kalau sudah penuh.",
    items: [
      "Tandai tanggal libur atau tutup",
      "Bulk action untuk tutup rentang tanggal panjang",
      "Auto-deteksi produk yang hampir limit",
    ],
    screenshot: {
      src: "/documentation/10-admin-schedule.png",
      alt: "Kalender jadwal admin",
      caption: "Kalender jadwal dengan bulk action untuk rentang panjang",
    },
  },
];

const MONITOR_GROUPS = [
  {
    Icon: BarChart3,
    title: "Laporan dan Analisa",
    desc: "Lihat bagaimana bisnis berkembang dalam satu tampilan: grafik pendapatan 12 bulan, produk terlaris, dan pelanggan setia.",
    screenshot: {
      src: "/documentation/11-admin-reports.png",
      alt: "Halaman laporan admin",
      caption: "Grafik pendapatan, produk terlaris, dan pelanggan teratas",
    },
  },
  {
    Icon: Bell,
    title: "Pengingat Otomatis",
    desc: "Sistem otomatis kelompokkan pesanan ke H-2, H-1, hari H, dan yang sudah lewat. Admin tidak akan lupa pesanan penting.",
    screenshot: {
      src: "/documentation/12-admin-reminders.png",
      alt: "Halaman pengingat",
      caption: "Pengingat otomatis dengan prioritas hari ini di paling atas",
    },
  },
  {
    Icon: Settings,
    title: "Konten Fleksibel",
    desc: "Ubah tagline, hero, produk unggulan, gambar carousel menu, dan FAQ kapan saja — tanpa perlu kontak developer.",
    screenshot: {
      src: "/documentation/13-admin-settings.png",
      alt: "Halaman pengaturan admin",
      caption: "Pengaturan terpusat untuk semua konten halaman depan dan menu",
    },
  },
];

const HIGHLIGHT_FEATURES = [
  {
    Icon: CalendarClock,
    title: "Pengingat Otomatis",
    desc: "Sistem otomatis memberi tahu admin tanggal mana yang butuh perhatian — H-2, H-1, hari H, bahkan yang sudah lewat.",
    color: "yumm-pink" as const,
  },
  {
    Icon: Shield,
    title: "Superadmin Terpisah",
    desc: "Akses admin dan superadmin dipisah. Hanya superadmin yang bisa menurunkan admin. Mencegah satu kesalahan menghapus akses seluruh tim.",
    color: "yumm-lilac" as const,
  },
  {
    Icon: TrendingUp,
    title: "Kapasitas Terkontrol",
    desc: "Sistem menolak konfirmasi pesanan kalau kapasitas produksi di tanggal itu sudah penuh. Tidak akan kelebihan pesanan.",
    color: "yumm-mint" as const,
  },
];

// ============================================
// PAGE
// ============================================

export default async function FeaturesPage() {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-dvh bg-surface">
      {/* HEADER SERAGAM */}
      <header className="sticky top-0 z-30 border-b border-neutral-100 bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="max-w-[150px] truncate font-display text-2xl font-bold text-yumm-pink sm:max-w-[200px]"
            title={settings.storeInfo.name}
          >
            {settings.storeInfo.name}
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/documentation/features"
              className="rounded-full bg-yumm-pink/10 px-3 py-2 text-sm font-semibold text-yumm-pink sm:px-4"
            >
              Fitur
            </Link>
            <Link
              href="/documentation/admin-guide"
              className="rounded-full px-3 py-2 text-sm font-semibold text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink sm:px-4"
            >
              Panduan Admin
            </Link>
            <Link
              href="/documentation/developer"
              className="rounded-full px-3 py-2 text-sm font-semibold text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink sm:px-4"
            >
              Developer
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-yumm-pink">
              Fitur {settings.storeInfo.name}
            </p>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Semua yang kamu butuhkan untuk jualan pre-order & ready stock
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
              {settings.storeInfo.name} dibuat khusus untuk bisnis makanan yang menerima pesanan
              untuk tanggal acara maupun pesanan siap antar hari ini. Pelanggan pesan online, 
              kamu kelola semuanya dari satu dashboard — tanpa perlu buka kode.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/menu"
                className="group inline-flex items-center gap-2 rounded-full bg-yumm-pink px-6 py-3 font-display text-sm font-semibold text-white shadow-lg shadow-yumm-pink/25 transition-all hover:-translate-y-0.5 hover:bg-yumm-coral"
              >
                Coba menu hari ini
                <ArrowRight
                  size={16}
                  strokeWidth={2.5}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href="/documentation/developer"
                className="inline-flex items-center gap-2 rounded-full border-2 border-yumm-pink/30 bg-white px-6 py-3 font-display text-sm font-semibold text-yumm-pink transition-all hover:-translate-y-0.5 hover:border-yumm-pink"
              >
                Panduan setup
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-4xl">
            <Screenshot
              src="/documentation/01-homepage.png"
              alt="Beranda dengan kalender pesanan"
              caption="Beranda dengan hero, kalender ketersediaan, dan produk unggulan"
              priority
            />
          </div>
        </section>

        {/* PENGALAMAN PELANGGAN */}
        <section className="bg-surface-muted px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 max-w-2xl">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-yumm-pink">
                Pengalaman Pelanggan
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
                Yang pelangganmu lihat saat pesan
              </h2>
              <p className="mt-3 text-sm text-ink-muted sm:text-base">
                Halaman pemesanan yang dirancang agar mudah dipakai — bahkan
                tanpa login. Pelanggan langsung tahu apa yang bisa dipesan
                dan kapan.
              </p>
            </div>

            <div className="mb-10 grid gap-3 sm:grid-cols-2">
              {CUSTOMER_POINTS.map((point) => (
                <div
                  key={point.title}
                  className="flex items-start gap-3 rounded-yumm-lg border border-neutral-100 bg-white p-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yumm-pink/10">
                    <point.Icon
                      size={16}
                      strokeWidth={2.5}
                      className="text-yumm-pink"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-bold text-ink">
                      {point.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                      {point.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Screenshots Menu & Keranjang */}
            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              <Screenshot
                src="/documentation/14-menu-page.png"
                alt="Halaman menu hari ini"
                caption="Halaman Menu Hari Ini dengan filter dan badge produk"
              />
              <Screenshot
                src="/documentation/15-floating-cart.png"
                alt="Keranjang mengambang di mobile"
                caption="Keranjang melayang untuk checkout cepat"
                device="mobile"
              />
            </div>
          </div>
        </section>

        {/* DASHBOARD ADMIN */}
        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 max-w-2xl">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-yumm-pink">
                Dashboard Admin
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
                Yang bisa kamu kelola sendiri
              </h2>
              <p className="mt-3 text-sm text-ink-muted sm:text-base">
                Semua operasional harian ada di satu dashboard. Dari kelola
                pesanan sampai ubah tampilan website — tanpa perlu kontak
                developer.
              </p>
            </div>

            <div className="mb-10">
              <Screenshot
                src="/documentation/05-admin-dashboard.png"
                alt="Dashboard admin"
                caption="Dashboard dengan statistik, pesanan hari ini, dan produk yang hampir limit"
              />
            </div>

            <div className="space-y-12">
              {ADMIN_GROUPS.map((group) => (
                <AdminGroupCard key={group.groupTitle} group={group} />
              ))}
            </div>
          </div>
        </section>

        {/* MONITORING */}
        <section className="bg-surface-muted px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 max-w-2xl">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-yumm-pink">
                Monitoring & Kontrol
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
                Laporan, pengingat, dan pengaturan
              </h2>
              <p className="mt-3 text-sm text-ink-muted sm:text-base">
                Pantau bagaimana bisnis berkembang, dan ubah konten website
                kapan saja tanpa kontak developer.
              </p>
            </div>

            <div className="space-y-12">
              {MONITOR_GROUPS.map((group) => (
                <MonitorGroupCard key={group.title} group={group} />
              ))}
            </div>
          </div>
        </section>

        {/* FITUR UNGGULAN */}
        <section className="bg-gradient-to-br from-yumm-pink/5 via-yumm-lilac/5 to-yumm-mint/5 px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 max-w-2xl">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-yumm-pink">
                Yang Membedakan
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
                Fitur unggulan {settings.storeInfo.name}
              </h2>
              <p className="mt-3 text-sm text-ink-muted sm:text-base">
                Tiga hal yang membuat {settings.storeInfo.name} lebih dari sekadar website biasa.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {HIGHLIGHT_FEATURES.map((feature) => (
                <HighlightCard key={feature.title} feature={feature} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-yumm-pink to-yumm-lilac px-4 py-16 text-center text-white sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Siap coba?
            </h2>
            <p className="mt-3 text-sm text-white/90 sm:text-base">
              Buat pesanan percobaan dan lihat sendiri bagaimana {settings.storeInfo.name}
              bekerja dari sisi pelanggan dan admin.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/menu"
                className="rounded-full bg-white px-6 py-3 font-display text-sm font-semibold text-yumm-pink shadow-lg transition-transform hover:-translate-y-0.5"
              >
                Coba menu
              </Link>
              <Link
                href="/documentation/admin-guide"
                className="rounded-full border-2 border-white/50 px-6 py-3 font-display text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
              >
                Panduan admin
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-neutral-100 bg-white px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-5xl text-center">
          <Link
            href="/"
            className="font-display text-2xl font-bold text-yumm-pink"
          >
            {settings.storeInfo.name}
          </Link>
          <p className="mt-2 text-sm text-ink-muted">
            Platform pre-order & ready stock makanan viral untuk bisnis kue dan katering.
          </p>
          <p className="mt-4 text-xs text-ink-muted">
            &copy; {new Date().getFullYear()} {settings.storeInfo.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// COMPONENTS
// ============================================

interface ScreenshotProps {
  src: string;
  alt: string;
  caption?: string;
  device?: "desktop" | "mobile";
  priority?: boolean;
}

function Screenshot({
  src,
  alt,
  caption,
  device = "desktop",
  priority,
}: ScreenshotProps) {
  const isMobile = device === "mobile";

  return (
    <figure className={isMobile ? "mx-auto w-full max-w-[260px]" : "w-full"}>
      <div
        className={
          isMobile
            ? "relative aspect-[9/19.5] w-full overflow-hidden rounded-[2rem] border-[6px] border-ink bg-ink shadow-xl"
            : "relative aspect-video w-full overflow-hidden rounded-yumm-lg border border-neutral-200 bg-white shadow-xl"
        }
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={
            isMobile
              ? "(max-width: 768px) 60vw, 260px"
              : "(max-width: 1024px) 100vw, 900px"
          }
          className="object-cover object-top"
          priority={priority}
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-xs leading-relaxed text-ink-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

interface AdminGroupCardProps {
  group: {
    Icon: typeof ClipboardList;
    groupTitle: string;
    groupDesc: string;
    items: string[];
    screenshot: {
      src: string;
      alt: string;
      caption: string;
    };
  };
}

function AdminGroupCard({ group }: AdminGroupCardProps) {
  const { Icon, groupTitle, groupDesc, items, screenshot } = group;

  return (
    <div className="overflow-hidden rounded-yumm-lg border border-neutral-100 bg-white shadow-sm">
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_1.4fr] lg:items-start lg:gap-8">
        <div>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yumm-lilac/15">
              <Icon size={20} strokeWidth={2.2} className="text-yumm-lilac" />
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-lg font-bold text-ink">
                {groupTitle}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                {groupDesc}
              </p>
            </div>
          </div>

          <ul className="mt-5 space-y-2">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <CheckCircle2
                  size={14}
                  strokeWidth={3}
                  className="mt-0.5 shrink-0 text-yumm-pink"
                />
                <span className="text-ink-muted">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <Screenshot
          src={screenshot.src}
          alt={screenshot.alt}
          caption={screenshot.caption}
        />
      </div>
    </div>
  );
}

interface MonitorGroupCardProps {
  group: {
    Icon: typeof BarChart3;
    title: string;
    desc: string;
    screenshot: {
      src: string;
      alt: string;
      caption: string;
    };
  };
}

function MonitorGroupCard({ group }: MonitorGroupCardProps) {
  const { Icon, title, desc, screenshot } = group;

  return (
    <div className="overflow-hidden rounded-yumm-lg border border-neutral-100 bg-white shadow-sm">
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_1.4fr] lg:items-center lg:gap-8">
        <div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yumm-mint/30">
            <Icon size={20} strokeWidth={2.2} className="text-emerald-700" />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-ink">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            {desc}
          </p>
        </div>

        <Screenshot
          src={screenshot.src}
          alt={screenshot.alt}
          caption={screenshot.caption}
        />
      </div>
    </div>
  );
}

interface HighlightCardProps {
  feature: {
    Icon: typeof CalendarClock;
    title: string;
    desc: string;
    color: "yumm-pink" | "yumm-lilac" | "yumm-mint";
  };
}

function HighlightCard({ feature }: HighlightCardProps) {
  const { Icon, title, desc, color } = feature;

  const colorClasses: Record<string, { bg: string; icon: string }> = {
    "yumm-pink": {
      bg: "bg-yumm-pink/10",
      icon: "text-yumm-pink",
    },
    "yumm-lilac": {
      bg: "bg-yumm-lilac/15",
      icon: "text-yumm-lilac",
    },
    "yumm-mint": {
      bg: "bg-yumm-mint/30",
      icon: "text-emerald-700",
    },
  };

  const classes = colorClasses[color];

  return (
    <div className="rounded-yumm-lg border border-neutral-100 bg-white p-6 shadow-sm">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${classes.bg}`}
      >
        <Icon size={24} strokeWidth={2.2} className={classes.icon} />
      </div>
      <h3 className="mt-5 font-display text-lg font-bold text-ink">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{desc}</p>
    </div>
  );
}