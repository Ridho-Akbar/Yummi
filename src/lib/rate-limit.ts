import "server-only";
import { headers } from "next/headers";
import { createHash } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

const WINDOW_MS = 60_000;
const CLEANUP_AGE_MS = 3_600_000;

async function getClientIpHash(): Promise<string> {
  const headersList = await headers();
  const forwarded = headersList.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown";

  const salt = process.env.IP_HASH_SALT;
  if (!salt) {
    throw new Error("IP_HASH_SALT belum di-set di environment.");
  }

  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}

export async function checkOrderRateLimit(): Promise<RateLimitResult> {
  const ipHash = await getClientIpHash();
  const supabase = createAdminClient();
  const cutoff = new Date(Date.now() - WINDOW_MS).toISOString();

  const { count, error } = await supabase
    .from("order_rate_limit")
    .select("*", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", cutoff);

  if (error) {
    // Fail open: kalau DB error, izinkan. Jangan blokir user karena
    // masalah infrastruktur.
    return { allowed: true };
  }

  if ((count ?? 0) > 0) {
    return { allowed: false, retryAfterSeconds: 60 };
  }

  return { allowed: true };
}

export async function recordOrderAttempt(): Promise<void> {
  const ipHash = await getClientIpHash();
  const supabase = createAdminClient();

  await supabase.from("order_rate_limit").insert({ ip_hash: ipHash });

  // Cleanup lazy: hapus baris yang lebih tua dari 1 jam.
  // Dijalankan setiap insert, bukan pakai cron.
  const cleanupCutoff = new Date(Date.now() - CLEANUP_AGE_MS).toISOString();
  await supabase
    .from("order_rate_limit")
    .delete()
    .lt("created_at", cleanupCutoff);
}