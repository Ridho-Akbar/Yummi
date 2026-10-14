import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import {
  getAllUsers,
  getRecentRoleChanges,
} from "@/features/users/queries";
import { UserRoleButton } from "@/components/admin/UserRoleButton";
import { UserSearchBar } from "@/components/admin/UserSearchBar";
import { RoleChangeLogList } from "@/components/admin/RoleChangeLogList";
import type { UserRole } from "@/features/users/types";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Pengguna — Admin Yumm!",
};

const VALID_ROLES: UserRole[] = ["user", "admin", "superadmin"];

interface UsersPageProps {
  searchParams: Promise<{ q?: string; role?: string }>;
}

export default async function AdminUsersPage({
  searchParams,
}: UsersPageProps) {
  const params = await searchParams;
  const query = params.q ?? "";
  const role = VALID_ROLES.includes(params.role as UserRole)
    ? (params.role as UserRole)
    : undefined;

  const [currentUser, users, recentChanges] = await Promise.all([
    getCurrentUser(),
    getAllUsers({ query, role }),
    getRecentRoleChanges(5),
  ]);

  if (!currentUser) return null;

  const isFiltered = query.trim() !== "" || role !== undefined;
  const superadminCount = users.filter(
    (u) => u.role === "superadmin"
  ).length;
  const adminCount = users.filter((u) => u.role === "admin").length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          Pengguna
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          {isFiltered
            ? `${users.length} pengguna cocok dengan filter`
            : `${users.length} pengguna terdaftar · ${superadminCount} superadmin · ${adminCount} admin`}
        </p>
      </header>

      <UserSearchBar initialQuery={query} initialRole={role} />

      {users.length === 0 ? (
        <div className="rounded-yumm-lg border border-neutral-100 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-ink-muted">
            {isFiltered
              ? "Tidak ada pengguna yang cocok dengan pencarian."
              : "Belum ada pengguna terdaftar."}
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-yumm-lg border border-neutral-100 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface-muted">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    <th className="px-4 py-3">Nama</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Daftar</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const isSelf = user.id === currentUser.id;
                    return (
                      <tr
                        key={user.id}
                        className="border-t border-neutral-100 transition-colors hover:bg-surface-muted/50"
                      >
                        <td className="px-4 py-3">
                          <p className="font-display font-semibold text-ink">
                            {user.displayName ?? "Tanpa nama"}
                            {isSelf && (
                              <span className="ml-2 rounded-full bg-yumm-pink/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-yumm-pink">
                                Kamu
                              </span>
                            )}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-ink-muted">
                          {user.email}
                        </td>
                        <td className="px-4 py-3 text-ink-muted">
                          {new Date(user.createdAt).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <RoleBadge role={user.role} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <UserRoleButton
                            userId={user.id}
                            currentRole={user.role}
                            viewerRole={currentUser.role}
                            isSelf={isSelf}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-2 md:hidden">
            {users.map((user) => {
              const isSelf = user.id === currentUser.id;
              return (
                <div
                  key={user.id}
                  className="rounded-yumm-lg border border-neutral-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-sm font-semibold text-ink">
                        {user.displayName ?? "Tanpa nama"}
                        {isSelf && (
                          <span className="ml-2 rounded-full bg-yumm-pink/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-yumm-pink">
                            Kamu
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-ink-muted">
                        {user.email}
                      </p>
                      <p className="mt-1 text-[11px] text-ink-muted">
                        Daftar{" "}
                        {new Date(user.createdAt).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <RoleBadge role={user.role} />
                  </div>
                  <div className="mt-3 flex justify-end border-t border-neutral-100 pt-3">
                    <UserRoleButton
                      userId={user.id}
                      currentRole={user.role}
                      viewerRole={currentUser.role}
                      isSelf={isSelf}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="rounded-yumm-lg border border-neutral-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-ink">
            Riwayat perubahan role
          </h2>
          <Link
            href="/admin/users/logs"
            className="text-xs font-semibold text-yumm-pink underline-offset-4 hover:underline"
          >
            Lihat semua →
          </Link>
        </div>
        <RoleChangeLogList logs={recentChanges} />
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  if (role === "superadmin") {
    return (
      <span className="inline-block shrink-0 rounded-full bg-yumm-coral px-3 py-1 text-xs font-semibold text-white">
        Superadmin
      </span>
    );
  }

  if (role === "admin") {
    return (
      <span className="inline-block shrink-0 rounded-full bg-yumm-lilac/20 px-3 py-1 text-xs font-semibold text-yumm-lilac">
        Admin
      </span>
    );
  }

  return (
    <span className="inline-block shrink-0 rounded-full bg-neutral-200 px-3 py-1 text-xs font-semibold text-ink-muted">
      User
    </span>
  );
}