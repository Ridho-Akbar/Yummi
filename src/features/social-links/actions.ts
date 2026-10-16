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
    // Pisahkan item baru dan item yang sudah ada.
    // Upsert dengan id undefined bikin Supabase kirim string kosong,
    // yang kemudian ditolak oleh constraint not null di kolom id.
    const newItems = parsed.data.items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.id === null)
      .map(({ item, index }) => ({
        platform: item.platform,
        url: item.url,
        sort_order: index,
        is_active: item.isActive,
      }));

    const existingItems = parsed.data.items
      .map((item, index) => ({ item, index }))
      .filter(({ item }): item is typeof item & { id: string } => item.id !== null)
      .map(({ item, index }) => ({
        id: item.id,
        platform: item.platform,
        url: item.url,
        sort_order: index,
        is_active: item.isActive,
      }));

    if (newItems.length > 0) {
      const { error: insertError } = await supabase
        .from("social_links")
        .insert(newItems);

      if (insertError) {
        console.error("[saveSocialLinks] insert error:", insertError);
        return { error: "Gagal menambah sosial media. Coba lagi." };
      }
    }

    if (existingItems.length > 0) {
      const { error: updateError } = await supabase
        .from("social_links")
        .upsert(existingItems, { onConflict: "id" });

      if (updateError) {
        console.error("[saveSocialLinks] update error:", updateError);
        return { error: "Gagal memperbarui sosial media. Coba lagi." };
      }
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");

  return { success: "Sosial media disimpan." };
}