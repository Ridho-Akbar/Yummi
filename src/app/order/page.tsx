import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import {
  getAvailableProducts,
  getProductCapacitiesForDate,
} from "@/features/orders/queries";
import { OrderForm } from "@/components/order/OrderForm";
import { toDateString } from "@/lib/calendar";

export const metadata = {
  title: "Pesan — Yumm!",
};

interface OrderPageProps {
  searchParams: Promise<{ date?: string; product?: string }>;
}

export default async function OrderPage({ searchParams }: OrderPageProps) {
  const params = await searchParams;
  const user = await getCurrentUser();

  const rawDate = params.date?.trim() ?? "";
  const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(rawDate);
  const initialDate = isValidDate ? rawDate : "";

  const initialProductId =
    params.product && /^[0-9a-f-]{36}$/i.test(params.product)
      ? params.product
      : undefined;

  const products = await getAvailableProducts();

  const capacities = initialDate
    ? await getProductCapacitiesForDate(initialDate)
    : {};

  // Kalau product ID di URL tidak ada di daftar produk aktif, abaikan.
  const validInitialProduct =
    initialProductId && products.some((p) => p.id === initialProductId)
      ? initialProductId
      : undefined;

  return (
    <main className="min-h-dvh px-4 py-6 sm:px-6 sm:py-12">
      <header className="mx-auto flex max-w-5xl items-center justify-between">
        <Link
          href="/"
          className="font-display text-2xl font-bold text-yumm-pink"
        >
          Yumm!
        </Link>
        <Link
          href="/"
          className="text-sm text-ink-muted underline-offset-4 hover:underline"
        >
          Kembali ke beranda
        </Link>
      </header>

      <div className="mx-auto mt-8 max-w-5xl">
        <div className="mb-6 text-center">
          <h1 className="font-display text-3xl font-bold text-ink">
            Isi pesananmu
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            {user
              ? `Hai ${user.displayName ?? "kamu"}! Isi data pesanan di bawah ya.`
              : "Kamu belum login. Isi sandi akses dari admin untuk lanjut."}
          </p>
        </div>

        <OrderForm
          products={products}
          initialDate={initialDate}
          initialProductId={validInitialProduct}
          isLoggedIn={!!user}
          initialCapacities={capacities}
        />
      </div>
    </main>
  );
}