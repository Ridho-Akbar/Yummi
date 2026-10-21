# Yumm!

Website pre-order makanan viral. Pelanggan memesan untuk tanggal acara tertentu. Admin mengelola pesanan, produk, jadwal, pembayaran, dan laporan dari satu dashboard.

**Dokumentasi lengkap:** buka halaman berikut saat aplikasi berjalan.

- [`/documentation/features`](http://localhost:3000/documentation/features) — daftar fitur untuk calon pengguna
- [`/documentation/admin-guide`](http://localhost:3000/documentation/admin-guide) — panduan penggunaan dashboard untuk admin non-teknis
- [`/documentation/developer`](http://localhost:3000/documentation/developer) — panduan setup, query SQL penting, dan cara recovery

## Tech Stack

| Komponen | Versi | Peran |
|---|---|---|
| Next.js | 16.3.8 (App Router, Turbopack) | Framework utama |
| React | 19.2.8 | UI library |
| TypeScript | 5.x (strict) | Bahasa utama |
| Tailwind CSS | 4.x | Styling, theme tokens di CSS |
| Supabase | — | Postgres + Auth + Storage + RLS |
| Google OAuth | via Supabase | Login |
| lucide-react | terbaru | Ikon |
| Telegram Bot API | — | Notifikasi real-time |
| bcryptjs | — | Hash sandi order |
| Zod | — | Validasi input |
| pnpm | 10+ | Package manager |

**Runtime minimum:** Node.js 20.19+

## Mulai Cepat

```bash
pnpm install
cp .env.example .env.local   # lalu isi nilainya
pnpm dev
```

Setup database lengkap, environment variables, dan Google OAuth dijelaskan di halaman `/documentation/developer` setelah aplikasi berjalan. Semua query SQL penting tersedia di sana sebagai blok yang bisa dibuka-tutup.

## Standar Development

Standar ini berlaku untuk semua kontribusi. Konsistensi lebih penting daripada preferensi pribadi.

### Struktur Folder

```text
src/
├── app/                    # Routes (App Router)
│   ├── (documentation)/    # Halaman dokumentasi (mudah dihapus)
│   ├── admin/              # Dashboard admin
│   ├── order/              # Form pesanan
│   └── ...
├── components/             # Komponen presentasional
│   ├── ui/                 # Komponen dasar (Button, Pagination)
│   ├── admin/              # Komponen khusus admin
│   ├── home/               # Komponen halaman depan
│   └── documentation/      # Komponen dokumentasi
├── features/               # Logic per domain
│   ├── orders/
│   │   ├── schema.ts       # Validasi Zod
│   │   ├── queries.ts      # Fungsi baca data
│   │   ├── actions.ts      # Server Action mutasi
│   │   └── types.ts        # Tipe domain
│   └── ...
├── lib/                    # Helper lintas fitur
│   ├── supabase/           # Client (browser, server, admin)
│   ├── auth.ts             # getCurrentUser, requireAdmin
│   ├── password.ts         # bcrypt helper
│   └── utils.ts            # cn()
├── types/                  # Tipe global + generated Supabase
└── proxy.ts                # Refresh session Supabase
```

### Aturan File dan Penamaan

- Satu file, satu tanggung jawab. Maksimal 200 baris. Kalau lebih, pecah.
- Nama file dan folder: bahasa Inggris, lowercase. Contoh: `order-form.tsx`, bukan `form-pesanan.tsx`.
- Nama komponen: PascalCase. Contoh: `OrderForm`, `ProductModal`.
- Nama file komponen: sama dengan nama komponen. Contoh: `OrderForm.tsx`.
- Nama fungsi: camelCase, kata kerja di depan. Contoh: `getAvailableProducts`, `updateOrderStatus`.
- Nama variabel: camelCase, deskriptif. Hindari singkatan yang tidak jelas.
- Teks yang dilihat user: bahasa Indonesia. Contoh: `"Pesan Sekarang"`, `"Belum dikonfirmasi"`.
- Kode, komentar, dan commit message: bahasa Inggris.

### Server Component vs Client Component

- Default: Server Component. Tidak ada `"use client"` di atas file.
- Tambahkan `"use client"` hanya kalau butuh:
  - State (`useState`, `useReducer`)
  - Effect (`useEffect`)
  - Event handler (`onClick`, `onChange`)
  - API browser (`window`, `localStorage`, `navigator`)
- Letakkan batas client sedalam mungkin. Kalau hanya satu tombol butuh interaktif, jadikan tombol itu Client Component, bukan seluruh halaman.

### Layering

- Query data → `features/*/queries.ts`. Selalu import `"server-only"` di atas file.
- Mutasi data → `features/*/actions.ts`. File diawali `"use server"`.
- Validasi → `features/*/schema.ts`. Pakai Zod.
- Tipe domain → `features/*/types.ts`.
- Komponen presentasional → `components/`. Tidak ada query atau Server Action di dalamnya.
- Helper generik → `lib/`. Hanya kalau dipakai lintas fitur.

### Server Action dan Keamanan

- Setiap Server Action admin wajib panggil `requireAdmin()`. Jangan hanya andalkan cek role di layout.
- Validasi input dengan Zod sebelum eksekusi. Jangan percaya data dari client.
- Ambil `user.id` dari session, bukan dari input form. Cegah spoofing.
- Untuk query yang butuh bypass RLS, pakai `createAdminClient()`. Hanya di server, tidak pernah di Client Component.

### Komponen Client

- Form dengan validasi server pakai controlled inputs (`value` + `onChange`), bukan `defaultValue`. Mencegah data hilang saat submit gagal.
- Modal dengan notifikasi pakai pola `mountKey`. Wrapper yang urus buka/tutup, form di-render dengan `key` yang berubah setiap buka. Mencegah notif lama muncul lagi.
- Loader/tombol submit pakai `useFormStatus`. Jangan buat state loading manual.

### Styling

- Tailwind utility-first. Jangan buat kelas CSS baru kecuali terpaksa.
- Token warna, radius, font didefinisikan di `@theme` dalam `globals.css`. Jangan hardcode hex/rgb di className.
- Nama token berdasarkan fungsi, bukan nilai. Contoh: `--color-surface`, bukan `--color-gray-100`.
- Urutan kelas Tailwind:
  1. Layout (`display`, `position`, `z-index`, `overflow`)
  2. Flex dan grid
  3. Gap
  4. Sizing
  5. Spacing (`padding`, `margin`)
  6. Typography
  7. Warna
  8. Border dan radius
  9. Efek (`shadow`, `opacity`, `transition`)
  10. State (`hover`, `focus`, `active`, `disabled`)
  11. Responsive prefix (`sm`, `md`, `lg`, `xl`, `2xl`)

### Ikon

- Selalu pakai `lucide-react`.
- Pakai konstanta `ICON_SIZE` dari `@/lib/icons`. Jangan hardcode angka.
  - `sm` = 16 px
  - `md` = 18 px
  - `lg` = 20 px
- Ikon brand (Instagram, TikTok, Facebook, dll) tidak ada di lucide. Pakai SVG inline yang ada di `components/home/SocialIcon.tsx`.

### Komentar

- Komentar hanya untuk hal yang tidak jelas dari kode: alasan keputusan, batasan, jebakan.
- Jangan komentari hal yang sudah jelas.
- Tulis komentar dalam bahasa Inggris.

### Git

- Commit message: bahasa Inggris, mood imperatif.
  - `add order edit modal`, bukan `added order edit modal`
  - `fix payment status calculation`
  - `refactor sidebar to use lucide icons`
- Satu commit satu perubahan logis. Kalau menyentuh tiga fitur berbeda, pecah jadi tiga commit.
- Jangan commit `.env.local`. Sudah ada di `.gitignore`.

## Environment Variables

| Variabel | Kegunaan | Eksposur |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL proyek Supabase | Publik |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Anon key untuk client | Publik |
| `SUPABASE_SERVICE_ROLE_KEY` | Bypass RLS, hanya server | Server |
| `IP_HASH_SALT` | Salt untuk hash IP rate limit | Server |
| `NEXT_PUBLIC_SITE_URL` | Base URL untuk link notifikasi | Publik |
| `TELEGRAM_BOT_TOKEN` | Token bot Telegram | Server |
| `TELEGRAM_CHAT_ID` | Chat ID tujuan notifikasi | Server |

Jangan pernah memberi prefix `NEXT_PUBLIC_` pada variabel yang berisi rahasia.

## Daftar Halaman Utama

| URL | Deskripsi | Akses |
|---|---|---|
| `/` | Beranda dengan 8 section + kalender | Publik |
| `/order` | Form pesanan | Publik |
| `/order/success` | Konfirmasi pesanan | Publik |
| `/login` | Login Google | Publik |
| `/terms` | Ketentuan layanan | Publik |
| `/documentation/features` | Fitur produk | Publik |
| `/documentation/admin-guide` | Panduan admin | Publik |
| `/documentation/developer` | Panduan developer | Publik |
| `/admin` | Dashboard admin | Admin |
| `/admin/orders` | Kelola pesanan | Admin |
| `/admin/products` | Kelola produk | Admin |
| `/admin/schedule` | Kelola jadwal | Admin |
| `/admin/reports` | Laporan | Admin |
| `/admin/users` | Kelola pengguna | Admin |
| `/admin/reminders` | Pengingat otomatis | Admin |
| `/admin/homepage` | Produk unggulan | Admin |
| `/admin/faqs` | Kelola FAQ | Admin |
| `/admin/settings` | Pengaturan konten | Admin |

## Lisensi

Proyek privat. Tidak untuk didistribusikan tanpa izin.