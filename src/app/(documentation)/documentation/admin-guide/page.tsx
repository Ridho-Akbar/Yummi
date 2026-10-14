import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bell,
  BarChart3,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  HelpCircle,
  LogIn,
  Package,
  Receipt,
  Settings,
  Shield,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";

export const metadata = {
  title: "Panduan Admin — Yumm!",
  description:
    "Panduan penggunaan dashboard admin Yumm! untuk operasional harian.",
};

// ============================================
// DATA
// ============================================

const QUICK_LINKS = [
  { href: "#login", label: "Login", Icon: LogIn },
  { href: "#dashboard", label: "Dashboard", Icon: BarChart3 },
  { href: "#orders", label: "Kelola Pesanan", Icon: ClipboardList },
  { href: "#payments", label: "Kelola Pembayaran", Icon: Wallet },
  { href: "#products", label: "Kelola Produk", Icon: Package },
  { href: "#schedule", label: "Kelola Jadwal", Icon: CalendarDays },
  { href: "#users", label: "Kelola Pengguna", Icon: Users },
  { href: "#content", label: "Kelola Konten", Icon: Sparkles },
  { href: "#reminders", label: "Pengingat", Icon: Bell },
  { href: "#faq", label: "FAQ", Icon: HelpCircle },
];

const FAQS = [
  {
    q: "Bagaimana kalau pelanggan salah memasukkan data?",
    a: "Buka detail pesanan, klik Edit pesanan, ubah yang perlu diubah, lalu Simpan. Kalau status masih pending, kamu bisa ubah apapun termasuk daftar produk. Kalau sudah dikonfirmasi, hanya data pelanggan (nama, HP, alamat, catatan, tanggal) yang bisa diubah.",
  },
  {
    q: "Bagaimana kalau pelanggan mau batalkan pesanan?",
    a: "Buka detail pesanan, ubah status ke Dibatalkan. Kapasitas otomatis dilepas dan bisa dipakai pelanggan lain untuk tanggal yang sama.",
  },
  {
    q: "Bagaimana kalau saya salah hapus pesanan?",
    a: "Pesanan yang dihapus sebenarnya disimpan di database (soft delete). Hubungi developer untuk memulihkannya. Ke depannya, konfirmasi dulu sebelum menghapus.",
  },
  {
    q: "Kenapa pesanan tidak bisa dikonfirmasi?",
    a: "Kemungkinan kapasitas produk sudah penuh untuk tanggal itu. Baca pesan error, lalu naikkan kapasitas produk atau diskusikan tanggal lain dengan pelanggan.",
  },
  {
    q: "Kapan saya harus mengubah kapasitas produk?",
    a: "Kalau kamu sanggup membuat lebih banyak untuk tanggal tertentu, atau sebaliknya mengurangi produksi. Kapasitas ini fleksibel, bisa diubah kapan saja sesuai kemampuan dapur.",
  },
  {
    q: "Apakah pelanggan bisa melihat nomor HP pelanggan lain?",
    a: "Tidak. Di kalender publik, pelanggan hanya melihat nama pemesan. Nomor HP dan alamat hanya terlihat oleh admin di dashboard.",
  },
];

// ============================================
// PAGE
// ============================================

export default function AdminGuidePage() {
  return (
    <div className="min-h-dvh bg-surface">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-neutral-100 bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="font-display text-2xl font-bold text-yumm-pink"
          >
            Yumm!
          </Link>
          <Link
            href="/documentation/features"
            className="inline-flex items-center gap-1.5 rounded-yumm px-4 py-2 font-display text-sm font-semibold text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            Fitur
          </Link>
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
            Panduan ini menjelaskan cara menggunakan dashboard Yumm! untuk
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
          <GuideSection
            id="login"
            Icon={LogIn}
            title="Login"
            description="Cara masuk ke dashboard admin."
          >
            <ol className="space-y-2 text-sm text-ink-muted">
              <Step number={1}>
                Buka website Yumm! di browser.
              </Step>
              <Step number={2}>
                Klik tombol <strong>Masuk</strong> di pojok kanan atas.
              </Step>
              <Step number={3}>
                Pilih akun Google yang sudah terdaftar sebagai admin.
              </Step>
              <Step number={4}>
                Setelah login, klik avatar di pojok kanan atas, lalu pilih{" "}
                <strong>Dashboard Admin</strong>.
              </Step>
            </ol>
            <InfoBox tone="info">
              Kalau setelah login kamu tidak melihat menu{" "}
              <strong>Dashboard Admin</strong>, berarti akun Googlemu bukan
              admin. Hubungi superadmin untuk didaftarkan.
            </InfoBox>
          </GuideSection>

          {/* DASHBOARD */}
          <GuideSection
            id="dashboard"
            Icon={BarChart3}
            title="Dashboard"
            description="Ringkasan bisnis dan hal-hal yang butuh perhatian hari ini."
          >
            <p className="text-sm text-ink-muted">
              Dashboard menampilkan empat bagian utama dari atas ke bawah:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-ink-muted">
              <ListItem>
                <strong>Empat kartu statistik.</strong> Total pesanan, yang
                menunggu konfirmasi, yang sudah dikonfirmasi, dan yang masuk
                hari ini.
              </ListItem>
              <ListItem>
                <strong>Pesanan Hari Ini.</strong> Daftar pesanan yang
                acaranya hari ini. Ini yang paling butuh perhatianmu. Klik
                salah satu kartu untuk buka detailnya.
              </ListItem>
              <ListItem>
                <strong>Produk yang Hampir Limit.</strong> Produk yang
                kapasitasnya sudah terisi 80% atau lebih untuk tanggal
                tertentu. Klik "Lihat detail" untuk melihat daftar lengkap.
                Kalau perlu naikkan kapasitas, klik tombol Edit di produk itu.
              </ListItem>
              <ListItem>
                <strong>Pendapatan Bulan Ini.</strong> Total pendapatan dari
                pesanan yang sudah dikonfirmasi atau selesai, plus
                perbandingan dengan bulan lalu.
              </ListItem>
            </ul>
          </GuideSection>

          {/* ORDERS */}
          <GuideSection
            id="orders"
            Icon={ClipboardList}
            title="Kelola Pesanan"
            description="Semua pesanan masuk, dari pending sampai selesai."
          >
            <SubHeading>Melihat Pesanan</SubHeading>
            <p className="text-sm text-ink-muted">
              Ada dua cara melihat pesanan:
            </p>
            <ul className="mt-2 space-y-2 text-sm text-ink-muted">
              <ListItem>
                <strong>Kalender.</strong> Melihat sebaran pesanan per
                tanggal. Setiap tanggal yang ada pesanannya diberi badge
                angka. Klik tanggal untuk lihat detail pesanan hari itu.
              </ListItem>
              <ListItem>
                <strong>Daftar.</strong> Tabel semua pesanan dengan
                pencarian dan filter. Cocok untuk mencari pesanan tertentu
                atau melihat semua sekaligus.
              </ListItem>
            </ul>

            <SubHeading>Mencari Pesanan</SubHeading>
            <p className="text-sm text-ink-muted">
              Di tampilan Daftar, gunakan kolom pencarian untuk cari
              berdasarkan:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-ink-muted">
              <Bullet>Kode pesanan (misal: <code className="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-[11px]">YUM-202610-0042</code>)</Bullet>
              <Bullet>Nama pelanggan</Bullet>
              <Bullet>Nomor HP</Bullet>
              <Bullet>Alamat</Bullet>
            </ul>
            <p className="mt-3 text-sm text-ink-muted">
              Bisa juga difilter berdasarkan status, tanggal, dan status
              pembayaran.
            </p>

            <SubHeading>Mengubah Status Pesanan</SubHeading>
            <p className="text-sm text-ink-muted">
              Buka detail pesanan, lihat panel kanan. Ada empat status:
            </p>
            <StatusList />
            <InfoBox tone="warning">
              Kamu tidak bisa mengkonfirmasi pesanan kalau kapasitas produk
              untuk tanggal itu sudah penuh. Kalau muncul pesan error,
              naikkan kapasitas produk dulu, atau diskusikan tanggal lain
              dengan pelanggan.
            </InfoBox>

            <SubHeading>Menghubungi Pelanggan</SubHeading>
            <p className="text-sm text-ink-muted">
              Di halaman detail pesanan ada tombol{" "}
              <strong>Chat WhatsApp</strong> di kanan atas. Klik untuk
              langsung buka WhatsApp dengan nomor pelanggan — tidak perlu
              copy manual.
            </p>

            <SubHeading>Mengedit Pesanan</SubHeading>
            <p className="text-sm text-ink-muted">
              Kalau ada yang salah input, klik{" "}
              <strong>Edit pesanan</strong> di panel kanan. Aturannya:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-ink-muted">
              <Bullet>
                Status <strong>pending</strong> — bisa ubah semua, termasuk
                daftar produk
              </Bullet>
              <Bullet>
                Status <strong>dikonfirmasi</strong> atau{" "}
                <strong>selesai</strong> — hanya bisa ubah nama, HP, alamat,
                catatan, dan tanggal. Daftar produk terkunci
              </Bullet>
            </ul>

            <SubHeading>Menghapus Pesanan</SubHeading>
            <p className="text-sm text-ink-muted">
              Klik <strong>Hapus pesanan</strong> di panel kanan. Pesanan
              akan hilang dari daftar tapi datanya tetap tersimpan di
              sistem. Kalau salah hapus, hubungi developer.
            </p>
          </GuideSection>

          {/* PAYMENTS */}
          <GuideSection
            id="payments"
            Icon={Wallet}
            title="Kelola Pembayaran"
            description="Catat DP, sisa bayar, dan pelunasan."
          >
            <p className="text-sm text-ink-muted">
              Setiap pesanan punya status pembayaran sendiri. Ada tiga
              status:
            </p>
            <div className="mt-3 space-y-2">
              <div className="rounded-yumm border border-neutral-100 bg-surface-muted/50 p-3">
                <p className="text-sm font-semibold text-yumm-coral">
                  Belum bayar
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  Pelanggan belum bayar sama sekali.
                </p>
              </div>
              <div className="rounded-yumm border border-neutral-100 bg-surface-muted/50 p-3">
                <p className="text-sm font-semibold text-ink">
                  DP (uang muka)
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  Sudah bayar sebagian. Sistem otomatis menghitung sisa yang
                  harus ditagih.
                </p>
              </div>
              <div className="rounded-yumm border border-neutral-100 bg-surface-muted/50 p-3">
                <p className="text-sm font-semibold text-emerald-700">
                  Lunas
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  Sudah dibayar penuh.
                </p>
              </div>
            </div>

            <SubHeading>Cara Mengubah Status Pembayaran</SubHeading>
            <ol className="space-y-2 text-sm text-ink-muted">
              <Step number={1}>
                Buka detail pesanan.
              </Step>
              <Step number={2}>
                Di panel kanan, klik <strong>Ubah status pembayaran</strong>{" "}
                di bagian Pembayaran.
              </Step>
              <Step number={3}>
                Pilih status baru: Belum bayar, DP, atau Lunas.
              </Step>
              <Step number={4}>
                Kalau pilih DP, isi nominal yang diterima. Ada tombol preset
                untuk nominal umum: Rp50rb, Rp100rb, Rp200rb.
              </Step>
              <Step number={5}>
                Klik Simpan.
              </Step>
            </ol>

            <InfoBox tone="info">
              Tips: Kalau kamu ketik <code className="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-[11px]">300</code>{" "}
              di kolom nominal lalu klik di luar kolom, otomatis berubah
              jadi <code className="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-[11px]">300000</code>.
              Jadi bisa ngetik cepat tanpa nol banyak.
            </InfoBox>
          </GuideSection>

          {/* PRODUCTS */}
          <GuideSection
            id="products"
            Icon={Package}
            title="Kelola Produk"
            description="Tambah, edit, dan atur katalog makanan."
          >
            <SubHeading>Menambah Produk Baru</SubHeading>
            <ol className="space-y-2 text-sm text-ink-muted">
              <Step number={1}>
                Buka menu <strong>Produk</strong>.
              </Step>
              <Step number={2}>
                Klik tombol <strong>+ Tambah produk</strong>.
              </Step>
              <Step number={3}>
                Isi form: nama, deskripsi, harga, stok, kapasitas.
              </Step>
              <Step number={4}>
                Upload gambar produk (JPG, PNG, atau WebP, maksimal 5 MB).
              </Step>
              <Step number={5}>
                Klik <strong>Tambah</strong>.
              </Step>
            </ol>

            <SubHeading>Field Penting</SubHeading>
            <ul className="mt-2 space-y-2 text-sm text-ink-muted">
              <ListItem>
                <strong>Harga.</strong> Ketik angkanya saja. Kalau kamu ketik{" "}
                <code className="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-[11px]">25</code>{" "}
                otomatis jadi Rp25.000.
              </ListItem>
              <ListItem>
                <strong>Kapasitas per hari.</strong> Berapa banyak produk ini
                yang bisa kamu buat per hari. Sistem akan menolak pesanan
                kalau sudah penuh.
              </ListItem>
              <ListItem>
                <strong>Minimum order.</strong> Jumlah minimal per pesanan.
                Isi 1 kalau tidak ada minimum.
              </ListItem>
              <ListItem>
                <strong>Tampilkan produk.</strong> Centang untuk membuat
                produk muncul di form pesanan pelanggan.
              </ListItem>
            </ul>

            <SubHeading>Restock Cepat</SubHeading>
            <p className="text-sm text-ink-muted">
              Di tabel produk, setiap baris punya tombol pintas untuk ubah
              stok: <strong>−10</strong>, <strong>−1</strong>,{" "}
              <strong>+1</strong>, <strong>+10</strong>, dan{" "}
              <strong>0</strong>. Klik tombol langsung, tidak perlu buka
              form edit.
            </p>

            <SubHeading>Menyembunyikan Produk</SubHeading>
            <p className="text-sm text-ink-muted">
              Kalau produk habis atau mau dijeda sementara, buka Edit dan
              hilangkan centang "Tampilkan produk di form pesanan". Produk
              tetap ada di dashboard, tapi pelanggan tidak bisa memesan.
            </p>
          </GuideSection>

          {/* SCHEDULE */}
          <GuideSection
            id="schedule"
            Icon={CalendarDays}
            title="Kelola Jadwal"
            description="Atur tanggal mana yang buka atau tutup."
          >
            <SubHeading>Menandai Satu Tanggal</SubHeading>
            <ol className="space-y-2 text-sm text-ink-muted">
              <Step number={1}>
                Buka menu <strong>Jadwal</strong>.
              </Step>
              <Step number={2}>
                Klik tanggal di kalender.
              </Step>
              <Step number={3}>
                Pilih <strong>Tersedia</strong> atau{" "}
                <strong>Tidak tersedia</strong>.
              </Step>
              <Step number={4}>
                Isi catatan kalau perlu (misal "Libur nasional").
              </Step>
              <Step number={5}>
                Klik Simpan.
              </Step>
            </ol>

            <SubHeading>Menutup Rentang Tanggal Panjang</SubHeading>
            <p className="text-sm text-ink-muted">
              Untuk libur panjang (Lebaran, Natal, dll):
            </p>
            <ol className="mt-2 space-y-2 text-sm text-ink-muted">
              <Step number={1}>
                Di halaman Jadwal, klik{" "}
                <strong>Atur rentang tanggal</strong>.
              </Step>
              <Step number={2}>
                Isi tanggal mulai dan akhir.
              </Step>
              <Step number={3}>
                Pilih <strong>Tutup</strong> atau <strong>Buka</strong>.
              </Step>
              <Step number={4}>
                Kalau ada tanggal yang sudah punya jadwal khusus, akan muncul
                layar konfirmasi. Pilih <strong>Hanya isi yang kosong</strong>{" "}
                atau <strong>Timpa semua</strong>.
              </Step>
            </ol>

            <InfoBox tone="info">
              Tanggal yang ditandai "Tidak tersedia" akan muncul abu-abu di
              kalender publik. Pelanggan tidak bisa pesan untuk tanggal itu.
            </InfoBox>
          </GuideSection>

          {/* USERS */}
          <GuideSection
            id="users"
            Icon={Users}
            title="Kelola Pengguna"
            description="Siapa saja yang bisa masuk ke dashboard."
          >
            <p className="text-sm text-ink-muted">
              Ada tiga tingkat akses di Yumm!:
            </p>

            <div className="mt-3 space-y-2">
              <div className="rounded-yumm border border-yumm-coral/30 bg-yumm-coral/5 p-3">
                <p className="text-sm font-semibold text-yumm-coral">
                  Superadmin
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  Akses tertinggi. Bisa menaikkan user jadi admin, dan
                  menurunkan admin jadi user. Hanya bisa dibuat lewat
                  database — hubungi developer.
                </p>
              </div>
              <div className="rounded-yumm border border-yumm-lilac/30 bg-yumm-lilac/5 p-3">
                <p className="text-sm font-semibold text-yumm-lilac">Admin</p>
                <p className="mt-1 text-xs text-ink-muted">
                  Bisa akses dashboard, kelola pesanan, produk, jadwal, dan
                  konten. Bisa menaikkan user biasa jadi admin.
                </p>
              </div>
              <div className="rounded-yumm border border-neutral-200 bg-neutral-50 p-3">
                <p className="text-sm font-semibold text-ink-muted">User</p>
                <p className="mt-1 text-xs text-ink-muted">
                  Pelanggan yang login lewat Google. Bisa pesan tanpa perlu
                  sandi akses. Tidak bisa akses dashboard.
                </p>
              </div>
            </div>

            <SubHeading>Menaikkan User Jadi Admin</SubHeading>
            <ol className="space-y-2 text-sm text-ink-muted">
              <Step number={1}>
                Buka menu <strong>Pengguna</strong>.
              </Step>
              <Step number={2}>
                Cari user yang ingin dijadikan admin.
              </Step>
              <Step number={3}>
                Klik tombol <strong>Jadikan admin</strong>.
              </Step>
              <Step number={4}>
                Role langsung berubah. User tersebut sekarang bisa akses
                dashboard.
              </Step>
            </ol>

            <InfoBox tone="warning">
              Hati-hati menaikkan admin. Admin punya akses ke semua data
              pelanggan. Hanya berikan ke orang yang kamu percaya.
            </InfoBox>
          </GuideSection>

          {/* CONTENT */}
          <GuideSection
            id="content"
            Icon={Sparkles}
            title="Kelola Konten Halaman Depan"
            description="Ubah tampilan website tanpa bantuan developer."
          >
            <p className="text-sm text-ink-muted">
              Semua yang tampil di halaman depan bisa kamu atur dari menu{" "}
              <strong>Pengaturan</strong>. Ada beberapa tab:
            </p>

            <div className="mt-3 space-y-2 text-sm">
              <div className="rounded-yumm border border-neutral-100 p-3">
                <p className="font-semibold text-ink">Info Toko</p>
                <p className="mt-1 text-xs text-ink-muted">
                  Nama toko, alamat, HP, email, dan jam operasional. Muncul
                  di footer.
                </p>
              </div>
              <div className="rounded-yumm border border-neutral-100 p-3">
                <p className="font-semibold text-ink">Hero</p>
                <p className="mt-1 text-xs text-ink-muted">
                  Tagline utama dan subjudul di bagian paling atas halaman.
                </p>
              </div>
              <div className="rounded-yumm border border-neutral-100 p-3">
                <p className="font-semibold text-ink">Kenapa Pilih</p>
                <p className="mt-1 text-xs text-ink-muted">
                  Tiga alasan kenapa pelanggan harus pilih Yumm!. Bisa diubah
                  atau ditambah sampai 6.
                </p>
              </div>
              <div className="rounded-yumm border border-neutral-100 p-3">
                <p className="font-semibold text-ink">Cara Pesan</p>
                <p className="mt-1 text-xs text-ink-muted">
                  Langkah-langkah pemesanan. Maksimal 6 langkah.
                </p>
              </div>
              <div className="rounded-yumm border border-neutral-100 p-3">
                <p className="font-semibold text-ink">WhatsApp</p>
                <p className="mt-1 text-xs text-ink-muted">
                  URL WhatsApp untuk tombol mengambang di pojok kanan bawah
                  halaman depan.
                </p>
              </div>
              <div className="rounded-yumm border border-neutral-100 p-3">
                <p className="font-semibold text-ink">Sosial Media</p>
                <p className="mt-1 text-xs text-ink-muted">
                  Link Instagram, TikTok, Facebook, dll. Muncul di footer
                  sebagai ikon.
                </p>
              </div>
              <div className="rounded-yumm border border-neutral-100 p-3">
                <p className="font-semibold text-ink">Footer</p>
                <p className="mt-1 text-xs text-ink-muted">
                  Tagline di bawah logo dan copyright di bagian paling bawah.
                </p>
              </div>
              <div className="rounded-yumm border border-neutral-100 p-3">
                <p className="font-semibold text-ink">Homepage</p>
                <p className="mt-1 text-xs text-ink-muted">
                  Jumlah produk yang tampil per kategori di section Produk
                  Unggulan.
                </p>
              </div>
              <div className="rounded-yumm border border-yumm-coral/30 bg-yumm-coral/5 p-3">
                <p className="font-semibold text-yumm-coral">Keamanan</p>
                <p className="mt-1 text-xs text-ink-muted">
                  Sandi akses untuk pelanggan anonim. Kalau sandi bocor ke
                  orang iseng, ubah di sini. Pelanggan yang butuh sandi baru
                  tinggal dikirim ulang.
                </p>
              </div>
            </div>

            <SubHeading>Produk Unggulan</SubHeading>
            <p className="text-sm text-ink-muted">
              Ada halaman khusus di menu <strong>Produk Unggulan</strong>{" "}
              untuk memilih produk mana yang tampil di homepage. Setiap
              kategori (Terbaru, Best Seller, Terlaris) bisa diisi manual.
              Kalau dikosongkan, sistem pilih otomatis.
            </p>
          </GuideSection>

          {/* REMINDERS */}
          <GuideSection
            id="reminders"
            Icon={Bell}
            title="Pengingat"
            description="Notifikasi otomatis berdasarkan tanggal acara."
          >
            <p className="text-sm text-ink-muted">
              Sistem otomatis mengelompokkan pesanan ke dalam empat kategori:
            </p>

            <div className="mt-3 space-y-2">
              <div className="rounded-yumm border-l-4 border-yumm-coral bg-white p-3">
                <p className="text-sm font-semibold text-yumm-coral">
                  Sudah lewat
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  Pesanan yang tanggalnya sudah terlewat tapi belum selesai
                  atau belum lunas. Ini yang paling urgent.
                </p>
              </div>
              <div className="rounded-yumm border-l-4 border-yumm-pink bg-white p-3">
                <p className="text-sm font-semibold text-yumm-pink">
                  Hari ini
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  Pesanan yang acaranya hari ini. Cek pagi-pagi.
                </p>
              </div>
              <div className="rounded-yumm border-l-4 border-yumm-lilac bg-white p-3">
                <p className="text-sm font-semibold text-yumm-lilac">Besok</p>
                <p className="mt-1 text-xs text-ink-muted">
                  Pesanan yang acaranya besok. Konfirmasi ulang ke pelanggan.
                </p>
              </div>
              <div className="rounded-yumm border-l-4 border-neutral-300 bg-white p-3">
                <p className="text-sm font-semibold text-ink-muted">
                  2 hari lagi
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  Persiapan awal. Pastikan bahan dan jadwal produksi sudah
                  siap.
                </p>
              </div>
            </div>

            <SubHeading>Tips</SubHeading>
            <ul className="space-y-1 text-sm text-ink-muted">
              <Bullet>
                Buka halaman <strong>Pengingat</strong> setiap pagi sebelum
                mulai kerja.
              </Bullet>
              <Bullet>
                Fokus ke kategori "Hari ini" dulu, baru "Sudah lewat", baru
                yang lain.
              </Bullet>
              <Bullet>
                Pengingat otomatis refresh tiap tengah malam — tidak perlu
                hapus manual.
              </Bullet>
            </ul>
          </GuideSection>

          {/* FAQ */}
          <GuideSection
            id="faq"
            Icon={HelpCircle}
            title="Pertanyaan Umum"
            description="Hal-hal yang sering ditanyakan admin baru."
          >
            <div className="space-y-4">
              {FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-yumm border border-neutral-100 bg-surface-muted/30 p-4"
                >
                  <p className="font-display text-sm font-bold text-ink">
                    {faq.q}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </GuideSection>
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-yumm-lg border border-yumm-lemon/40 bg-yumm-lemon/10 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={22}
              strokeWidth={2.2}
              className="mt-0.5 shrink-0 text-yumm-coral"
            />
            <div>
              <p className="font-display text-base font-bold text-ink">
                Butuh bantuan teknis?
              </p>
              <p className="mt-2 text-sm text-ink-muted">
                Panduan ini mencakup operasional harian. Untuk hal-hal
                teknis seperti setup, perubahan database, atau pemulihan
                data, lihat{" "}
                <Link
                  href="/documentation/developer"
                  className="font-semibold text-yumm-pink underline-offset-4 hover:underline"
                >
                  Panduan Developer
                </Link>
                .
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
            <ArrowLeft size={14} strokeWidth={2.5} />
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

      <footer className="mt-12 border-t border-neutral-100 bg-white px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <Link
            href="/"
            className="font-display text-2xl font-bold text-yumm-pink"
          >
            Yumm!
          </Link>
          <p className="mt-2 text-xs text-ink-muted">
            &copy; {new Date().getFullYear()} Yumm! All rights reserved.
          </p>
        </div>
      </footer>
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

function GuideSection({
  id,
  Icon,
  title,
  description,
  children,
}: GuideSectionProps) {
  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-yumm-lg border border-neutral-100 bg-white p-6 shadow-sm sm:p-8"
    >
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

function Step({
  number,
  children,
}: {
  number: number;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yumm-pink text-[11px] font-bold text-white">
        {number}
      </span>
      <span className="flex-1 pt-0.5">{children}</span>
    </li>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-yumm-pink" />
      <span>{children}</span>
    </li>
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <CheckCircle2
        size={16}
        strokeWidth={2.5}
        className="mt-0.5 shrink-0 text-yumm-pink"
      />
      <span className="flex-1">{children}</span>
    </li>
  );
}

function InfoBox({
  tone,
  children,
}: {
  tone: "info" | "warning";
  children: React.ReactNode;
}) {
  const styles =
    tone === "warning"
      ? "border-yumm-lemon/50 bg-yumm-lemon/10"
      : "border-yumm-lilac/30 bg-yumm-lilac/5";

  return (
    <div className={`rounded-yumm border px-4 py-3 text-sm ${styles}`}>
      <div className="flex gap-2">
        <AlertCircle
          size={16}
          strokeWidth={2.2}
          className="mt-0.5 shrink-0 text-ink-muted"
        />
        <div className="flex-1 text-ink">{children}</div>
      </div>
    </div>
  );
}

function StatusList() {
  const statuses = [
    {
      label: "Pending",
      color: "bg-yumm-coral/15 text-yumm-coral",
      desc: "Pesanan baru masuk, belum dihubungi pelanggan.",
    },
    {
      label: "Dikonfirmasi",
      color: "bg-yumm-lilac/15 text-yumm-lilac",
      desc: "Sudah dihubungi, tanggal dan detail sudah fix.",
    },
    {
      label: "Selesai",
      color: "bg-yumm-mint/30 text-emerald-700",
      desc: "Pesanan sudah dikirim atau diambil pelanggan.",
    },
    {
      label: "Dibatalkan",
      color: "bg-neutral-200 text-ink-muted",
      desc: "Batal dari salah satu pihak.",
    },
  ];

  return (
    <ul className="mt-3 space-y-2">
      {statuses.map((s) => (
        <li key={s.label} className="flex items-start gap-3 text-sm">
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.color}`}
          >
            {s.label}
          </span>
          <span className="pt-0.5 text-ink-muted">{s.desc}</span>
        </li>
      ))}
    </ul>
  );
}
