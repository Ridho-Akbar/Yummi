"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { faqListSchema } from "./schema";

export interface FaqState {
  error?: string;
  success?: string;
}

export async function saveFaqList(
  _prevState: FaqState,
  formData: FormData
): Promise<FaqState> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Akses ditolak." };
  }

  const items: {
    id: string | null;
    question: string;
    answer: string;
    isActive: boolean;
  }[] = [];

  for (let i = 0; i < 20; i++) {
    const question = formData.get(`items[${i}].question`);
    if (question === null) continue;

    const id = formData.get(`items[${i}].id`);
    items.push({
      id: id === null || id === "" ? null : String(id),
      question: String(question),
      answer: String(formData.get(`items[${i}].answer`) ?? ""),
      isActive: formData.get(`items[${i}].isActive`) === "on",
    });
  }

  const parsed = faqListSchema.safeParse({ items });
  if (!parsed.success) {
    const firstError = Object.values(
      parsed.error.flatten().fieldErrors
    )[0]?.[0];
    return { error: firstError ?? "Data tidak valid." };
  }

  const supabase = await createClient();

  const { data: existing, error: fetchError } = await supabase
    .from("faqs")
    .select("id");

  if (fetchError) {
    return { error: "Gagal memuat FAQ. Coba lagi." };
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
    const { error } = await supabase.from("faqs").delete().in("id", toDelete);
    if (error) return { error: "Gagal menghapus FAQ." };
  }

  const newItems: {
    question: string;
    answer: string;
    sort_order: number;
    is_active: boolean;
  }[] = [];
  
  const existingItems: {
    id: string;
    question: string;
    answer: string;
    sort_order: number;
    is_active: boolean;
  }[] = [];
  
  parsed.data.items.forEach((item, index) => {
    if (item.id === null) {
      newItems.push({
        question: item.question,
        answer: item.answer,
        sort_order: index,
        is_active: item.isActive,
      });
    } else {
      existingItems.push({
        id: item.id,
        question: item.question,
        answer: item.answer,
        sort_order: index,
        is_active: item.isActive,
      });
    }
  });

  if (newItems.length > 0) {
    const { error: insertError } = await supabase
      .from("faqs")
      .insert(newItems);

    if (insertError) {
      console.error("[saveFaqList] insert error:", insertError);
      return { error: "Gagal menambah FAQ. Coba lagi." };
    }
  }

  if (existingItems.length > 0) {
    const { error: updateError } = await supabase
      .from("faqs")
      .upsert(existingItems, { onConflict: "id" });

    if (updateError) {
      console.error("[saveFaqList] update error:", updateError);
      return { error: "Gagal memperbarui FAQ. Coba lagi." };
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/faqs");

  return { success: "FAQ berhasil disimpan." };
}