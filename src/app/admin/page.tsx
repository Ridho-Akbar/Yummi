import Link from "next/link";
import { getDashboardStats } from "@/features/admin/queries";
import { getAvailableProducts } from "@/features/orders/queries";
import { TodayOrdersPanel } from "@/components/admin/TodayOrdersPanel";
import { CapacityAlertPanel } from "@/components/admin/CapacityAlertPanel";
import { getMonthName } from "@/lib/calendar";

export default async function AdminDashboardPage() {
  const [stats, products] = await Promise.all([
    getDashboardStats(),
    getAvailableProducts(),
  ]);
  const now = new Date();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          Dasbor
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Ringkasan aktivitas Yumm! hari ini.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total pesanan"
          value={stats.totalOrders}
          color="bg-yumm-pink/10 text-yumm-pink"
        />
        <StatCard
          label="Menunggu konfirmasi"
          value={stats.pendingOrders}
          color="bg-yumm-coral/10 text-yumm-coral"
        />
        <StatCard
          label="Sudah dikonfirmasi"
          value={stats.confirmedOrders}
          color="bg-yumm-lilac/10 text-yumm-lilac"
        />
        <StatCard
          label="Masuk hari ini"
          value={stats.todayOrders}
          color="bg-yumm-mint/20 text-emerald-700"
        />
      </div>

      <TodayOrdersPanel orders={stats.todayOrdersList} />

      <CapacityAlertPanel groups={stats.capacityAlerts} products={products} />

      <div className="rounded-yumm-lg border border-neutral-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Pendapatan {getMonthName(now.getMonth())} {now.getFullYear()}
            </p>
            <p className="mt-2 font-display text-3xl font-bold text-yumm-pink">
              Rp{stats.revenue.thisMonth.toLocaleString("id-ID")}
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              Dari {stats.revenue.thisMonthCount} pesanan yang dikonfirmasi
              atau selesai.
            </p>
          </div>

          <div className="text-right">
            {stats.revenue.growthPercent !== null ? (
              <GrowthBadge percent={stats.revenue.growthPercent} />
            ) : (
              <span className="inline-block rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-ink-muted">
                Belum ada data bulan lalu
              </span>
            )}
            <p className="mt-2 text-xs text-ink-muted">
              Bulan lalu: Rp{stats.revenue.lastMonth.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-yumm-lg border border-neutral-100 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="mb-4 font-display text-base font-bold text-ink">
          Aksi cepat
        </h2>
        <div className="flex flex-wrap gap-2">
          <QuickLink
            href="/admin/orders?status=pending"
            label="Lihat pesanan pending"
          />
          <QuickLink href="/admin/products" label="Tambah produk baru" />
          <QuickLink href="/admin/schedule" label="Atur jadwal" />
        </div>
      </div>
    </div>
  );
}

function GrowthBadge({ percent }: { percent: number }) {
  const isPositive = percent >= 0;
  return (
    <span
      className={
        isPositive
          ? "inline-block rounded-full bg-yumm-mint/30 px-3 py-1 text-xs font-semibold text-emerald-700"
          : "inline-block rounded-full bg-yumm-coral/15 px-3 py-1 text-xs font-semibold text-yumm-coral"
      }
    >
      {isPositive ? "↑" : "↓"} {Math.abs(percent).toFixed(1)}% dari bulan lalu
    </span>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-yumm-lg border border-neutral-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </p>
      <p
        className={`mt-2 inline-block rounded-yumm px-3 py-1 font-display text-2xl font-bold ${color}`}
      >
        {value}
      </p>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-yumm border border-neutral-200 px-4 py-2 font-display text-sm font-semibold text-ink transition-colors hover:border-yumm-pink hover:bg-yumm-pink/5 hover:text-yumm-pink"
    >
      {label}
    </Link>
  );
}