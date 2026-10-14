import Link from "next/link";

export const metadata = {
  title: "Login gagal — Yumm!",
};

export default function AuthCodeErrorPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm space-y-6 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Aduh, login-nya gagal
        </h1>
        <p className="text-sm text-ink-muted">
          Ada masalah saat menghubungi Google. Coba lagi, atau pesan anonim
          saja langsung dari form.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="rounded-yumm bg-yumm-pink px-5 py-2.5 font-display text-sm font-semibold text-white transition-colors hover:bg-yumm-coral"
          >
            Coba login lagi
          </Link>
          <Link
            href="/order"
            className="text-sm text-ink-muted underline-offset-4 hover:underline"
          >
            Pesan anonim saja
          </Link>
        </div>
      </div>
    </main>
  );
}