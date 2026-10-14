import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface SettingsAuditLog {
  id: string;
  key: string;
  action: string;
  changedBy: string | null;
  changedByName: string | null;
  changedByEmail: string | null;
  createdAt: string;
}

export async function getRecentSettingsAuditLogs(
  limit = 30
): Promise<SettingsAuditLog[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("settings_audit_logs")
    .select("id, key, action, changed_by, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  const rows = data ?? [];
  if (rows.length === 0) return [];

  const userIds = Array.from(
    new Set(rows.map((r) => r.changed_by).filter((id): id is string => !!id))
  );

  const profileMap = new Map<string, { name: string | null; email: string | null }>();

  if (userIds.length > 0) {
    const admin = createAdminClient();

    const [profilesResult, usersResult] = await Promise.all([
      admin.from("profiles").select("id, display_name").in("id", userIds),
      admin.auth.admin.listUsers({ perPage: 200 }),
    ]);

    const emailMap = new Map<string, string>();
    for (const u of usersResult.data?.users ?? []) {
      if (u.email) emailMap.set(u.id, u.email);
    }

    for (const userId of userIds) {
      const profile = profilesResult.data?.find((p) => p.id === userId);
      profileMap.set(userId, {
        name: profile?.display_name ?? null,
        email: emailMap.get(userId) ?? null,
      });
    }
  }

  return rows.map((row) => {
    const info = row.changed_by ? profileMap.get(row.changed_by) : null;
    return {
      id: row.id,
      key: row.key,
      action: row.action,
      changedBy: row.changed_by,
      changedByName: info?.name ?? null,
      changedByEmail: info?.email ?? null,
      createdAt: row.created_at,
    };
  });
}