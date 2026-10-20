import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { CopyCodeButton } from "@/components/order/CopyCodeButton";
import { ICON_SIZE } from "@/lib/icons";
import { getSiteSettings } from "@/features/site/queries";

interface OrderSuccessPageProps {
  searchParams: Promise<{ code?: string }>;
}

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return { title: `Pesanan diterima — ${settings.storeInfo.name}` };
}

export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const params = await searchParams;
  const code = params.code;
  const settings = await getSiteSettings();

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md space-y-8 text-center">
        <Link href="/" className="inline-block max-w-[250px] truncate font-display text-3xl font-bold text-yumm-pink">
          {settings.storeInfo.name}
        </Link>

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yumm-mint/40">
          <CheckCircle size={48} strokeWidth={2} className="text-emerald-700" />
        </div>

        <div className="space-y-3">
          <h1 className="font-display text-3xl font-bold text-ink">
            Pesanan diterima!
          </h1>
          <p className="text-sm text-ink-muted">
            Admin akan menghubungimu lewat WhatsApp untuk konfirmasi tanggal
            dan detail pengiriman.
          </p>
        </div>

        {code && (
          <div className="space-y-3 rounded-yumm-lg border-2 border-dashed border-yumm-pink/40 bg-yumm-pink/5 px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Kode Pesananmu
              </p>
              <p className="mt-2 font-mono text-lg font-bold text-yumm-pink">
                {code}
              </p>
            </div>
            <CopyCodeButton code={code} />
          </div>
        )}

        <div className="rounded-yumm-lg border border-neutral-100 bg-white p-5 text-left shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Selanjutnya
          </p>
          <ul className="mt-3 space-y-2 text-sm text-ink">
            <li className="flex gap-2">
              <span className="text-yumm-pink">1.</span>
              <span>Tunggu pesan WhatsApp dari admin dalam 1×24 jam.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-yumm-pink">2.</span>
              <span>Konfirmasi tanggal, alamat, dan detail pesanan.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-yumm-pink">3.</span>
              <span>Lakukan pembayaran sesuai instruksi admin.</span>
            </li>
          </ul>
        </div>

        <Link
          href="/"
          className="inline-block rounded-yumm bg-yumm-pink px-6 py-3 font-display text-sm font-semibold text-white transition-colors hover:bg-yumm-coral"
        >
          Kembali ke kalender
        </Link>
      </div>
    </main>
  );
}