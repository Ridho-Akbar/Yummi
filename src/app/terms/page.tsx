import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MessageCircle,
  Package,
  RefreshCw,
  Shield,
} from "lucide-react";

export const metadata = {
  title: "Ketentuan Layanan",
  description:
    "Ketentuan pemesanan, kebijakan privasi, dan kebijakan pengembalian dana Yumm!.",
};

const SECTIONS = [
  {
    id: "pemesanan",
    Icon: Calendar,
    title: "Ketentuan Pemesanan",
    items: [
      "Pesanan minimal dilakukan 2 hari sebelum tanggal acara untuk produk standar, dan 7 hari untuk produk custom.",
      "Pesanan akan dikonfirmasi admin melalui WhatsApp dalam 1×24 jam setelah form dikirim.",
      "Tanggal pesanan dapat diubah maksimal 3 hari sebelum tanggal acara, dengan konfirmasi admin.",
      "Yumm! berhak menolak pesanan apabila kapasitas produksi untuk tanggal tersebut sudah penuh.",
      "Detail pesanan (produk, jumlah, alamat) wajib diperiksa ulang sebelum submit. Perubahan setelah konfirmasi dapat dikenakan biaya tambahan.",
    ],
  },
  {
    id: "pembayaran",
    Icon: Package,
    title: "Pembayaran dan Pengembalian Dana",
    items: [
      "Pembayaran dapat dilakukan secara DP (uang muka) atau lunas, sesuai kesepakatan dengan admin.",
      "Pelunasan wajib dilakukan sebelum tanggal pengiriman, kecuali disepakati lain secara tertulis.",
      "Pembatalan oleh pelanggan lebih dari 7 hari sebelum tanggal acara: DP dikembalikan penuh.",
      "Pembatalan 3–7 hari sebelum tanggal acara: DP dikembalikan 50%.",
      "Pembatalan kurang dari 3 hari sebelum tanggal acara: DP tidak dapat dikembalikan karena bahan dan jadwal produksi sudah dipesan.",
      "Pembatalan dari pihak Yumm! (force majeure, kondisi tidak terduga): seluruh pembayaran dikembalikan penuh.",
    ],
  },
  {
    id: "privasi",
    Icon: Shield,
    title: "Kebijakan Privasi",
    items: [
      "Kami mengumpulkan data pelanggan (nama, nomor HP, alamat, dan catatan pesanan) hanya untuk keperluan pemrosesan dan pengiriman pesanan.",
      "Data pelanggan tidak dibagikan ke pihak ketiga tanpa izin, kecuali diwajibkan oleh hukum.",
      "Data pelanggan hanya dapat diakses oleh admin Yumm! yang berwenang.",
      "Di kalender publik, hanya nama pemesan yang ditampilkan. Nomor HP dan alamat tidak pernah ditampilkan ke pelanggan lain.",
      "Kami dapat menghubungi pelanggan melalui WhatsApp untuk konfirmasi, pengingat, dan koordinasi pesanan.",
      "Pelanggan dapat meminta penghapusan data dengan menghubungi admin melalui WhatsApp.",
    ],
  },
  {
    id: "kualitas",
    Icon: RefreshCw,
    title: "Kualitas dan Komplain",
    items: [
      "Yumm! menjamin semua produk dibuat segar sesuai pesanan pada hari pengiriman.",
      "Jika produk yang diterima tidak sesuai dengan pesanan, hubungi admin dalam 1×24 jam dengan bukti foto.",
      "Komplain yang valid akan ditindaklanjuti dengan penggantian produk atau pengembalian dana sebagian, sesuai kesepakatan.",
      "Keluhan lebih dari 24 jam setelah penerimaan tidak dapat diproses karena produk sudah tidak dapat diverifikasi.",
    ],
  },
  {
    id: "kontak",
    Icon: MessageCircle,
    title: "Hubungi Kami",
    items: [
      "Untuk pertanyaan tentang pesanan, ketentuan, atau privasi, hubungi admin melalui WhatsApp.",
      "Nomor WhatsApp admin dapat ditemukan di halaman depan website atau melalui tombol chat di pojok kanan bawah.",
      "Jam operasional admin: Senin – Sabtu, 08.00 – 20.00 WIB.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-dvh bg-surface">
      <header className="sticky top-0 z-30 border-b border-neutral-100 bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="font-display text-2xl font-bold text-yumm-pink"
          >
            Yumm!
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-yumm px-4 py-2 font-display text-sm font-semibold text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            Beranda
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-10">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-yumm-pink">
            Ketentuan Layanan
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
            Syarat dan Ketentuan
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            Dengan melakukan pemesanan di Yumm!, kamu dianggap telah membaca
            dan menyetujui ketentuan berikut. Bacalah dengan saksama sebelum
            memesan.
          </p>
          <p className="mt-3 text-xs text-ink-muted">
            Terakhir diperbarui:{" "}
            {new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="space-y-6">
          {SECTIONS.map((section) => {
            const Icon = section.Icon;
            return (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 rounded-yumm-lg border border-neutral-100 bg-white p-6 shadow-sm sm:p-8"
              >
                <header className="mb-4 flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yumm-pink/10">
                    <Icon
                      size={20}
                      strokeWidth={2.2}
                      className="text-yumm-pink"
                    />
                  </div>
                  <h2 className="mt-1 font-display text-lg font-bold text-ink sm:text-xl">
                    {section.title}
                  </h2>
                </header>

                <ul className="space-y-3">
                  {section.items.map((item, index) => (
                    <li key={index} className="flex gap-3 text-sm">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-yumm-pink" />
                      <span className="flex-1 leading-relaxed text-ink-muted">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        <div className="mt-10 rounded-yumm-lg border border-yumm-lemon/40 bg-yumm-lemon/10 p-6">
          <p className="text-sm text-ink">
            <strong>Catatan:</strong> Ketentuan ini dapat berubah tanpa
            pemberitahuan sebelumnya. Versi terbaru selalu tersedia di
            halaman ini. Untuk pertanyaan spesifik, hubungi admin sebelum
            memesan.
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/order"
            className="inline-flex items-center gap-2 rounded-full bg-yumm-pink px-6 py-3 font-display text-sm font-semibold text-white shadow-lg shadow-yumm-pink/25 transition-all hover:-translate-y-0.5 hover:bg-yumm-coral"
          >
            Mulai pesan
          </Link>
        </div>
      </main>

      <footer className="border-t border-neutral-100 bg-white px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
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
