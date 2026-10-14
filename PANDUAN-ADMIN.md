# Panduan Admin Yumm!

Panduan ini untuk admin yang mengelola pesanan di Yumm!. Tidak ada istilah teknis di sini. Kalau kamu bisa pakai WhatsApp dan Instagram, kamu bisa pakai panduan ini.

## Daftar Isi

- [Login](#login)
- [Mengenal Dashboard](#mengenal-dashboard)
- [Kelola Pesanan](#kelola-pesanan)
- [Kelola Produk](#kelola-produk)
- [Kelola Jadwal](#kelola-jadwal)
- [Notifikasi Telegram](#notifikasi-telegram)
- [Rutinitas Harian](#rutinitas-harian)
- [Pertanyaan Umum](#pertanyaan-umum)
- [Kalau Ada Masalah](#kalau-ada-masalah)

## Login

1. Buka `https://yummi.vercel.app` (ganti dengan domainmu).
2. Klik tombol **Masuk** di pojok kanan atas.
3. Pilih akun Google yang sudah terdaftar sebagai admin.
4. Setelah login, kamu akan otomatis masuk ke dashboard admin.

Kalau muncul pesan "Akses ditolak" atau kamu dikembalikan ke halaman utama, berarti akun Google yang kamu pakai bukan admin. Hubungi developer untuk didaftarkan.

## Mengenal Dashboard

Setelah login, kamu akan melihat lima menu di sidebar kiri:

| Menu | Isinya |
|---|---|
| **Dasbor** | Ringkasan bisnis: total pesanan, pendapatan bulan ini, stok kritis |
| **Pesanan** | Semua pesanan dalam bentuk kalender atau daftar |
| **Produk** | Daftar produk yang dijual, harga, stok, kapasitas |
| **Jadwal** | Kalender untuk menandai tanggal buka/tutup |
| **Pengguna** | (Segera hadir) |

## Kelola Pesanan

### Melihat Pesanan di Kalender

1. Klik menu **Pesanan**.
2. Kamu akan melihat kalender bulan ini. Tanggal yang ada pesanannya punya angka kecil di pojok kanan atas.
3. Warna tanggal menunjukkan status dominan:
   - **Pink** — ada pesanan yang belum dikonfirmasi
   - **Ungu** — sudah dikonfirmasi
   - **Hijau** — pesanan sudah selesai
   - **Abu-abu** — pesanan dibatalkan
4. Klik tanggal untuk melihat daftar pesanan di hari itu.

### Melihat Pesanan di Daftar

1. Klik menu **Pesanan**, lalu klik tab **Daftar** di kanan atas.
2. Kamu akan melihat semua pesanan dalam bentuk tabel.
3. Gunakan kolom pencarian untuk mencari berdasarkan:
   - Nama pelanggan
   - Nomor HP
   - Alamat
   - Kode pesanan (misal `YUM-202610-0042`)
4. Gunakan filter status di bawah kolom pencarian untuk menyaring: Semua, Pending, Dikonfirmasi, Selesai, Dibatalkan.

**Tips:** Tekan tombol `/` di keyboard untuk langsung fokus ke kolom pencarian. Tekan `Esc` untuk menghapus isi pencarian.

### Membuka Detail Pesanan

Klik **Detail →** pada salah satu pesanan. Kamu akan melihat:

- Kode pesanan (contoh: `YUM-202610-0042`)
- Daftar produk yang dipesan
- Total harga
- Nama, nomor HP, alamat pelanggan
- Catatan dari pelanggan
- Status pesanan saat ini

**Tombol WhatsApp** di kanan atas akan membuka WhatsApp dengan nomor pelanggan. Kamu bisa langsung chat tanpa perlu copy nomor manual.

**Tombol Salin Kode** di bawah kode pesanan untuk salin cepat saat mau dikirim ke pelanggan.

### Mengubah Status Pesanan

Di halaman detail pesanan, ada empat tombol status di panel kanan:

| Status | Kapan Dipakai |
|---|---|
| **Pending** | Pesanan baru masuk, belum dihubungi |
| **Dikonfirmasi** | Sudah dihubungi pelanggan, tanggal dan detail fix |
| **Selesai** | Pesanan sudah dikirim atau diambil pelanggan |
| **Dibatalkan** | Pesanan batal dari kedua pihak |

Klik tombol status untuk mengubah. Perubahan langsung tersimpan dan muncul di notifikasi Telegram.

**Penting:** Kamu tidak bisa konfirmasi pesanan kalau kapasitas produk untuk tanggal itu sudah penuh. Akan muncul pesan error. Kalau ini terjadi, kamu punya tiga pilihan:
1. Tambah kapasitas produk dulu, lalu konfirmasi.
2. Ubah tanggal pesanan (bicara dengan pelanggan dulu).
3. Batalkan pesanan dan minta pelanggan pesan tanggal lain.

### Mengedit Pesanan

Kalau ada kesalahan input (nama salah, alamat kurang lengkap, jumlah salah):

1. Buka detail pesanan.
2. Klik **Edit pesanan**.
3. Ubah yang perlu diubah.
4. Klik **Simpan perubahan**.

**Catatan penting:**
- Kalau status pesanan **pending**, kamu bisa ubah semua termasuk daftar produk.
- Kalau status pesanan sudah **dikonfirmasi**, **selesai**, atau **dibatalkan**, hanya nama/HP/alamat/catatan/tanggal yang bisa diubah. Daftar produk terkunci. Untuk ubah produk, ubah status ke pending dulu.
- Kalau sudah dikonfirmasi dan pelanggan mau ubah jumlah, lebih baik batalkan pesanan lama dan minta pelanggan pesan ulang.

### Menghapus Pesanan

1. Buka detail pesanan.
2. Klik **Hapus pesanan**.
3. Konfirmasi dengan klik **Ya, hapus**.

Pesanan akan hilang dari daftar dan kalender publik, tapi datanya tetap tersimpan di sistem untuk keperluan laporan.

Kalau salah hapus, hubungi developer untuk dipulihkan.

## Kelola Produk

### Melihat Daftar Produk

Klik menu **Produk**. Kamu akan melihat tabel semua produk dengan informasi:

- **Nama dan deskripsi** produk
- **Harga**
- **Stok jadi** — produk yang siap dijual hari ini (bukan untuk pre-order)
- **Kapasitas/hari** — berapa maksimal pesanan pre-order yang bisa diterima per hari
- **Status** — Aktif atau Nonaktif

### Menambah Produk Baru

1. Klik **+ Tambah produk** di kanan atas.
2. Isi form:
   - **Nama produk** (contoh: Kue Tart Cokelat)
   - **Deskripsi** singkat
   - **Harga** — ketik angkanya saja. Kalau kamu ketik `150`, akan otomatis jadi `Rp150.000`. Kalau kamu ketik `150000`, tetap `Rp150.000`.
   - **Stok jadi hari ini** — kalau produk ini bisa langsung dibeli tanpa pre-order
   - **Kapasitas pre-order per hari** — maksimal pesanan yang bisa diterima per hari
   - **Tampilkan produk di form pesanan** — centang kalau produk aktif
3. Klik **Tambah**.

### Mengedit Produk

Klik **Edit** di kolom kanan tabel produk. Ubah yang perlu. Simpan.

### Restock Cepat

Di kolom "Stok jadi", setiap produk punya 5 tombol kecil:

- **−10** — kurangi 10 dari stok jadi
- **−1** — kurangi 1 dari stok jadi
- **+1** — tambah 1 dari stok jadi
- **+10** — tambah 10 dari stok jadi
- **0** — langsung set stok jadi ke 0

Klik tombolnya, stok langsung berubah tanpa perlu buka form edit.

### Menonaktifkan Produk

Kalau produk habis atau tidak mau dijual sementara, buka **Edit**, lalu hapus centang di **Tampilkan produk di form pesanan**. Produk tidak akan muncul di form order pelanggan, tapi tetap ada di daftar admin.

## Kelola Jadwal

Menu **Jadwal** untuk mengatur tanggal mana yang buka atau tutup.

### Menandai Satu Tanggal

1. Buka menu **Jadwal**.
2. Klik tanggal di kalender.
3. Pilih **Tersedia** atau **Tidak tersedia**.
4. Isi catatan kalau perlu (contoh: "Libur nasional").
5. Klik **Simpan**.

**Catatan:**
- Menandai **Tersedia** tanpa catatan berarti tanggal itu kembali ke pengaturan default (boleh pesan). Ini sama dengan tidak ada pengaturan khusus.
- Menandai **Tersedia** dengan catatan berguna untuk info tambahan seperti "Hanya terima pesanan sebelum jam 12".
- Menandai **Tidak tersedia** akan membuat tanggal itu abu-abu di kalender publik. Pelanggan tidak bisa pesan.

### Menandai Banyak Tanggal Sekaligus

Kalau mau tutup libur panjang (misal Lebaran seminggu):

1. Buka menu **Jadwal**.
2. Klik **Atur rentang tanggal** di kanan atas.
3. Isi tanggal mulai dan tanggal akhir.
4. Pilih **Tutup** atau **Buka**.
5. Isi catatan (contoh: "Libur Lebaran").
6. Klik **Terapkan**.

Kalau di rentang itu sudah ada jadwal khusus (misalnya tanggal 20 sudah punya catatan lain), akan muncul layar konfirmasi:

- **Hanya isi N tanggal kosong** — hanya tanggal yang belum ada pengaturan yang akan diubah. Tanggal yang sudah punya catatan tetap.
- **Timpa semua** — semua tanggal di rentang akan diubah, termasuk yang sudah punya catatan.

### Menghapus Jadwal Tanggal

1. Klik tanggal yang sudah ada jadwalnya.
2. Klik **Hapus jadwal**.
3. Konfirmasi dengan **Ya, hapus**.

Tanggal kembali ke pengaturan default.

## Notifikasi Telegram

Setiap ada pesanan baru, kamu akan menerima notifikasi di Telegram secara otomatis. Formatnya seperti ini:

```
🍰 Pesanan Baru Masuk!

Kode: YUM-202610-0042
Nama: Sari Wulandari
HP: 08123456789
Tanggal acara: Selasa, 20 Oktober 2026
Total: Rp550.000

Produk:
  • Kue Tart Cokelat × 1
  • Cupcake Rainbow × 2

Catatan:
Tolong tulis Happy Birthday Sarah

🔗 https://yummi.vercel.app/admin/orders/YUM-202610-0042
```

### Cara Merespons Notifikasi

1. Baca kode pesanan.
2. Klik URL di bawah untuk langsung membuka halaman detail di HP.
3. Atau buka WhatsApp pelanggan dengan klik tombol WhatsApp di halaman detail.
4. Balas pelanggan untuk konfirmasi tanggal dan detail.

### Jenis Notifikasi

| Notifikasi | Bunyi | Kapan |
|---|---|---|
| **Pesanan baru** | Bunyi | Setiap ada pesanan baru |
| **Perubahan status** | Tidak bunyi | Setiap kali kamu ubah status pesanan |

Notifikasi pesanan baru sengaja berbunyi supaya kamu tidak melewatkannya. Perubahan status tidak berbunyi agar tidak mengganggu.

## Rutinitas Harian

### Setiap Pagi

1. **Buka Telegram.** Lihat notifikasi pesanan baru dari semalam.
2. **Buka dashboard** di menu Pesanan.
3. **Klik setiap pesanan pending** di kalender, buka detail, hubungi pelanggan via WhatsApp untuk konfirmasi.
4. **Ubah status** jadi **Dikonfirmasi** setelah pelanggan setuju.
5. **Cek stok produk** di menu Produk. Restock produk yang hampir habis dengan tombol cepat.

### Setiap Siang

1. **Cek pesanan hari ini.** Pastikan tidak ada yang terlewat.
2. **Restock kalau perlu.**

### Setiap Malam

1. **Cek Telegram** untuk pesanan baru setelah jam kerja.
2. **Kalau ada yang urgent** (pesan untuk besok), segera hubungi pelanggan.

### Setiap Minggu

1. **Buka menu Jadwal.** Cek tanggal minggu depan, tandai kalau ada hari libur atau tidak bisa terima pesanan.
2. **Review kapasitas produk.** Kalau ada produk yang sering penuh, naikkan kapasitasnya.

### Setiap Bulan

1. **Lihat pendapatan bulan ini** di dashboard.
2. **Bandingkan dengan bulan lalu** untuk melihat pertumbuhan.
3. **Review produk terlaris** dan pertimbangkan promo.

## Pertanyaan Umum

**Bagaimana kalau pelanggan salah masukin data?**
Buka detail pesanan, klik Edit, ubah yang perlu. Simpan.

**Bagaimana kalau pelanggan mau ubah jumlah pesanan?**
Kalau status masih **pending**, kamu bisa edit langsung. Kalau sudah **dikonfirmasi**, batalkan pesanan lama dan minta pelanggan pesan ulang. Ini penting karena kapasitas sudah terhitung.

**Bagaimana kalau pelanggan mau batalkan pesanan?**
Buka detail, ubah status ke **Dibatalkan**. Kapasitas akan otomatis dilepas dan bisa dipakai pelanggan lain.

**Bagaimana kalau saya salah hapus pesanan?**
Hubungi developer. Data masih ada di sistem dan bisa dipulihkan.

**Apakah pelanggan bisa melihat nomor HP pelanggan lain?**
Tidak. Di kalender publik, pelanggan hanya melihat nama pemesan (tanpa nomor HP atau alamat).

**Bagaimana kalau saya lupa password Google saya?**
Ikuti proses pemulihan akun Google di [accounts.google.com](https://accounts.google.com). Kalau tidak bisa, hubungi developer untuk didaftarkan akun Google lain sebagai admin.

**Bagaimana cara menambah admin kedua?**
Hubungi developer. Karena menambah admin melibatkan pengaturan sistem, tidak bisa dilakukan dari dashboard.

**Apakah ada biaya bulanan?**
Ya, ada beberapa biaya:
- Domain: sekitar Rp150.000 per tahun
- Hosting Vercel: gratis untuk skala kecil, upgrade kalau traffic tinggi
- Database Supabase: gratis untuk skala kecil, upgrade kalau data besar
- Bot Telegram: gratis

Detailnya ada di dokumen serah terima saat pembelian.

## Kalau Ada Masalah

### Notifikasi Telegram tidak masuk

1. Cek koneksi internet.
2. Buka Telegram, cari bot Yumm!, pastikan tidak di-block.
3. Kalau masih tidak masuk, hubungi developer.

### Halaman error saat buka dashboard

1. Refresh halaman (tekan `Ctrl+Shift+R`).
2. Coba logout lalu login lagi.
3. Kalau masih error, screenshot pesan error, kirim ke developer.

### Pesanan tidak muncul di kalender

1. Cek tanggal pesanannya di detail.
2. Kalau tanggalnya bulan lain, geser kalender ke bulan itu.
3. Kalau tetap tidak muncul, hubungi developer.

### Tidak bisa konfirmasi pesanan

Kemungkinan kapasitas tanggal itu sudah penuh. Baca pesan error, tambah kapasitas produk atau ubah tanggal dengan pelanggan.

### Ada yang aneh tapi tidak tahu apa

Screenshot layarnya. Kirim ke developer dengan keterangan singkat apa yang kamu lakukan sebelum masalah muncul.

---

**Kontak developer:**
Nama: Ridho Akbar
Email: ridhoakbar8977@gmail.com
