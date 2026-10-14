import "server-only";
import { headers } from "next/headers";
import { createHash } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const CLEANUP_AGE_MS = 24 * 60 * 60 * 1000;
const IS_DEV = process.env.NODE_ENV !== "production";

async function getClientIpHash(): Promise<string> {
  const headersList = await headers();
  const forwarded = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  const ip = forwarded?.split(",")[0]?.trim() ?? realIp ?? "unknown";

  const salt = process.env.IP_HASH_SALT;
  if (!salt) {
    throw new Error("IP_HASH_SALT belum di-set di environment.");
  }

  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export interface PasswordRateLimitResult {
  allowed: boolean;
  remainingAttempts: number;
}

export async function checkPasswordRateLimit(): Promise<PasswordRateLimitResult> {
  let ipHash: string;
  try {
    ipHash = await getClientIpHash();
  } catch (err) {
    if (IS_DEV) console.error("[rate-limit] getClientIpHash failed:", err);
    // Fail closed: kalau tidak bisa cek, tolak dulu.
    return { allowed: false, remainingAttempts: 0 };
  }

  const supabase = createAdminClient();
  const cutoff = new Date(Date.now() - WINDOW_MS).toISOString();

  const { count, error } = await supabase
    .from("password_attempts")
    .select("*", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .eq("success", false)
    .gte("created_at", cutoff);

  if (error) {
    if (IS_DEV) {
      console.error("[rate-limit] check failed:", error.message);
    }
    // Fail closed: kalau database bermasalah, tolak dulu.
    return { allowed: false, remainingAttempts: 0 };
  }

  const failed = count ?? 0;
  const remaining = Math.max(MAX_ATTEMPTS - failed, 0);

  return {
    allowed: failed < MAX_ATTEMPTS,
    remainingAttempts: remaining,
  };
}

export async function recordPasswordAttempt(success: boolean): Promise<void> {
  let ipHash: string;
  try {
    ipHash = await getClientIpHash();
  } catch (err) {
    if (IS_DEV) console.error("[rate-limit] getClientIpHash failed:", err);
    return;
  }

  const supabase = createAdminClient();

  const { error } = await supabase.from("password_attempts").insert({
    ip_hash: ipHash,
    success,
  });

  if (error && IS_DEV) {
    console.error("[rate-limit] record failed:", error.message);
  }

  // Cleanup lazy: jalan sekali tiap percobaan.
  const cleanupCutoff = new Date(Date.now() - CLEANUP_AGE_MS).toISOString();
  await supabase
    .from("password_attempts")
    .delete()
    .lt("created_at", cleanupCutoff);
}