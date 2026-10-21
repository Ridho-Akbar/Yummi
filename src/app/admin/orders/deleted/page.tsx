import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getDeletedOrders } from "@/features/orders/queries";
import { RestoreOrderButton } from "@/components/admin/RestoreOrderButton";

export const metadata = {
  title: "Pesanan Dihapus — Admin",
};

export default async function DeletedOrdersPage() {
  const orders = await getDeletedOrders();

  return (
    <div className="space-y-6">
      <header>
        <Link
          href="/admin/orders"
          className="mb-2 inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-yumm-pink hover:underline"
        >
          <ArrowLeft size={12} /> Kembali ke Pesanan
        </Link>
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          Sampah Pesanan
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Daftar pesanan yang telah dihapus. Kamu bisa memulihkannya kembali.
        </p>
      </header>

      {orders.length === 0 ? (
        <div className="rounded-yumm-lg border border-neutral-100 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-ink-muted">Tidak ada pesanan yang dihapus.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-yumm-lg border border-neutral-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-muted">
                <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                  <th className="px-4 py-3">Kode</th>
                  <th className="px-4 py-3">Pelanggan</th>
                  <th className="px-4 py-3">Tanggal Acara</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-neutral-100">
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-surface-muted px-2 py-1 font-mono text-[11px] font-semibold text-ink">
                        {order.orderCode}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-display font-semibold text-ink">{order.customerName}</p>
                      <p className="text-xs text-ink-muted">{order.customerPhone}</p>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">
                      {new Date(order.orderDate).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <RestoreOrderButton orderId={order.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
