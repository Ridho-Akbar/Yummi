import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Calendar, Lock, MessageCircle, ShoppingCart } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { SignInButton } from "@/components/auth/SignInButton";

export const metadata = {
  title: "Masuk",
};

interface LoginPageProps {
  searchParams: Promise<{ next?: string; error?: string }>;
}

const HIGHLIGHTS = [
  {
    Icon: Calendar,
    title: "Pre-order untuk tanggal acara",
    desc: "Pesan sekarang, tentukan tanggal acaramu nanti.",
  },
  {
    Icon: ShoppingCart,
    title: "Pesan tanpa daftar",
    desc: "Login opsional. Pakai sandi akses dari admin kalau ingin anonim.",
  },
  {
    Icon: MessageCircle,
    title: "Konfirmasi cepat",
    desc: "Admin balas lewat WhatsApp dalam hitungan jam.",
  },
];

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const user = await getCurrentUser();

  if (user) {
    redirect(params.next ?? "/");
  }

  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      {/* KIRI — Branding panel (desktop only) */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-yumm-pink to-yumm-lilac p-12 lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden
          className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/20 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-yumm-coral/30 blur-3xl"
        />

        <div className="relative">
          <Link
            href="/"
            className="font-display text-3xl font-bold text-white"
          >
            Yumm!
          </Link>
        </div>

        <div className="relative space-y-8">
          <div>
            <h1 className="font-display text-3xl font-bold leading-tight text-white xl:text-4xl">
              Pre-order makanan viral untuk acara spesialmu
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/85">
              Login opsional. Kamu bisa langsung pesan tanpa akun — cukup
              pakai sandi akses dari admin.
            </p>
          </div>

          <ul className="space-y-5">
            {HIGHLIGHTS.map((item) => {
              const Icon = item.Icon;
              return (
                <li key={item.title} className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <Icon size={16} strokeWidth={2.5} className="text-white" />
                  </span>
                  <div>
                    <p className="font-display text-sm font-semibold text-white">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-white/75">
                      {item.desc}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="relative">
          <p className="text-xs text-white/60">
            &copy; {new Date().getFullYear()} Copyright All rights reserved.
          </p>
        </div>
      </aside>

      {/* KANAN — Form */}
      <div className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-yumm-pink/5 via-yumm-lilac/5 to-yumm-mint/5 px-4 py-12 sm:px-6 lg:bg-surface">
        <div
          aria-hidden
          className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-yumm-lilac/30 blur-3xl lg:hidden"
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-yumm-mint/40 blur-3xl lg:hidden"
        />

        <div className="relative w-full max-w-md">
          <div className="rounded-yumm-lg border border-neutral-100 bg-white p-6 shadow-xl shadow-yumm-pink/5 sm:p-8">
            <div className="text-center">
              <Link
                href="/"
                className="inline-block font-display text-3xl font-bold text-yumm-pink lg:hidden"
              >
                Yumm!
              </Link>

              <h1 className="mt-6 font-display text-2xl font-bold leading-tight text-ink sm:text-3xl lg:mt-0">
                Masuk dulu yuk
              </h1>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-ink-muted">
                Login opsional. Kalau mau pesan anonim, langsung saja ke
                form pesanan.
              </p>
            </div>

            {params.error && (
              <div className="mt-6 rounded-yumm border border-yumm-coral/30 bg-yumm-coral/10 px-4 py-3 text-sm text-yumm-coral">
                {params.error === "missing_code" &&
                  "Google tidak mengirim kode otorisasi. Coba lagi."}
                {params.error === "auth_failed" &&
                  "Gagal masuk. Coba lagi atau hubungi admin."}
                {params.error === "oauth_failed" &&
                  "Tidak bisa menghubungi Google. Cek koneksi lalu coba lagi."}
              </div>
            )}

            <div className="mt-6 space-y-4">
              <div className="[&>form]:w-full [&_button]:w-full">
                <SignInButton next={params.next} />
              </div>

              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-neutral-100" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                  atau
                </span>
                <span className="h-px flex-1 bg-neutral-100" />
              </div>

              <Link
                href="/order"
                className="group flex w-full items-center justify-between gap-3 rounded-yumm border-2 border-neutral-200 bg-white px-5 py-3 transition-colors hover:border-yumm-pink hover:bg-yumm-pink/5"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yumm-pink/10 text-yumm-pink">
                    <ShoppingCart size={16} strokeWidth={2.5} />
                  </span>
                  <span className="flex flex-col items-start">
                    <span className="font-display text-sm font-semibold text-ink">
                      Pesan anonim
                    </span>
                    <span className="text-[11px] text-ink-muted">
                      Langsung tanpa daftar
                    </span>
                  </span>
                </span>
                <ArrowRight
                  size={16}
                  strokeWidth={2.5}
                  className="text-ink-muted transition-transform group-hover:translate-x-0.5 group-hover:text-yumm-pink"
                />
              </Link>
            </div>

            <div className="mt-6 rounded-yumm bg-surface-muted px-4 py-3">
              <div className="flex gap-2.5">
                <Lock
                  size={14}
                  strokeWidth={2.5}
                  className="mt-0.5 shrink-0 text-yumm-pink"
                />
                <p className="text-xs leading-relaxed text-ink-muted">
                  Untuk pesan anonim, kamu perlu <strong>sandi akses</strong>{" "}
                  dari admin. Minta lewat WhatsApp kalau belum punya.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-ink-muted">
            Dengan masuk, kamu setuju dengan{" "}
            <Link
              href="/terms"
              className="font-semibold text-yumm-pink underline-offset-4 hover:underline"
            >
              ketentuan layanan
            </Link>{" "}
            kami.
          </p>
        </div>
      </div>
    </main>
  );
}