import { Download } from "lucide-react";
import { OrderViewTabs } from "@/components/admin/OrderViewTabs";
import { OrderCalendar } from "@/components/admin/OrderCalendar";
import { OrderSearchBar } from "@/components/admin/OrderSearchBar";
import { OrderList } from "@/components/admin/OrderList";
import { Pagination } from "@/components/ui/Pagination";
import { ICON_SIZE } from "@/lib/icons";
import {
  getMonthOrders,
  searchAdminOrders,
  type OrderStatus,
  type PaymentStatus,
  type DateFilter,
} from "@/features/orders/queries";

export const metadata = {
  title: "Pesanan — Admin",
};

const VALID_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "done",
  "cancelled",
];

const VALID_PAYMENT_STATUSES: PaymentStatus[] = ["unpaid", "dp", "paid"];

const VALID_DATE_FILTERS: DateFilter[] = ["all", "today", "week", "month"];

const PER_PAGE = 15;

interface OrdersPageProps {
  searchParams: Promise<{
    view?: string;
    year?: string;
    month?: string;
    q?: string;
    status?: string;
    payment?: string;
    date?: string;
    page?: string;
  }>;
}

export default async function AdminOrdersPage({
  searchParams,
}: OrdersPageProps) {
  const params = await searchParams;
  const view = params.view === "list" ? "list" : "calendar";

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            Pesanan
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {view === "calendar"
              ? "Klik tanggal untuk melihat pesanan di hari itu."
              : "Cari dan filter pesanan. Klik untuk detail."}
          </p>
        </div>
        <OrderViewTabs current={view} />
      </header>

      {view === "calendar" ? (
        <CalendarView params={params} />
      ) : (
        <ListView params={params} />
      )}
    </div>
  );
}

async function CalendarView({
  params,
}: {
  params: { year?: string; month?: string };
}) {
  const now = new Date();
  const year = params.year ? Number(params.year) : now.getFullYear();
  const month = params.month ? Number(params.month) : now.getMonth();

  const { summary, ordersByDate, totalRevenue, totalCount } =
    await getMonthOrders(year, month);

  return (
    <OrderCalendar
      year={year}
      month={month}
      summary={summary}
      ordersByDate={ordersByDate}
      totalRevenue={totalRevenue}
      totalCount={totalCount}
    />
  );
}

async function ListView({
  params,
}: {
  params: {
    q?: string;
    status?: string;
    payment?: string;
    date?: string;
    page?: string;
  };
}) {
  const query = params.q ?? "";
  const status = VALID_STATUSES.includes(params.status as OrderStatus)
    ? (params.status as OrderStatus)
    : undefined;
  const paymentStatus = VALID_PAYMENT_STATUSES.includes(
    params.payment as PaymentStatus
  )
    ? (params.payment as PaymentStatus)
    : undefined;
  const dateFilter = VALID_DATE_FILTERS.includes(params.date as DateFilter)
    ? (params.date as DateFilter)
    : "all";

  const page = Math.max(1, Number(params.page) || 1);
  const offset = (page - 1) * PER_PAGE;

  const { orders, total } = await searchAdminOrders({
    query,
    status,
    paymentStatus,
    dateFilter,
    limit: PER_PAGE,
    offset,
  });

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  const exportQuery = new URLSearchParams();
  exportQuery.set("period", dateFilter);
  if (status) exportQuery.set("status", status);
  if (paymentStatus) exportQuery.set("payment", paymentStatus);

  return (
    <div className="space-y-5">
      <OrderSearchBar
        initialQuery={query}
        initialStatus={status}
        initialPaymentStatus={paymentStatus}
        initialDateFilter={dateFilter}
      />

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-ink-muted">
          {total === 0
            ? "Tidak ada pesanan untuk filter ini."
            : `${total} pesanan sesuai filter. Export akan mengunduh semua ${total} pesanan, bukan hanya halaman ini.`}
        </p>
        <a
          href={`/api/admin/orders/export?${exportQuery.toString()}`}
          className="inline-flex shrink-0 items-center gap-2 rounded-yumm border border-neutral-200 bg-white px-4 py-2 font-display text-xs font-semibold text-ink transition-colors hover:border-yumm-pink hover:bg-yumm-pink/5 hover:text-yumm-pink"
        >
          <Download size={ICON_SIZE.sm} strokeWidth={2.5} />
          Export CSV
        </a>
      </div>

      <OrderList
        orders={orders}
        query={query}
        status={status}
        paymentStatus={paymentStatus}
        dateFilter={dateFilter}
        total={total}
        perPage={PER_PAGE}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        baseUrl="/admin/orders"
        searchParams={{
          view: "list",
          q: params.q,
          status: params.status,
          payment: params.payment,
          date: params.date,
        }}
      />
    </div>
  );
}