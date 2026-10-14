"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export interface NotificationActionResult {
  error?: string;
  success?: boolean;
}

export async function markNotificationRead(
  notificationId: string
): Promise<NotificationActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Akses ditolak." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);

  if (error) return { error: "Gagal." };

  revalidatePath("/admin", "layout");
  return { success: true };
}

export async function markAllNotificationsRead(): Promise<NotificationActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Akses ditolak." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("is_read", false);

  if (error) return { error: "Gagal." };

  revalidatePath("/admin", "layout");
  return { success: true };
}

export async function deleteNotification(
  notificationId: string
): Promise<NotificationActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Akses ditolak." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId);

  if (error) return { error: "Gagal." };

  revalidatePath("/admin", "layout");
  return { success: true };
}

export async function deleteAllNotifications(): Promise<NotificationActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Akses ditolak." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("notifications")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (error) return { error: "Gagal." };

  revalidatePath("/admin", "layout");
  return { success: true };
}