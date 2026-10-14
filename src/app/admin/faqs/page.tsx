import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllFaqs } from "@/features/faqs/queries";
import { FaqManager } from "@/components/admin/faqs/FaqManager";

export const metadata = {
  title: "FAQ — Admin Yumm!",
};

export default async function AdminFaqsPage() {
  const faqs = await getAllFaqs();

  return (
    <div className="space-y-6">
      <header>
        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-1.5 text-xs text-ink-muted underline-offset-4 hover:underline"
        >
          <ArrowLeft size={12} strokeWidth={2.5} />
          Kembali ke Pengaturan
        </Link>
        <h1 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
          Pertanyaan Umum
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Kelola FAQ yang tampil di halaman depan. Urutan bisa diatur dengan
          tombol panah.
        </p>
      </header>

      <FaqManager initial={faqs} />
    </div>
  );
}
