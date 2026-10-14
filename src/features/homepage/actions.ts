"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import type { HomepageCategory } from "./types";

export interface HomepagePinState {
  error?: string;
  success?: string;
}

const CATEGORIES: HomepageCategory[] = ["latest", "terlaris", "best_seller"];
const MAX_PER_CATEGORY = 6;

export async function saveHomepagePins(
  _prevState: HomepagePinState,
  formData: FormData
): Promise<HomepagePinState> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Akses ditolak." };
  }

  const pins: {
    category: HomepageCategory;
    productId: string;
    sortOrder: number;
  }[] = [];

  for (const category of CATEGORIES) {
    for (let index = 0; index < MAX_PER_CATEGORY; index++) {
      const value = formData.get(`${category}[${index}]`);
      if (value === null) break;
      const productId = String(value).trim();
      if (productId) {
        pins.push({ category, productId, sortOrder: index });
      }
    }
  }

  const supabase = await createClient();

  // Clear all existing pins, then insert the new set.
  // Simpler than diff-based, and the dataset is tiny (max 18 rows).
  const { error: deleteError } = await supabase
    .from("homepage_pins")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (deleteError) {
    console.error("[saveHomepagePins] delete error:", deleteError);
    return { error: "Gagal mereset pin. Coba lagi." };
  }

  if (pins.length > 0) {
    const { error: insertError } = await supabase
      .from("homepage_pins")
      .insert(
        pins.map((p) => ({
          category: p.category,
          product_id: p.productId,
          sort_order: p.sortOrder,
        }))
      );

    if (insertError) {
      console.error("[saveHomepagePins] insert error:", insertError);
      return { error: "Gagal menyimpan pin. Coba lagi." };
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/homepage");

  return { success: "Pin produk disimpan." };
}
