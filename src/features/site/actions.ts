"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import {
  storeInfoFormSchema,
  heroFormSchema,
  whyChooseFormSchema,
  howToOrderFormSchema,
  whatsappFormSchema,
  footerFormSchema,
  homepageConfigFormSchema,
  updateOrderPasswordSchema,
} from "./schema";

export interface SettingsState {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string[]>;
}

async function upsertSetting(
  key: string,
  value: unknown,
  changedBy: string
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from("site_settings").upsert(
    {
      key,
      value: value as never,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) {
    console.error("[upsertSetting] error:", error);
    return { error: "Gagal menyimpan." };
  }

  await supabase.from("settings_audit_logs").insert({
    key,
    changed_by: changedBy,
    action: "update",
  });

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return {};
}

export async function updateStoreInfo(
  _prevState: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  let userId: string;
  try {
    const user = await requireAdmin();
    userId = user.id;
  } catch {
    return { error: "Akses ditolak." };
  }

  const parsed = storeInfoFormSchema.safeParse({
    name: formData.get("name"),
    tagline: formData.get("tagline") ?? "",
    address: formData.get("address") ?? "",
    phone: formData.get("phone") ?? "",
    email: formData.get("email") ?? "",
    hours: formData.get("hours") ?? "",
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      error: "Ada data yang belum benar.",
    };
  }

  const result = await upsertSetting("store_info", parsed.data, userId);
  if (result.error) return { error: result.error };

  return { success: "Info toko disimpan." };
}

export async function updateHero(
  _prevState: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  let userId: string;
  try {
    const user = await requireAdmin();
    userId = user.id;
  } catch {
    return { error: "Akses ditolak." };
  }

  const parsed = heroFormSchema.safeParse({
    tagline: formData.get("tagline"),
    subtitle: formData.get("subtitle") ?? "",
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      error: "Ada data yang belum benar.",
    };
  }

  const result = await upsertSetting("hero", parsed.data, userId);
  if (result.error) return { error: result.error };

  return { success: "Hero disimpan." };
}

export async function updateWhyChoose(
  _prevState: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  let userId: string;
  try {
    const user = await requireAdmin();
    userId = user.id;
  } catch {
    return { error: "Akses ditolak." };
  }

  const items: { title: string; desc: string }[] = [];
  for (let i = 0; i < 6; i++) {
    const title = formData.get(`items[${i}].title`);
    const desc = formData.get(`items[${i}].desc`);
    if (title === null && desc === null) continue;
    items.push({
      title: String(title ?? "").trim(),
      desc: String(desc ?? "").trim(),
    });
  }

  const parsed = whyChooseFormSchema.safeParse({ items });
  if (!parsed.success) {
    return { error: "Ada data yang belum benar." };
  }

  const result = await upsertSetting(
    "why_choose",
    parsed.data.items,
    userId
  );
  if (result.error) return { error: result.error };

  return { success: "Section disimpan." };
}

export async function updateHowToOrder(
  _prevState: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  let userId: string;
  try {
    const user = await requireAdmin();
    userId = user.id;
  } catch {
    return { error: "Akses ditolak." };
  }

  const items: { title: string; desc: string }[] = [];
  for (let i = 0; i < 6; i++) {
    const title = formData.get(`items[${i}].title`);
    const desc = formData.get(`items[${i}].desc`);
    if (title === null && desc === null) continue;
    items.push({
      title: String(title ?? "").trim(),
      desc: String(desc ?? "").trim(),
    });
  }

  const parsed = howToOrderFormSchema.safeParse({ items });
  if (!parsed.success) {
    return { error: "Ada data yang belum benar." };
  }

  const result = await upsertSetting(
    "how_to_order",
    parsed.data.items,
    userId
  );
  if (result.error) return { error: result.error };

  return { success: "Section disimpan." };
}

export async function updateWhatsapp(
  _prevState: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  let userId: string;
  try {
    const user = await requireAdmin();
    userId = user.id;
  } catch {
    return { error: "Akses ditolak." };
  }

  const parsed = whatsappFormSchema.safeParse({
    url: formData.get("url") ?? "",
    floatingEnabled: formData.get("floatingEnabled") === "on",
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      error: "Ada data yang belum benar.",
    };
  }

  const result = await upsertSetting("whatsapp", parsed.data, userId);
  if (result.error) return { error: result.error };

  return { success: "WhatsApp disimpan." };
}

export async function updateFooter(
  _prevState: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  let userId: string;
  try {
    const user = await requireAdmin();
    userId = user.id;
  } catch {
    return { error: "Akses ditolak." };
  }

  const parsed = footerFormSchema.safeParse({
    tagline: formData.get("tagline") ?? "",
    copyright: formData.get("copyright") ?? "",
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      error: "Ada data yang belum benar.",
    };
  }

  const result = await upsertSetting("footer", parsed.data, userId);
  if (result.error) return { error: result.error };

  return { success: "Footer disimpan." };
}

export async function updateHomepageConfig(
  _prevState: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  let userId: string;
  try {
    const user = await requireAdmin();
    userId = user.id;
  } catch {
    return { error: "Akses ditolak." };
  }

  const parsed = homepageConfigFormSchema.safeParse({
    latestCount: formData.get("latestCount") ?? 2,
    terlarisCount: formData.get("terlarisCount") ?? 2,
    bestSellerCount: formData.get("bestSellerCount") ?? 2,
  });

  if (!parsed.success) {
    return { error: "Ada data yang belum benar." };
  }

  const result = await upsertSetting(
    "homepage_config",
    parsed.data,
    userId
  );
  if (result.error) return { error: result.error };

  return { success: "Konfigurasi homepage disimpan." };
}

export async function updateOrderPassword(
  _prevState: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  let userId: string;
  try {
    const user = await requireAdmin();
    userId = user.id;
  } catch {
    return { error: "Akses ditolak." };
  }

  const parsed = updateOrderPasswordSchema.safeParse({
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      error: "Ada data yang belum benar.",
    };
  }

  const hash = await hashPassword(parsed.data.newPassword);

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert(
      {
        key: "order_access",
        value: {
          passwordHash: hash,
          updatedAt: new Date().toISOString(),
          updatedBy: userId,
        } as never,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );

  if (error) {
    console.error("[updateOrderPassword] error:", error);
    return { error: "Gagal menyimpan sandi. Coba lagi." };
  }

  await supabase.from("settings_audit_logs").insert({
    key: "order_access",
    changed_by: userId,
    action: "update_password",
  });

  revalidatePath("/admin/settings");

  return {
    success:
      "Sandi order berhasil diperbarui. Beritahu pelanggan yang butuh sandi baru.",
  };
}