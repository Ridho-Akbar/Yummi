"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Receipt,
  Package,
  CalendarDays,
  BarChart3,
  Users,
  CalendarClock,
  Settings,
  Menu,
  X,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/lib/icons";
import { signOut } from "@/features/auth/actions";
import type { CurrentUser } from "@/lib/auth";

const COLLAPSE_STORAGE_KEY = "admin-sidebar-collapsed";

interface AdminSidebarProps {
  user: CurrentUser;
  reminderCount: number;
  storeName: string;
}

interface NavItem {
  href: string;
  label: string;
  Icon: typeof LayoutDashboard;
  badge?: number;
}

export function AdminSidebar({ user, reminderCount, storeName }: AdminSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(COLLAPSE_STORAGE_KEY) === "1") setCollapsed(true);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(COLLAPSE_STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  };

  const openMobileDrawer = () => {
    setCollapsed(false);
    setOpen((v) => !v);
  };

  const navItems: NavItem[] = [
    { href: "/admin", label: "Dasbor", Icon: LayoutDashboard },
    { href: "/admin/orders", label: "Pesanan", Icon: Receipt },
    { href: "/admin/products", label: "Produk", Icon: Package },
    { href: "/admin/schedule", label: "Jadwal", Icon: CalendarDays },
    { href: "/admin/reports", label: "Laporan", Icon: BarChart3 },
    { href: "/admin/users", label: "Pengguna", Icon: Users },
    { href: "/admin/reminders", label: "Pengingat", Icon: CalendarClock, badge: reminderCount },
    { href: "/admin/settings", label: "Pengaturan", Icon: Settings },
  ];

  return (
    <>
      <button
        onClick={openMobileDrawer}
        className="fixed left-4 top-4 z-40 rounded-yumm bg-white p-2 shadow-md transition-transform duration-200 ease-out active:scale-90 lg:hidden"
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
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-neutral-100 bg-white",
          "transition-[width,transform] duration-300 ease-in-out",
          "lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        {/* HEADER */}
        <div
          className={cn(
            "flex items-center overflow-hidden border-b border-neutral-100 transition-[padding] duration-300 ease-in-out",
            collapsed ? "px-2 py-5" : "px-6 py-5"
          )}
        >
          <div
            className={cn(
              "grid min-w-0 transition-[grid-template-columns,opacity] duration-300 ease-in-out",
              collapsed
                ? "grid-cols-[0fr] opacity-0"
                : "grid-cols-[1fr] flex-1 opacity-100"
            )}
          >
            <div className="overflow-hidden">
              <Link
                href="/"
                className="block truncate font-display text-2xl font-bold text-yumm-pink"
                title={storeName}
                onClick={() => setOpen(false)}
              >
                {storeName}
              </Link>
              <p className="mt-1 whitespace-nowrap text-xs text-ink-muted">
                Dashboard Admin
              </p>
            </div>
          </div>
          <button
            onClick={toggleCollapsed}
            className={cn(
              "group ml-auto hidden shrink-0 rounded-yumm p-1.5 lg:block",
              "transition-colors duration-200",
              "text-ink-muted hover:bg-surface-muted hover:text-yumm-pink"
            )}
            aria-label={collapsed ? "Perbesar sidebar" : "Perkecil sidebar"}
            title={collapsed ? "Perbesar sidebar" : "Perkecil sidebar"}
          >
            <span className="block transition-transform duration-200 ease-out group-hover:scale-110 group-active:scale-90">
              {collapsed ? (
                <PanelLeftOpen size={ICON_SIZE.md} strokeWidth={2} />
              ) : (
                <PanelLeftClose size={ICON_SIZE.md} strokeWidth={2} />
              )}
            </span>
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-2 py-4">
          {navItems.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <SidebarLink
                key={item.href}
                item={item}
                active={active}
                collapsed={collapsed}
                onNavigate={() => setOpen(false)}
              />
            );
          })}
        </nav>

        {/* FOOTER */}
        <div
          className={cn(
            "overflow-hidden border-t border-neutral-100 transition-[padding] duration-300 ease-in-out",
            collapsed ? "p-2" : "p-4"
          )}
        >
          {collapsed ? (
            <div className="flex flex-col items-center gap-2">
              <UserAvatar user={user} title={user.displayName ?? "Admin"} />
              <form action={signOut}>
                <button
                  type="submit"
                  className="group rounded-yumm p-1.5 text-yumm-coral transition-colors duration-200 hover:bg-surface-muted"
                  aria-label="Keluar"
                  title="Keluar"
                >
                  <LogOut
                    size={ICON_SIZE.md}
                    className="transition-transform duration-200 ease-out group-hover:scale-110 group-active:scale-90"
                  />
                </button>
              </form>
            </div>
          ) : (
            <>
              <div className="mb-3 flex items-center gap-3 px-2">
                <UserAvatar user={user} />
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
                  className="w-full rounded-yumm px-4 py-2 text-left text-sm text-yumm-coral transition-colors duration-200 hover:bg-surface-muted"
                >
                  Keluar
                </button>
              </form>
            </>
          )}
        </div>
      </aside>
    </>
  );
}

function SidebarLink({
  item,
  active,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onNavigate: () => void;
}) {
  const { href, label, Icon, badge } = item;
  const showBadge = badge !== undefined && badge > 0;

  return (
    <Link
      href={href}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      className={cn(
        "group relative flex items-center rounded-yumm font-display text-sm font-semibold",
        "transition-colors duration-200",
        collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-4 py-2.5",
        active
          ? "bg-yumm-pink/10 text-yumm-pink"
          : "text-ink-muted hover:bg-surface-muted hover:text-ink"
      )}
    >
      <Icon
        size={ICON_SIZE.md}
        strokeWidth={active ? 2.5 : 2}
        className="shrink-0 transition-transform duration-200 ease-out group-hover:scale-110"
      />
      <span
        className={cn(
          "grid whitespace-nowrap transition-[grid-template-columns,opacity] duration-300 ease-in-out",
          collapsed
            ? "grid-cols-[0fr] opacity-0"
            : "grid-cols-[1fr] flex-1 opacity-100"
        )}
      >
        <span className="overflow-hidden">{label}</span>
      </span>
      {!collapsed && showBadge && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-yumm-coral px-1.5 font-display text-[10px] font-bold text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
      {collapsed && showBadge && (
        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-yumm-coral" />
      )}
    </Link>
  );
}

function UserAvatar({ user, title }: { user: CurrentUser; title?: string }) {
  if (user.avatarUrl) {
    return (
      <Image
        src={user.avatarUrl}
        alt={user.displayName ?? "Avatar"}
        width={36}
        height={36}
        className="shrink-0 rounded-full"
        title={title}
      />
    );
  }
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yumm-lilac font-display text-sm font-semibold text-white"
      title={title}
    >
      {(user.displayName ?? user.email ?? "U").charAt(0).toUpperCase()}
    </span>
  );
}