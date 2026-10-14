import Link from "next/link";
import { Download } from "lucide-react";
import { getReportData } from "@/features/reports/queries";
import { ReportsPeriodFilter } from "@/components/admin/ReportsPeriodFilter";
import { MonthlyRevenueChart } from "@/components/admin/MonthlyRevenueChart";
import { ICON_SIZE } from "@/lib/icons";
import type { TopProduct, TopCustomer } from "@/features/reports/types";

export const metadata = {
  title: "Laporan — Admin Yumm!",
};

interface ReportsPageProps {
  searchParams: Promise<{ year?: string; month?: string }>;
}

export default async function AdminReportsPage({
  searchParams,
}: ReportsPageProps) {
  const params = await searchParams;
  const now = new Date();
  const year = params.year ? Number(params.year) : now.getFullYear();
  const month =
    params.month !== undefined ? Number(params.month) : now.getMonth();

  const data = await getReportData(year, month);
  const currentMonthKey = `${year}-${String(month + 1).padStart(2, "0")}`;

  const exportHref = `/api/admin/reports/export?year=${year}&month=${month}`;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            Laporan
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Ringkasan performa bisnis periode {data.periodLabel}.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ReportsPeriodFilter year={year} month={month} />
          <a
            href={exportHref}
            className="inline-flex items-center gap-2 rounded-yumm border border-neutral-200 bg-white px-4 py-2.5 font-display text-sm font-semibold text-ink transition-colors hover:border-yumm-pink hover:bg-yumm-pink/5 hover:text-yumm-pink"
          >
            <Download size={ICON_SIZE.sm} strokeWidth={2.5} />
            Export CSV
          </a>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-yumm-lg border border-neutral-100 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Pendapatan {data.periodLabel}
          </p>
          <p className="mt-2 font-display text-3xl font-bold text-yumm-pink">
            Rp{data.periodRevenue.toLocaleString("id-ID")}
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            Dari pesanan yang dikonfirmasi atau selesai.
          </p>
        </div>

        <div className="rounded-yumm-lg border border-neutral-100 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Produk terjual
          </p>
          <p className="mt-2 font-display text-3xl font-bold text-yumm-lilac">
            {data.topProducts
              .reduce((sum, p) => sum + p.totalQty, 0)
              .toLocaleString("id-ID")}
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            Total kuantitas dari {data.topProducts.length} produk teratas.
          </p>
        </div>
      </div>

      <div className="rounded-yumm-lg border border-neutral-100 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="mb-4 font-display text-base font-bold text-ink">
          Tren Pendapatan
        </h2>
        <MonthlyRevenueChart
          data={data.monthlyRevenue}
          highlightMonthKey={currentMonthKey}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-yumm-lg border border-neutral-100 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 font-display text-base font-bold text-ink">
            Produk Terlaris — {data.periodLabel}
          </h2>
          <TopProductsTable products={data.topProducts} />
        </div>

        <div className="rounded-yumm-lg border border-neutral-100 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 font-display text-base font-bold text-ink">
            Pelanggan Teratas — {data.periodLabel}
          </h2>
          <TopCustomersTable customers={data.topCustomers} />
        </div>
      </div>
    </div>
  );
}

function TopProductsTable({ products }: { products: TopProduct[] }) {
  if (products.length === 0) {
    return (
      <p className="text-sm text-ink-muted">
        Belum ada produk terjual di periode ini.
      </p>
    );
  }

  const maxQty = Math.max(...products.map((p) => p.totalQty), 1);

  return (
    <div className="space-y-3">
      {products.map((product, index) => {
        const percent = (product.totalQty / maxQty) * 100;
        return (
          <div key={`${product.productId}-${index}`} className="space-y-1.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yumm-pink/10 font-display text-xs font-bold text-yumm-pink">
                  {index + 1}
                </span>
                <p className="truncate font-display text-sm font-semibold text-ink">
                  {product.productName}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-display text-sm font-semibold text-ink">
                  {product.totalQty}×
                </p>
                <p className="text-[11px] text-ink-muted">
                  Rp{product.totalRevenue.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-yumm-pink transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TopCustomersTable({ customers }: { customers: TopCustomer[] }) {
  if (customers.length === 0) {
    return (
      <p className="text-sm text-ink-muted">
        Belum ada pelanggan di periode ini.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {customers.map((customer, index) => (
        <div
          key={customer.customerPhone}
          className="flex items-center justify-between gap-3 rounded-yumm border border-neutral-100 px-4 py-3"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yumm-lilac/15 font-display text-xs font-bold text-yumm-lilac">
              {index + 1}
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-semibold text-ink">
                {customer.customerName}
              </p>
              <p className="truncate text-xs text-ink-muted">
                {customer.customerPhone} · {customer.orderCount} pesanan
              </p>
            </div>
          </div>
          <p className="shrink-0 font-display text-sm font-semibold text-yumm-pink">
            Rp{customer.totalSpent.toLocaleString("id-ID")}
          </p>
        </div>
      ))}
    </div>
  );
}