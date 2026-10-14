import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { NotificationBell } from "@/components/admin/NotificationBell";
import {
  getAdminReminders,
  countReminders,
} from "@/features/reminders/queries";
import { getAdminNotifications } from "@/features/notifications/queries";

export const metadata = {
  title: "Admin — Yumm!",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/admin");
  }

  if (user.role !== "admin" && user.role !== "superadmin") {
    redirect("/");
  }

  const [reminders, notificationsResult] = await Promise.all([
    getAdminReminders(),
    getAdminNotifications(),
  ]);
  const reminderCount = countReminders(reminders);

  return (
    <div className="flex min-h-dvh bg-surface-muted">
      <AdminSidebar user={user} reminderCount={reminderCount} />
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-6xl px-4 pb-4 pt-16 sm:px-6 sm:pb-6 sm:pt-16 lg:px-8 lg:pb-8 lg:pt-16">
          {children}
        </div>
      </main>
      <div className="fixed right-4 top-4 z-30 lg:right-8 lg:top-6">
        <NotificationBell
          notifications={notificationsResult.notifications}
          unreadCount={notificationsResult.unreadCount}
        />
      </div>
    </div>
  );
}