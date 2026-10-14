"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { socialLinkListSchema } from "./schema";

export interface SocialLinkState {
  error?: string;
  success?: string;
}

export async function saveSocialLinks(
  _prevState: SocialLinkState,
  formData: FormData
): Promise<SocialLinkState> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Akses ditolak." };
  }

  const items: {
    id: string | null;
    platform: string;
    url: string;
    isActive: boolean;
  }[] = [];

  for (let i = 0; i < 10; i++) {
    const platform = formData.get(`items[${i}].platform`);
    if (platform === null) continue;

    const id = formData.get(`items[${i}].id`);
    items.push({
      id: id === null || id === "" ? null : String(id),
      platform: String(platform).trim(),
      url: String(formData.get(`items[${i}].url`) ?? "").trim(),
      isActive: formData.get(`items[${i}].isActive`) === "on",
    });
  }

  const parsed = socialLinkListSchema.safeParse({ items });
  if (!parsed.success) {
    const firstError = Object.values(
      parsed.error.flatten().fieldErrors
    )[0]?.[0];
    return { error: firstError ?? "Data tidak valid." };
  }

  const supabase = await createClient();

  const { data: existing, error: fetchError } = await supabase
    .from("social_links")
    .select("id");

  if (fetchError) {
    return { error: "Gagal memuat data. Coba lagi." };
  }

  const existingIds = new Set((existing ?? []).map((r) => r.id));
  const incomingIds = new Set(
    parsed.data.items
      .filter((i): i is typeof i & { id: string } => i.id !== null)
      .map((i) => i.id)
  );

  const toDelete = Array.from(existingIds).filter(
    (id) => !incomingIds.has(id)
  );
  if (toDelete.length > 0) {
    const { error } = await supabase
      .from("social_links")
      .delete()
      .in("id", toDelete);
    if (error) return { error: "Gagal menghapus data lama." };
  }

  if (parsed.data.items.length > 0) {
    const upsertRows = parsed.data.items.map((item, index) => ({
      id: item.id ?? undefined,
      platform: item.platform,
      url: item.url,
      sort_order: index,
      is_active: item.isActive,
    }));

    const { error: upsertError } = await supabase
      .from("social_links")
      .upsert(upsertRows, { onConflict: "id" });

    if (upsertError) {
      console.error("[saveSocialLinks] upsert error:", upsertError);
      return { error: "Gagal menyimpan. Coba lagi." };
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");

  return { success: "Sosial media disimpan." };
}
