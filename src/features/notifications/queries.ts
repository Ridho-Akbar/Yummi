import "server-only";
import { createClient } from "@/lib/supabase/server";
import type {
  NotificationType,
  AdminNotificationItem,
  NotificationsResult,
} from "./types";

export async function getAdminNotifications(
  limit = 30
): Promise<NotificationsResult> {
  const supabase = await createClient();

  const [listResult, countResult] = await Promise.all([
    supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false),
  ]);

  if (listResult.error) throw listResult.error;
  if (countResult.error) throw countResult.error;

  const notifications: AdminNotificationItem[] = (listResult.data ?? []).map(
    (row) => ({
      id: row.id,
      type: row.type as NotificationType,
      title: row.title,
      body: row.body,
      linkUrl: row.link_url,
      isRead: row.is_read,
      createdAt: row.created_at,
    })
  );

  return {
    notifications,
    unreadCount: countResult.count ?? 0,
  };
}