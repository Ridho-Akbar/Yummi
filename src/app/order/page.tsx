import { getCurrentUser } from "@/lib/auth";
import { getAvailableProducts, getProductCapacitiesForDate } from "@/features/orders/queries";
import { getSiteSettings } from "@/features/site/queries";
import { OrderForm } from "@/components/order/OrderForm";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { toDateString } from "@/lib/calendar";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return { title: `Pesan — ${settings.storeInfo.name}` };
}

interface OrderPageProps {
  searchParams: Promise<{ date?: string; product?: string; items?: string }>;
}

export default async function OrderPage({ searchParams }: OrderPageProps) {
  const params = await searchParams;
  const [user, settings] = await Promise.all([getCurrentUser(), getSiteSettings()]);

  const isValidDate = params.date && /^\d{4}-\d{2}-\d{2}$/.test(params.date);
  const initialDate = isValidDate ? params.date! : ""; 

  let initialItems: { productId: string; qty: number }[] | undefined;
  if (params.items) {
    initialItems = params.items.split(",").map((pair) => {
      const [id, qty] = pair.split(":");
      return { productId: id, qty: parseInt(qty, 10) || 1 };
    }).filter(i => i.productId);
  }

  const initialProductId = params.product && /^[0-9a-f-]{36}$/i.test(params.product) ? params.product : undefined;

  const products = await getAvailableProducts();
  const capacities = initialDate ? await getProductCapacitiesForDate(initialDate) : {};

  return (
    <main className="min-h-dvh bg-surface">
      <PublicHeader 
        storeName={settings.storeInfo.name} 
        backUrl="/menu" 
        backLabel="Kembali ke Menu" 
      />

      <div className="mx-auto mt-8 max-w-5xl px-4 py-6 sm:px-6 sm:py-12">
        <div className="mb-6 text-center">
          <h1 className="font-display text-3xl font-bold text-ink">Selesaikan pesananmu</h1>
          <p className="mt-2 text-sm text-ink-muted">
            {user ? `Hai ${user.displayName ?? "kamu"}! Cek kembali pesananmu.` : "Kamu belum login. Isi sandi akses dari admin untuk lanjut."}
          </p>
        </div>

        <OrderForm
          products={products}
          initialDate={initialDate}
          initialProductId={initialProductId}
          initialItems={initialItems}
          isLoggedIn={!!user}
          initialCapacities={capacities}
        />
      </div>
    </main>
  );
}