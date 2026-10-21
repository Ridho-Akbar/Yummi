import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAdminOrderDetailByCode,
  getAvailableProducts,
} from "@/features/orders/queries";
import { getOrderTimeline } from "@/features/orders/timeline-queries";
import { StatusChanger } from "@/components/admin/StatusChanger";
import { PaymentChanger } from "@/components/admin/PaymentChanger";
import { OrderEditModal } from "@/components/admin/OrderEditModal";
import { DeleteOrderButton } from "@/components/admin/DeleteOrderButton";
import { OrderTimeline } from "@/components/admin/OrderTimeline";

export const metadata = {
  title: "Detail Pesanan — Admin",
};

interface OrderDetailPageProps {
  params: Promise<{ orderCode: string }>;
}

export default async function AdminOrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { orderCode } = await params;
  const [order, products] = await Promise.all([
    getAdminOrderDetailByCode(orderCode),
    getAvailableProducts(),
  ]);

  if (!order) notFound();

  const timeline = await getOrderTimeline(order.id);

  const formattedOrderDate = new Date(order.orderDate).toLocaleDateString(
    "id-ID",
    { weekday: "long", day: "numeric", month: "long", year: "numeric" }
  );

  const formattedCreatedAt = new Date(order.createdAt).toLocaleString(
    "id-ID",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const waLink = `https://wa.me/${order.customerPhone.replace(/^0/, "62")}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/orders"
            className="text-xs text-ink-muted underline-offset-4 hover:underline"
          >
            ← Kembali ke daftar pesanan
          </Link>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
            Detail Pesanan
          </h1>
          <p className="mt-1 inline-block rounded-md bg-surface-muted px-2.5 py-1 font-mono text-sm font-semibold text-ink">
            {order.orderCode}
          </p>
        </div>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-yumm bg-emerald-500 px-5 py-2.5 font-display text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
        >
          Chat WhatsApp
        </a>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card title="Produk yang dipesan">
            <div className="space-y-3">
              {order.items.map((item, index) => {
                const price = Number(item.price ?? 0);
                const qty = Number(item.qty ?? 0);
                const subtotal = price * qty;

                return (
                  <div
                    key={`${item.productId ?? item.name}-${index}`}
                    className="flex items-start justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="font-display text-sm font-semibold text-ink">
                        {item.name ?? "Produk tidak dikenal"}
                      </p>
                      <p className="text-xs text-ink-muted">
                        Rp{price.toLocaleString("id-ID")} × {qty}
                      </p>
                    </div>
                    <p className="shrink-0 font-display text-sm font-semibold text-ink">
                      Rp{subtotal.toLocaleString("id-ID")}
                    </p>
                  </div>
                );
              })}
              <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                <span className="font-display text-sm font-semibold text-ink-muted">
                  Total
                </span>
                <span className="font-display text-xl font-bold text-yumm-pink">
                  Rp{order.total.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </Card>

          {order.note && (
            <Card title="Catatan dari pelanggan">
              <p className="whitespace-pre-wrap text-sm text-ink">
                {order.note}
              </p>
            </Card>
          )}

          <Card title="Data pelanggan">
            <dl className="space-y-4">
              <Row label="Nama">
                <span className="font-display font-semibold">
                  {order.customerName}
                </span>
                {order.isAnonymous && (
                  <span className="ml-2 rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-semibold uppercase text-ink-muted">
                    Anonim
                  </span>
                )}
              </Row>
              <Row label="WhatsApp">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yumm-pink underline-offset-4 hover:underline"
                >
                  {order.customerPhone}
                </a>
              </Row>
              <Row label="Alamat">
                <span className="whitespace-pre-wrap">
                  {order.customerAddress ?? "-"}
                </span>
              </Row>
              <Row label="Tanggal pengiriman">{formattedOrderDate}</Row>
              <Row label="Dipesan pada">{formattedCreatedAt}</Row>
            </dl>
          </Card>

          <Card title="Riwayat pesanan">
            <OrderTimeline
              entries={timeline}
              orderCreatedAt={order.createdAt}
              customerName={order.customerName}
            />
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Aksi">
            <div className="space-y-3">
              <OrderEditModal
                order={order}
                products={products}
                trigger={
                  <button
                    type="button"
                    className="w-full rounded-yumm border border-neutral-200 px-4 py-2.5 font-display text-sm font-semibold text-ink transition-colors hover:border-yumm-pink hover:bg-yumm-pink/5 hover:text-yumm-pink"
                  >
                    Edit pesanan
                  </button>
                }
              />
              <DeleteOrderButton orderId={order.id} />
            </div>
          </Card>

          <Card title="Pembayaran">
            <PaymentChanger
              orderId={order.id}
              currentStatus={order.paymentStatus}
              currentAmount={order.amountPaid}
              orderTotal={order.total}
            />
          </Card>

          <Card title="Status pesanan">
            <StatusChanger orderId={order.id} currentStatus={order.status} />
          </Card>

          <Card title="Alur status">
            <ol className="space-y-2 text-xs text-ink-muted">
              <li>1. Pending — pesanan baru masuk, belum dikonfirmasi.</li>
              <li>
                2. Dikonfirmasi — sudah dihubungi, tanggal dan detail fix.
              </li>
              <li>3. Selesai — pesanan sudah dikirim atau diambil.</li>
              <li>4. Dibatalkan — pesanan batal dari kedua pihak.</li>
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-yumm-lg border border-neutral-100 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-4 font-display text-base font-bold text-ink">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="text-sm">
      <dt className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </dt>
      <dd className="text-ink">{children}</dd>
    </div>
  );
}