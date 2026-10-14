import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type UserRole = "user" | "admin" | "superadmin";

export interface CurrentUser {
  id: string;
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  role: UserRole;
}

const VALID_ROLES: UserRole[] = ["user", "admin", "superadmin"];

function normalizeRole(value: unknown): UserRole {
  if (typeof value === "string" && VALID_ROLES.includes(value as UserRole)) {
    return value as UserRole;
  }
  return "user";
}

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, role")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email ?? null,
    displayName: profile?.display_name ?? null,
    avatarUrl: user.user_metadata?.avatar_url ?? null,
    role: normalizeRole(profile?.role),
  };
});

export async function requireAdmin(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    throw new Error("Akses ditolak. Halaman ini hanya untuk admin.");
  }
  return user;
}

export async function requireSuperadmin(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user || user.role !== "superadmin") {
    throw new Error("Akses ditolak. Halaman ini hanya untuk superadmin.");
  }
  return user;
}