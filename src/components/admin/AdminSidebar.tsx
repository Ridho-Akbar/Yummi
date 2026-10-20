"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Receipt,
  Package,
  CalendarDays,
  BarChart3,
  Users,
  CalendarClock,
  Settings,
  Star,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/lib/icons";
import { signOut } from "@/features/auth/actions";
import type { CurrentUser } from "@/lib/auth";

interface AdminSidebarProps {
  user: CurrentUser;
  reminderCount: number;
  storeName: string;
}

const NAV_ITEMS = [
  { href: "/admin", label: "Dasbor", Icon: LayoutDashboard },
  { href: "/admin/orders", label: "Pesanan", Icon: Receipt },
  { href: "/admin/products", label: "Produk", Icon: Package },
  { href: "/admin/schedule", label: "Jadwal", Icon: CalendarDays },
  { href: "/admin/reports", label: "Laporan", Icon: BarChart3 },
  { href: "/admin/users", label: "Pengguna", Icon: Users },
];

export function AdminSidebar({ user, reminderCount, storeName }: AdminSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed left-4 top-4 z-40 rounded-yumm bg-white p-2 shadow-md lg:hidden"
        aria-label={open ? "Tutup menu" : "Buka menu"}
      >
        {open ? <X size={ICON_SIZE.lg} /> : <Menu size={ICON_SIZE.lg} />}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-ink/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-neutral-100 bg-white transition-transform duration-200",
          "lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="border-b border-neutral-100 px-6 py-5">
          <Link
            href="/"
            className="block max-w-[180px] truncate font-display text-2xl font-bold text-yumm-pink"
            title={storeName}
            onClick={() => setOpen(false)}
          >
            {storeName}
          </Link>
          <p className="mt-1 text-xs text-ink-muted">Dashboard Admin</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-yumm px-4 py-2.5",
                  "font-display text-sm font-semibold transition-colors",
                  active
                    ? "bg-yumm-pink/10 text-yumm-pink"
                    : "text-ink-muted hover:bg-surface-muted hover:text-ink"
                )}
              >
                <item.Icon
                  size={ICON_SIZE.md}
                  strokeWidth={active ? 2.5 : 2}
                  className="shrink-0"
                />
                <span className="flex-1">{item.label}</span>
              </Link>
            );
          })}

          <Link
            href="/admin/reminders"
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-yumm px-4 py-2.5",
              "font-display text-sm font-semibold transition-colors",
              pathname.startsWith("/admin/reminders")
                ? "bg-yumm-pink/10 text-yumm-pink"
                : "text-ink-muted hover:bg-surface-muted hover:text-ink"
            )}
          >
            <CalendarClock
              size={ICON_SIZE.md}
              strokeWidth={
                pathname.startsWith("/admin/reminders") ? 2.5 : 2
              }
              className="shrink-0"
            />
            <span className="flex-1">Pengingat</span>
            {reminderCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-yumm-coral px-1.5 font-display text-[10px] font-bold text-white">
                {reminderCount > 99 ? "99+" : reminderCount}
              </span>
            )}
          </Link>

          <div className="my-2 border-t border-neutral-100" />


          <Link
            href="/admin/settings"
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-yumm px-4 py-2.5",
              "font-display text-sm font-semibold transition-colors",
              pathname.startsWith("/admin/settings")
                ? "bg-yumm-pink/10 text-yumm-pink"
                : "text-ink-muted hover:bg-surface-muted hover:text-ink"
            )}
          >
            <Settings
              size={ICON_SIZE.md}
              strokeWidth={
                pathname.startsWith("/admin/settings") ? 2.5 : 2
              }
              className="shrink-0"
            />
            <span className="flex-1">Pengaturan</span>
          </Link>
          
          {/* Menu FAQ DIHAPUS DARI SINI */}
        </nav>

        <div className="border-t border-neutral-100 p-4">
          <div className="mb-3 flex items-center gap-3 px-2">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.displayName ?? "Avatar"}
                width={36}
                height={36}
                className="shrink-0 rounded-full"
              />
            ) : (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yumm-lilac font-display text-sm font-semibold text-white">
                {(user.displayName ?? user.email ?? "U").charAt(0).toUpperCase()}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm font-semibold text-ink">
                {user.displayName ?? "Admin"}
              </p>
              <p className="truncate text-xs text-ink-muted">{user.email}</p>
            </div>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="w-full rounded-yumm px-4 py-2 text-left text-sm text-yumm-coral transition-colors hover:bg-surface-muted"
            >
              Keluar
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}