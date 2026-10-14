import Link from "next/link";
import { ArrowRight, CalendarDays, Home, ShoppingCart } from "lucide-react";
import { ICON_SIZE } from "@/lib/icons";

export const metadata = {
  title: "Halaman Tidak Ditemukan — Yumm!",
  description:
    "Halaman yang kamu cari tidak ada atau sudah dipindahkan.",
};

const QUICK_LINKS = [
  {
    href: "/",
    Icon: Home,
    label: "Beranda",
    desc: "Kembali ke halaman utama",
  },
  {
    href: "/order",
    Icon: ShoppingCart,
    label: "Pesan Sekarang",
    desc: "Langsung isi form pesanan",
  },
  {
    href: "/#kalender",
    Icon: CalendarDays,
    label: "Lihat Kalender",
    desc: "Cek tanggal yang masih kosong",
  },
];

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-gradient-to-br from-yumm-pink/5 via-yumm-lilac/5 to-yumm-mint/5 px-4 py-12 sm:px-6">
      <div
        aria-hidden
        className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-yumm-lilac/30 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-yumm-mint/40 blur-3xl"
      />

      <div className="relative w-full max-w-2xl">
        <div className="text-center">
          <p className="font-display text-7xl font-bold leading-none text-yumm-pink/20 sm:text-9xl">
            404
          </p>
          <h1 className="-mt-4 font-display text-3xl font-bold leading-tight text-ink sm:-mt-6 sm:text-4xl">
            Halaman tidak ditemukan
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-muted sm:text-base">
            Halaman yang kamu cari tidak ada, mungkin sudah dipindahkan,
            atau link-nya salah ketik.
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {QUICK_LINKS.map((link) => {
            const Icon = link.Icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group rounded-yumm-lg border border-neutral-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-yumm-pink/40 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yumm-pink/10">
                  <Icon
                    size={18}
                    strokeWidth={2.2}
                    className="text-yumm-pink"
                  />
                </div>
                <p className="mt-3 font-display text-sm font-bold text-ink">
                  {link.label}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                  {link.desc}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-yumm-pink">
                  Buka
                  <ArrowRight
                    size={12}
                    strokeWidth={2.5}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-yumm-pink px-6 py-3 font-display text-sm font-semibold text-white shadow-lg shadow-yumm-pink/25 transition-all hover:-translate-y-0.5 hover:bg-yumm-coral"
          >
            <Home size={ICON_SIZE.sm} strokeWidth={2.5} />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
