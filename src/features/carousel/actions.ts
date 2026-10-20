"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export async function saveCarouselImage(imageUrl: string) {
  try {
    await requireAdmin();
  } catch {
    return { error: "Akses ditolak." };
  }

  const supabase = await createClient();
  
  // Cari urutan terakhir
  const { data: existing } = await supabase
    .from("carousel_images")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (existing?.sort_order ?? 0) + 1;

  // Kembalikan data setelah insert agar bisa dipakai di client
  const { data, error } = await supabase
    .from("carousel_images")
    .insert({
      image_url: imageUrl,
      sort_order: nextOrder,
    })
    .select()
    .single();

  if (error) {
    return { error: "Gagal menyimpan gambar ke database." };
  }

  // Perbaikan path: sekarang masuk ke /admin/settings
  revalidatePath("/menu");
  revalidatePath("/admin/settings");
  
  return { 
    success: true, 
    data: {
      id: data.id,
      imageUrl: data.image_url,
      sortOrder: data.sort_order
    } 
  };
}

export async function deleteCarouselImage(id: string, imageUrl: string) {
  try {
    await requireAdmin();
  } catch {
    return { error: "Akses ditolak." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("carousel_images").delete().eq("id", id);

  if (error) return { error: "Gagal menghapus gambar." };

  const marker = `/product-images/`;
  const index = imageUrl.indexOf(marker);
  if (index !== -1) {
    const path = imageUrl.slice(index + marker.length);
    await supabase.storage.from("product-images").remove([path]);
  }

  revalidatePath("/menu");
  revalidatePath("/admin/settings");
  return { success: true };
}