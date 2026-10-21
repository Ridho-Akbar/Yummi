import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  BarChart3,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  HelpCircle,
  LogIn,
  Package,
  Sparkles,
  Users,
  Wallet,
  ShoppingBag,
} from "lucide-react";
import { getSiteSettings } from "@/features/site/queries";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: `Panduan Admin — ${settings.storeInfo.name}`,
    description: `Panduan penggunaan dashboard admin ${settings.storeInfo.name} untuk operasional harian.`,
  };
}

const QUICK_LINKS = [
  { href: "#login", label: "Login", Icon: LogIn },
  { href: "#dashboard", label: "Dashboard", Icon: BarChart3 },
  { href: "#orders", label: "Kelola Pesanan", Icon: ClipboardList },
  { href: "#payments", label: "Pembayaran", Icon: Wallet },
  { href: "#products", label: "Produk & Stok", Icon: Package },
  { href: "#menu", label: "Menu Hari Ini", Icon: ShoppingBag },
  { href: "#schedule", label: "Jadwal", Icon: CalendarDays },
  { href: "#content", label: "Konten & Carousel", Icon: Sparkles },
  { href: "#users", label: "Pengguna", Icon: Users },
  { href: "#reminders", label: "Pengingat", Icon: Bell },
  { href: "#faq", label: "FAQ", Icon: HelpCircle },
];

const FAQS = [
  {
    q: "Apa bedanya 'Menu Hari Ini' dengan 'Pesan Pre-Order'?",
    a: "Menu Hari Ini adalah produk yang sudah jadi dan siap diantar (Ready Stock) pada hari itu juga. Pre-Order adalah pesanan untuk tanggal acara di masa depan, di mana kamu punya waktu untuk memproduksinya sesuai kapasitas harian (Max Pre-Order).",
  },
  {
    q: "Bagaimana kalau pelanggan salah memasukkan data?",
    a: "Buka detail pesanan, klik Edit pesanan, ubah yang perlu diubah, lalu Simpan. Kalau status masih pending, kamu bisa ubah apapun termasuk daftar produk. Kalau sudah dikonfirmasi, hanya data pelanggan yang bisa diubah.",
  },
  {
    q: "Bagaimana kalau pelanggan mau batalkan pesanan?",
    a: "Buka detail pesanan, ubah status ke Dibatalkan. Kapasitas otomatis dilepas dan bisa dipakai pelanggan lain untuk tanggal yang sama.",
  },
  {
    q: "Kenapa pesanan tidak bisa dikonfirmasi?",
    a: "Kemungkinan kapasitas produk sudah penuh untuk tanggal itu. Baca pesan error, lalu naikkan 'Max Pre-Order' di menu Produk, atau diskusikan tanggal lain dengan pelanggan.",
  },
  {
    q: "Bagaimana cara mengubah gambar promo di halaman Menu?",
    a: "Buka menu Pengaturan > Carousel Menu. Di sana kamu bisa mengunggah gambar baru dan sistem akan otomatis memotongnya (crop) dengan rasio 21:9 yang pas untuk banner.",
  },
];

export default async function AdminGuidePage() {
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
              className="rounded-full px-3 py-2 text-sm font-semibold text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink sm:px-4"
            >
              Fitur
            </Link>
            <Link
              href="/documentation/admin-guide"
              className="rounded-full bg-yumm-pink/10 px-3 py-2 text-sm font-semibold text-yumm-pink sm:px-4"
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

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        {/* HERO */}
        <div className="mb-10">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-yumm-pink">
            Untuk Admin
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
            Panduan Penggunaan Dashboard
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            Panduan ini menjelaskan cara menggunakan dashboard {settings.storeInfo.name} untuk
            operasional harian. Tidak ada istilah teknis — kalau kamu bisa
            pakai WhatsApp dan Instagram, kamu bisa pakai panduan ini.
          </p>
        </div>

        {/* QUICK LINKS */}
        <nav className="mb-12 rounded-yumm-lg border border-neutral-100 bg-white p-4 shadow-sm">
          <p className="mb-3 font-display text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Langsung ke bagian
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-3.5 py-1.5 font-display text-xs font-semibold text-ink-muted transition-colors hover:bg-yumm-pink hover:text-white"
              >
                <link.Icon size={12} strokeWidth={2.5} />
                {link.label}
              </a>
            ))}
          </div>
        </nav>

        {/* SECTIONS */}
        <div className="space-y-6">
          {/* LOGIN */}
          <GuideSection id="login" Icon={LogIn} title="Login" description="Cara masuk ke dashboard admin.">
            <ol className="space-y-2 text-sm text-ink-muted">
              <Step number={1}>Buka website {settings.storeInfo.name} di browser.</Step>
              <Step number={2}>Klik tombol <strong>Masuk</strong> di pojok kanan atas.</Step>
              <Step number={3}>Pilih akun Google yang sudah terdaftar sebagai admin.</Step>
              <Step number={4}>Setelah login, klik avatar di pojok kanan atas, lalu pilih <strong>Dashboard Admin</strong>.</Step>
            </ol>
            <InfoBox tone="info">
              Kalau setelah login kamu tidak melihat menu <strong>Dashboard Admin</strong>, berarti akun Googlemu bukan admin. Hubungi superadmin untuk didaftarkan.
            </InfoBox>
          </GuideSection>

          {/* DASHBOARD */}
          <GuideSection id="dashboard" Icon={BarChart3} title="Dashboard" description="Ringkasan bisnis dan hal-hal yang butuh perhatian hari ini.">
            <ul className="space-y-2 text-sm text-ink-muted">
              <ListItem><strong>Empat kartu statistik.</strong> Total pesanan, menunggu konfirmasi, sudah dikonfirmasi, dan masuk hari ini.</ListItem>
              <ListItem><strong>Pesanan Hari Ini.</strong> Daftar pesanan yang acaranya hari ini. Ini yang paling butuh perhatianmu.</ListItem>
              <ListItem><strong>Produk yang Hampir Limit.</strong> Produk yang kapasitas pre-order-nya sudah terisi 80% atau lebih.</ListItem>
              <ListItem><strong>Pendapatan Bulan Ini.</strong> Total pendapatan dari pesanan yang sudah dikonfirmasi atau selesai.</ListItem>
            </ul>
          </GuideSection>

          {/* ORDERS */}
          <GuideSection id="orders" Icon={ClipboardList} title="Kelola Pesanan" description="Semua pesanan masuk, dari pending sampai selesai.">
            <SubHeading>Melihat & Mencari Pesanan</SubHeading>
            <p className="text-sm text-ink-muted">
              Ada dua tampilan: <strong>Kalender</strong> (melihat sebaran per tanggal) dan <strong>Daftar</strong> (mencari pesanan spesifik berdasarkan nama, HP, atau kode pesanan).
            </p>
            <SubHeading>Mengubah Status Pesanan</SubHeading>
            <p className="text-sm text-ink-muted">Ada empat status:</p>
            <StatusList />
            <InfoBox tone="warning">
              Kamu tidak bisa mengkonfirmasi pesanan kalau kapasitas produk untuk tanggal itu sudah penuh.
            </InfoBox>
            <SubHeading>Mengedit & Menghapus Pesanan</SubHeading>
            <p className="text-sm text-ink-muted">
              Buka detail pesanan dan klik <strong>Edit pesanan</strong>. Jika status masih <strong>pending</strong>, kamu bisa ubah semua termasuk produk. Jika sudah dikonfirmasi, hanya data pelanggan yang bisa diubah. Untuk menghapus, klik <strong>Hapus pesanan</strong> (data tetap tersimpan di sistem).
            </p>
          </GuideSection>

          {/* PAYMENTS */}
          <GuideSection id="payments" Icon={Wallet} title="Kelola Pembayaran" description="Catat DP, sisa bayar, dan pelunasan.">
            <p className="text-sm text-ink-muted">
              Ada tiga status pembayaran: <strong>Belum bayar</strong>, <strong>DP (uang muka)</strong>, dan <strong>Lunas</strong>.
            </p>
            <SubHeading>Cara Mengubah Status Pembayaran</SubHeading>
            <ol className="space-y-2 text-sm text-ink-muted">
              <Step number={1}>Buka detail pesanan.</Step>
              <Step number={2}>Di panel kanan, klik <strong>Ubah status pembayaran</strong>.</Step>
              <Step number={3}>Pilih status baru. Jika memilih DP, isi nominal yang diterima (ada preset Rp50rb, Rp100rb, Rp200rb).</Step>
              <Step number={4}>Klik Simpan.</Step>
            </ol>
            <InfoBox tone="info">
              Tips: Kalau kamu ketik <code>300</code> di kolom nominal lalu klik di luar kolom, otomatis berubah jadi <code>300000</code>.
            </InfoBox>
          </GuideSection>

          {/* PRODUCTS & STOCK (FITUR BARU) */}
          <GuideSection id="products" Icon={Package} title="Kelola Produk & Stok" description="Atur katalog makanan, harga, dan ketersediaan.">
            <p className="text-sm text-ink-muted">
              Di halaman Produk, kamu bisa mengatur dua jenis stok:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-ink-muted">
              <ListItem><strong>Stok Jadi (Ready Stock):</strong> Produk yang sudah matang dan siap diantar hari ini. Ini yang tampil di halaman Menu Hari Ini.</ListItem>
              <ListItem><strong>Max Pre-Order:</strong> Kapasitas maksimal produk yang bisa kamu buat per hari. Ini yang membatasi pelanggan yang pesan untuk tanggal masa depan.</ListItem>
            </ul>

            <SubHeading>Restock Cepat</SubHeading>
            <p className="text-sm text-ink-muted">
              Kamu tidak perlu buka form Edit untuk menambah stok. Di tabel produk, ada tombol pintas <strong>[−] [Angka] [+]</strong>. Klik <strong>+</strong> atau <strong>-</strong> untuk menambah/mengurangi, atau klik angka di tengahnya untuk mengetik nominal stok secara manual.
            </p>
          </GuideSection>

          {/* MENU HARI INI (FITUR BARU) */}
          <GuideSection id="menu" Icon={ShoppingBag} title="Halaman Menu Hari Ini" description="Bagaimana pelanggan memesan makanan ready stock.">
            <p className="text-sm text-ink-muted">
              Halaman <strong>Menu Hari Ini</strong> adalah katalog khusus untuk makanan yang siap diantar pada hari tersebut.
            </p>
            <ul className="mt-3 space-y-2 text-sm text-ink-muted">
              <ListItem>Pelanggan bisa memfilter menu berdasarkan kategori <strong>Ready</strong>, <strong>Paling Murah</strong>, atau <strong>Habis</strong>.</ListItem>
              <ListItem>Jika stok jadi <strong>0</strong>, produk otomatis diberi label "HABIS" dan tidak bisa ditambahkan ke keranjang.</ListItem>
              <ListItem>Pelanggan bisa memasukkan beberapa produk ke <strong>Keranjang Mengambang</strong> di bagian bawah layar, lalu langsung diarahkan ke form pembayaran dengan tanggal hari ini.</ListItem>
            </ul>
          </GuideSection>

          {/* SCHEDULE */}
          <GuideSection id="schedule" Icon={CalendarDays} title="Kelola Jadwal" description="Atur tanggal mana yang buka atau tutup.">
            <SubHeading>Menandai Tanggal</SubHeading>
            <p className="text-sm text-ink-muted">
              Buka menu <strong>Jadwal</strong>, klik tanggal di kalender, lalu pilih <strong>Tersedia</strong> atau <strong>Tidak tersedia</strong>. Kamu juga bisa mengisi catatan (misal "Libur nasional").
            </p>
            <SubHeading>Menutup Rentang Panjang</SubHeading>
            <p className="text-sm text-ink-muted">
              Klik <strong>Atur rentang tanggal</strong> di kanan atas untuk menutup libur panjang (Lebaran, Natal, dll). Jika ada jadwal yang bertabrakan, sistem akan meminta konfirmasi untuk menimpanya.
            </p>
          </GuideSection>

          {/* USERS */}
          <GuideSection id="users" Icon={Users} title="Kelola Pengguna" description="Siapa saja yang bisa masuk ke dashboard.">
            <p className="text-sm text-ink-muted">
              Ada tiga tingkat akses di {settings.storeInfo.name}:
            </p>
            <div className="mt-3 space-y-2">
              <div className="rounded-yumm border border-yumm-coral/30 bg-yumm-coral/5 p-3">
                <p className="text-sm font-semibold text-yumm-coral">Superadmin</p>
                <p className="mt-1 text-xs text-ink-muted">Akses tertinggi. Bisa menaikkan user jadi admin, dan menurunkan admin jadi user.</p>
              </div>
              <div className="rounded-yumm border border-yumm-lilac/30 bg-yumm-lilac/5 p-3">
                <p className="text-sm font-semibold text-yumm-lilac">Admin</p>
                <p className="mt-1 text-xs text-ink-muted">Bisa akses dashboard, kelola pesanan, produk, dan konten.</p>
              </div>
              <div className="rounded-yumm border border-neutral-200 bg-neutral-50 p-3">
                <p className="text-sm font-semibold text-ink-muted">User</p>
                <p className="mt-1 text-xs text-ink-muted">Pelanggan yang login lewat Google. Bisa pesan tanpa sandi akses.</p>
              </div>
            </div>
            <InfoBox tone="warning">
              Hati-hati menaikkan admin. Admin punya akses ke semua data pelanggan. Hanya berikan ke orang yang kamu percaya.
            </InfoBox>
          </GuideSection>

          {/* CONTENT */}
          <GuideSection id="content" Icon={Sparkles} title="Konten & Carousel" description="Ubah tampilan website tanpa bantuan developer.">
            <p className="text-sm text-ink-muted">
              Semua konten halaman depan bisa diatur dari menu <strong>Pengaturan</strong>.
            </p>
            <ul className="mt-3 space-y-2 text-sm text-ink-muted">
              <ListItem><strong>Teks & Info:</strong> Ubah Nama Toko, Tagline (Hero), Alasan Kenapa Pilih, dan link Sosial Media.</ListItem>
              <ListItem><strong>Pin Produk:</strong> Pilih produk spesifik yang ingin ditonjolkan di halaman depan (Terbaru, Best Seller, Terlaris).</ListItem>
              <ListItem><strong>Carousel Menu:</strong> Atur gambar banner promosi yang muncul di halaman Menu. Gambar otomatis dipotong (crop) dengan rasio 21:9.</ListItem>
              <ListItem><strong>FAQ:</strong> Tambah atau ubah daftar pertanyaan umum pelanggan.</ListItem>
            </ul>
          </GuideSection>

          {/* REMINDERS */}
          <GuideSection id="reminders" Icon={Bell} title="Pengingat" description="Notifikasi otomatis berdasarkan tanggal acara.">
            <p className="text-sm text-ink-muted">
              Sistem otomatis mengelompokkan pesanan ke dalam empat kategori:
            </p>
            <div className="mt-3 space-y-2">
              <div className="rounded-yumm border-l-4 border-yumm-coral bg-white p-3">
                <p className="text-sm font-semibold text-yumm-coral">Sudah lewat</p>
                <p className="mt-1 text-xs text-ink-muted">Pesanan yang tanggalnya sudah terlewat tapi belum selesai atau belum lunas.</p>
              </div>
              <div className="rounded-yumm border-l-4 border-yumm-pink bg-white p-3">
                <p className="text-sm font-semibold text-yumm-pink">Hari ini</p>
                <p className="mt-1 text-xs text-ink-muted">Pesanan yang acaranya hari ini. Cek pagi-pagi.</p>
              </div>
              <div className="rounded-yumm border-l-4 border-yumm-lilac bg-white p-3">
                <p className="text-sm font-semibold text-yumm-lilac">Besok</p>
                <p className="mt-1 text-xs text-ink-muted">Pesanan yang acaranya besok. Konfirmasi ulang ke pelanggan.</p>
              </div>
              <div className="rounded-yumm border-l-4 border-neutral-300 bg-white p-3">
                <p className="text-sm font-semibold text-ink-muted">2 hari lagi</p>
                <p className="mt-1 text-xs text-ink-muted">Persiapan awal. Pastikan bahan dan jadwal produksi sudah siap.</p>
              </div>
            </div>
          </GuideSection>

          {/* FAQ */}
          <GuideSection id="faq" Icon={HelpCircle} title="Pertanyaan Umum" description="Hal-hal yang sering ditanyakan admin baru.">
            <div className="space-y-4">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="rounded-yumm border border-neutral-100 bg-surface-muted/30 p-4">
                  <p className="font-display text-sm font-bold text-ink">{faq.q}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{faq.a}</p>
                </div>
              ))}
            </div>
          </GuideSection>
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-yumm-lg border border-yumm-lemon/40 bg-yumm-lemon/10 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle size={22} strokeWidth={2.2} className="mt-0.5 shrink-0 text-yumm-coral" />
            <div>
              <p className="font-display text-base font-bold text-ink">Butuh bantuan teknis?</p>
              <p className="mt-2 text-sm text-ink-muted">
                Panduan ini mencakup operasional harian. Untuk hal-hal teknis seperti setup, perubahan database, atau pemulihan data, lihat{" "}
                <Link href="/documentation/developer" className="font-semibold text-yumm-pink underline-offset-4 hover:underline">
                  Panduan Developer
                </Link>.
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER NAV */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/documentation/features"
            className="inline-flex items-center gap-2 rounded-full border-2 border-yumm-pink/30 bg-white px-5 py-2.5 font-display text-sm font-semibold text-yumm-pink transition-all hover:-translate-y-0.5 hover:border-yumm-pink"
          >
            Lihat Fitur
          </Link>
          <Link
            href="/documentation/developer"
            className="inline-flex items-center gap-2 rounded-full bg-yumm-pink px-5 py-2.5 font-display text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-yumm-coral"
          >
            Panduan Developer
            <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
      </main>
    </div>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================

interface GuideSectionProps {
  id: string;
  Icon: typeof LogIn;
  title: string;
  description: string;
  children: React.ReactNode;
}

function GuideSection({ id, Icon, title, description, children }: GuideSectionProps) {
  return (
    <section id={id} className="scroll-mt-24 rounded-yumm-lg border border-neutral-100 bg-white p-6 shadow-sm sm:p-8">
      <header className="mb-5 flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yumm-pink/10">
          <Icon size={22} strokeWidth={2.2} className="text-yumm-pink" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl font-bold text-ink">{title}</h2>
          <p className="mt-1 text-sm text-ink-muted">{description}</p>
        </div>
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-6 border-t border-neutral-100 pt-5 font-display text-sm font-bold uppercase tracking-wide text-ink first:mt-0 first:border-0 first:pt-0">
      {children}
    </h3>
  );
}

function Step({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yumm-pink text-[11px] font-bold text-white">
        {number}
      </span>
      <span className="flex-1 pt-0.5">{children}</span>
    </li>
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <CheckCircle2 size={16} strokeWidth={2.5} className="mt-0.5 shrink-0 text-yumm-pink" />
      <span className="flex-1">{children}</span>
    </li>
  );
}

function InfoBox({ tone, children }: { tone: "info" | "warning"; children: React.ReactNode }) {
  const styles = tone === "warning" ? "border-yumm-lemon/50 bg-yumm-lemon/10" : "border-yumm-lilac/30 bg-yumm-lilac/5";
  return (
    <div className={`rounded-yumm border px-4 py-3 text-sm ${styles}`}>
      <div className="flex gap-2">
        <AlertCircle size={16} strokeWidth={2.2} className="mt-0.5 shrink-0 text-ink-muted" />
        <div className="flex-1 text-ink">{children}</div>
      </div>
    </div>
  );
}

function StatusList() {
  const statuses = [
    { label: "Pending", color: "bg-yumm-coral/15 text-yumm-coral", desc: "Pesanan baru masuk, belum dihubungi pelanggan." },
    { label: "Dikonfirmasi", color: "bg-yumm-lilac/15 text-yumm-lilac", desc: "Sudah dihubungi, tanggal dan detail sudah fix." },
    { label: "Selesai", color: "bg-yumm-mint/30 text-emerald-700", desc: "Pesanan sudah dikirim atau diambil pelanggan." },
    { label: "Dibatalkan", color: "bg-neutral-200 text-ink-muted", desc: "Batal dari salah satu pihak." },
  ];

  return (
    <ul className="mt-3 space-y-2">
      {statuses.map((s) => (
        <li key={s.label} className="flex items-start gap-3 text-sm">
          <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.color}`}>
            {s.label}
          </span>
          <span className="pt-0.5 text-ink-muted">{s.desc}</span>
        </li>
      ))}
    </ul>
  );
}