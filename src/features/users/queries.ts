import "server-only";
import { createClient } from "@/lib/supabase/server";
import type {
  UserListItem,
  UserRole,
  RoleChangeLog,
  LogDaysFilter,
  RoleChangeLogsResult,
} from "./types";

export interface GetAllUsersParams {
  query?: string;
  role?: UserRole;
}

// ============================================
// RPC ROW TYPES
// Supabase tidak meng-infer return type RPC secara otomatis,
// jadi kita deklarasikan manual di sini.
// ============================================

interface UserProfileRow {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: string;
  created_at: string;
}

interface RoleChangeLogRow {
  id: string;
  user_id: string;
  user_display_name: string | null;
  user_email: string | null;
  changed_by: string | null;
  changed_by_display_name: string | null;
  changed_by_email: string | null;
  old_role: string;
  new_role: string;
  created_at: string;
}

// ============================================
// MAPPERS
// ============================================

function mapUserRow(row: UserProfileRow): UserListItem {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    phone: row.phone,
    role: row.role as UserRole,
    createdAt: row.created_at,
  };
}

function mapRoleChangeLogRow(row: RoleChangeLogRow): RoleChangeLog {
  return {
    id: row.id,
    userId: row.user_id,
    userDisplayName: row.user_display_name,
    userEmail: row.user_email,
    changedBy: row.changed_by,
    changedByDisplayName: row.changed_by_display_name,
    changedByEmail: row.changed_by_email,
    oldRole: row.old_role as UserRole,
    newRole: row.new_role as UserRole,
    createdAt: row.created_at,
  };
}

// ============================================
// QUERIES
// ============================================

export async function getAllUsers({
  query = "",
  role,
}: GetAllUsersParams = {}): Promise<UserListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("list_users_with_profile", {
    p_query: query.trim(),
    p_role: role ?? null,
  });

  if (error) throw error;

  return ((data ?? []) as UserProfileRow[]).map(mapUserRow);
}

export async function getRecentRoleChanges(
  limit = 5
): Promise<RoleChangeLog[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("list_role_change_logs", {
    p_limit: limit,
    p_offset: 0,
    p_days: null,
  });

  if (error) throw error;

  return ((data ?? []) as RoleChangeLogRow[]).map(mapRoleChangeLogRow);
}

export interface GetRoleChangeLogsParams {
  limit?: number;
  offset?: number;
  days?: LogDaysFilter;
}

export async function getRoleChangeLogs({
  limit = 20,
  offset = 0,
  days = null,
}: GetRoleChangeLogsParams = {}): Promise<RoleChangeLogsResult> {
  const supabase = await createClient();

  const [listResult, countResult] = await Promise.all([
    supabase.rpc("list_role_change_logs", {
      p_limit: limit,
      p_offset: offset,
      p_days: days,
    }),
    supabase.rpc("count_role_change_logs", { p_days: days }),
  ]);

  if (listResult.error) throw listResult.error;
  if (countResult.error) throw countResult.error;

  const logs = ((listResult.data ?? []) as RoleChangeLogRow[]).map(
    mapRoleChangeLogRow
  );

  return {
    logs,
    total: (countResult.data as number | null) ?? 0,
  };
}