export type NotificationType =
  | "new_order"
  | "admin_promoted"
  | "admin_demoted";

export interface AdminNotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  linkUrl: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResult {
  notifications: AdminNotificationItem[];
  unreadCount: number;
}