"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Bell, ShoppingBag, UserCog, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/lib/icons";
import {
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  deleteAllNotifications,
} from "@/features/notifications/actions";
import type {
  AdminNotificationItem,
  NotificationType,
} from "@/features/notifications/types";

interface NotificationBellProps {
  notifications: AdminNotificationItem[];
  unreadCount: number;
}

const TYPE_ICONS: Record<NotificationType, typeof ShoppingBag> = {
  new_order: ShoppingBag,
  admin_promoted: UserCog,
  admin_demoted: UserCog,
  system: AlertTriangle,
};

const TYPE_COLORS: Record<NotificationType, string> = {
  new_order: "bg-yumm-pink/15 text-yumm-pink",
  admin_promoted: "bg-yumm-lilac/15 text-yumm-lilac",
  admin_demoted: "bg-yumm-coral/15 text-yumm-coral",
  system: "bg-yumm-lemon/40 text-ink",
};

export function NotificationBell({
  notifications,
  unreadCount,
}: NotificationBellProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [localItems, setLocalItems] = useState(notifications);

  useEffect(() => {
    setLocalItems(notifications);
  }, [notifications]);

  useEffect(() => {
    if (!open) return;
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open]);

  const currentUnread = localItems.filter((n) => !n.isRead).length;

  function handleRead(id: string) {
    setLocalItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    startTransition(async () => {
      await markNotificationRead(id);
    });
  }

  function handleMarkAllRead() {
    setLocalItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    startTransition(async () => {
      await markAllNotificationsRead();
    });
  }

  function handleDelete(id: string) {
    setLocalItems((prev) => prev.filter((n) => n.id !== id));
    startTransition(async () => {
      await deleteNotification(id);
    });
  }

  function handleDeleteAll() {
    setLocalItems([]);
    startTransition(async () => {
      await deleteAllNotifications();
    });
  }

  function handleNavigate(item: AdminNotificationItem) {
    if (!item.isRead) handleRead(item.id);
    setOpen(false);
    if (item.linkUrl) router.push(item.linkUrl);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-all hover:scale-105 active:scale-95"
        aria-label={`Notifikasi${currentUnread > 0 ? `, ${currentUnread} baru` : ""}`}
      >
        <Bell size={ICON_SIZE.lg} className="text-ink" strokeWidth={2.2} />
        {currentUnread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-yumm-coral px-1 font-display text-[10px] font-bold text-white">
            {currentUnread > 99 ? "99+" : currentUnread}
          </span>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-full max-w-md flex-col bg-surface shadow-xl"
          >
            <header className="flex items-center justify-between gap-3 border-b border-neutral-100 bg-white px-5 py-4">
              <div>
                <h2 className="font-display text-lg font-bold text-ink">
                  Notifikasi
                </h2>
                <p className="mt-0.5 text-xs text-ink-muted">
                  {currentUnread > 0
                    ? `${currentUnread} belum dibaca`
                    : "Semua sudah dibaca"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {localItems.length > 0 && currentUnread > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    disabled={isPending}
                    className="rounded-yumm px-3 py-1.5 font-display text-xs font-semibold text-yumm-pink transition-colors hover:bg-yumm-pink/10 disabled:opacity-50"
                  >
                    Tandai dibaca
                  </button>
                )}
                {localItems.length > 0 && (
                  <button
                    type="button"
                    onClick={handleDeleteAll}
                    disabled={isPending}
                    className="rounded-yumm px-3 py-1.5 font-display text-xs font-semibold text-yumm-coral transition-colors hover:bg-yumm-coral/10 disabled:opacity-50"
                  >
                    Hapus semua
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Tutup"
                  className="rounded-full p-2 text-ink-muted transition-colors hover:bg-surface-muted"
                >
                  <X size={ICON_SIZE.md} />
                </button>
              </div>
            </header>

            <div className="scrollbar-yumm flex-1 overflow-y-auto">
              {localItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted">
                    <Bell size={28} className="text-ink-muted" />
                  </div>
                  <p className="mt-4 font-display text-base font-semibold text-ink">
                    Tidak ada notifikasi
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">
                    Aktivitas terbaru akan muncul di sini.
                  </p>
                </div>
              ) : (
                <div className="space-y-1 p-5">
                  {localItems.map((n) => {
                    const Icon = TYPE_ICONS[n.type] ?? AlertTriangle;
                    const colorClass =
                      TYPE_COLORS[n.type] ?? "bg-surface-muted text-ink-muted";
                    return (
                      <div
                        key={n.id}
                        className={cn(
                          "group relative rounded-yumm border border-neutral-100 bg-white p-3",
                          "transition-colors hover:border-yumm-pink/40",
                          !n.isRead && "bg-yumm-pink/[0.03]"
                        )}
                      >
                        <div className="flex gap-3">
                          <span
                            className={cn(
                              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                              colorClass
                            )}
                          >
                            <Icon size={16} strokeWidth={2.2} />
                          </span>
                          <div className="min-w-0 flex-1 pr-6">
                            <div className="flex items-center gap-2">
                              <p className="truncate font-display text-sm font-semibold text-ink">
                                {n.title}
                              </p>
                              {!n.isRead && (
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-yumm-pink" />
                              )}
                            </div>
                            {n.body && (
                              <p className="mt-0.5 line-clamp-2 text-xs text-ink-muted">
                                {n.body}
                              </p>
                            )}
                            <p className="mt-1 text-[10px] text-ink-muted">
                              {new Date(n.createdAt).toLocaleString("id-ID", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                            {n.linkUrl && (
                              <button
                                type="button"
                                onClick={() => handleNavigate(n)}
                                className="mt-1.5 text-xs font-semibold text-yumm-pink underline-offset-4 hover:underline"
                              >
                                Lihat →
                              </button>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDelete(n.id)}
                          aria-label="Hapus"
                          className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-ink-muted opacity-0 transition-all hover:bg-surface-muted focus:opacity-100 group-hover:opacity-100"
                        >
                          <X size={12} strokeWidth={2.5} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}