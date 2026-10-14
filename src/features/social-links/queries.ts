import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { SocialLink } from "./types";

export async function getActiveSocialLinks(): Promise<SocialLink[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    platform: row.platform,
    url: row.url,
    sortOrder: row.sort_order,
    isActive: row.is_active,
    createdAt: row.created_at,
  }));
}

export async function getAllSocialLinks(): Promise<SocialLink[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    platform: row.platform,
    url: row.url,
    sortOrder: row.sort_order,
    isActive: row.is_active,
    createdAt: row.created_at,
  }));
}
