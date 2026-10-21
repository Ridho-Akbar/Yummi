import Link from "next/link";
import { getRoleChangeLogs } from "@/features/users/queries";
import { RoleChangeLogList } from "@/components/admin/RoleChangeLogList";
import { RoleLogsFilter } from "@/components/admin/RoleLogsFilter";
import { Pagination } from "@/components/ui/Pagination";
import type { LogDaysFilter } from "@/features/users/types";

export const metadata = {
  title: "Riwayat Role — Admin",
};

const PER_PAGE = 20;

interface LogsPageProps {
  searchParams: Promise<{ days?: string; page?: string }>;
}

export default async function AdminUsersLogsPage({
  searchParams,
}: LogsPageProps) {
  const params = await searchParams;

  const days: LogDaysFilter =
    params.days === "7" ? 7 : params.days === "30" ? 30 : null;

  const page = Math.max(1, Number(params.page) || 1);
  const offset = (page - 1) * PER_PAGE;

  const { logs, total } = await getRoleChangeLogs({
    limit: PER_PAGE,
    offset,
    days,
  });

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/users"
          className="text-xs text-ink-muted underline-offset-4 hover:underline"
        >
          ← Kembali ke daftar pengguna
        </Link>
        <h1 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
          Riwayat Perubahan Role
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          {total} entri
          {days ? ` dalam ${days} hari terakhir` : " total"}.
        </p>
      </div>

      <RoleLogsFilter current={days} />

      {logs.length === 0 ? (
        <div className="rounded-yumm-lg border border-neutral-100 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-ink-muted">
            Belum ada perubahan role pada periode ini.
          </p>
        </div>
      ) : (
        <>
          <RoleChangeLogList logs={logs} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/admin/users/logs"
            searchParams={{
              days: params.days,
            }}
          />
        </>
      )}
    </div>
  );
}
