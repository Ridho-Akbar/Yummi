import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";

interface PublicHeaderProps {
  storeName: string;
  backUrl?: string;
  backLabel?: string;
  showOrderBtn?: boolean;
}

export function PublicHeader({
  storeName,
  backUrl = "/",
  backLabel = "Beranda",
  showOrderBtn = false,
}: PublicHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-100 bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="max-w-[200px] truncate font-display text-2xl font-bold text-yumm-pink sm:max-w-xs"
          title={storeName}
        >
          {storeName}
        </Link>

        <div className="flex items-center gap-3">
          {showOrderBtn ? (
            <Link
              href="/order"
              className="inline-flex items-center gap-2 rounded-full bg-yumm-pink px-5 py-2 font-display text-sm font-semibold text-white transition-colors hover:bg-yumm-coral"
            >
              <ShoppingCart size={16} strokeWidth={2.5} />
              Pesan
            </Link>
          ) : (
            <Link
              href={backUrl}
              className="inline-flex items-center gap-1.5 rounded-yumm px-4 py-2 font-display text-sm font-semibold text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
            >
              <ArrowLeft size={16} strokeWidth={2.5} />
              {backLabel}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
