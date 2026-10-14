"use client";

import { createClient } from "./client";

const BUCKET = "product-images";
const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

export interface UploadResult {
  url?: string;
  error?: string;
}

function generateFileName(file: File): string {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 10);
  return `${timestamp}-${random}.${ext}`;
}

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Format harus JPG, PNG, atau WebP.";
  }
  if (file.size > MAX_SIZE_BYTES) {
    const mb = (MAX_SIZE_BYTES / 1024 / 1024).toFixed(0);
    return `Ukuran maksimal ${mb} MB.`;
  }
  return null;
}

export async function uploadProductImage(file: File): Promise<UploadResult> {
  const validationError = validateImageFile(file);
  if (validationError) {
    return { error: validationError };
  }

  const supabase = createClient();
  const fileName = generateFileName(file);

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    console.error("[uploadProductImage] error:", uploadError);
    return { error: "Gagal mengunggah gambar. Coba lagi." };
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

  return { url: data.publicUrl };
}

export async function deleteProductImage(url: string): Promise<void> {
  // Hanya hapus file yang memang milik bucket ini
  const marker = `/${BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return;

  const path = url.slice(index + marker.length);
  if (!path) return;

  const supabase = createClient();
  const { error } = await supabase.storage.from(BUCKET).remove([path]);

  if (error) {
    console.error("[deleteProductImage] error:", error);
  }
}
