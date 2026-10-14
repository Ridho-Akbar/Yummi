export type ReminderCategory = "h-2" | "h-1" | "h" | "h+";
export type ReminderSeverity = "info" | "warning" | "urgent";

export interface AdminReminder {
  key: string;
  orderId: string;
  orderCode: string;
  customerName: string;
  orderDate: string;
  category: ReminderCategory;
  message: string;
  severity: ReminderSeverity;
}

export interface GroupedReminders {
  "h-2": AdminReminder[];
  "h-1": AdminReminder[];
  h: AdminReminder[];
  "h+": AdminReminder[];
}
