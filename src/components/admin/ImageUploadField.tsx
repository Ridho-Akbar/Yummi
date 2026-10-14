"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/lib/icons";
import {
  uploadProductImage,
  deleteProductImage,
  validateImageFile,
} from "@/lib/supabase/storage";

interface ImageUploadFieldProps {
  name: string;
  initialUrl?: string | null;
  error?: string;
}

export function ImageUploadField({
  name,
  initialUrl,
  error,
}: ImageUploadFieldProps) {
  const [url, setUrl] = useState<string>(initialUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(file: File | null) {
    if (!file) return;

    const validation = validateImageFile(file);
    if (validation) {
      setLocalError(validation);
      return;
    }

    setLocalError(null);
    setUploading(true);

    const result = await uploadProductImage(file);

    if (result.error || !result.url) {
      setLocalError(result.error ?? "Gagal mengunggah.");
      setUploading(false);
      return;
    }

    // Hapus file lama kalau ada dan milik bucket ini
    if (url && url !== result.url) {
      void deleteProductImage(url);
    }

    setUrl(result.url);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleRemove() {
    if (url) {
      void deleteProductImage(url);
    }
    setUrl("");
    setLocalError(null);
  }

  function openFilePicker() {
    inputRef.current?.click();
  }

  const displayError = error ?? localError;

  return (
    <div className="space-y-1.5">
      <label className="block font-display text-xs font-semibold uppercase tracking-wide text-ink-muted">
        Gambar produk
      </label>

      <input type="hidden" name={name} value={url} />

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
      />

      {url ? (
        <div className="group relative overflow-hidden rounded-yumm border border-neutral-200">
          <div className="relative aspect-video w-full bg-surface-muted">
            <Image
              src={url}
              alt="Preview gambar produk"
              fill
              sizes="(max-width: 768px) 100vw, 480px"
              className="object-cover"
            />
          </div>
          <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={openFilePicker}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink shadow-md backdrop-blur-sm transition-colors hover:bg-white"
              aria-label="Ganti gambar"
            >
              <Upload size={14} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-yumm-coral shadow-md backdrop-blur-sm transition-colors hover:bg-white"
              aria-label="Hapus gambar"
            >
              <Trash2 size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={openFilePicker}
          disabled={uploading}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-yumm border-2 border-dashed py-8",
            "transition-colors",
            uploading
              ? "cursor-wait border-neutral-200 bg-surface-muted"
              : "border-neutral-200 bg-surface hover:border-yumm-pink hover:bg-yumm-pink/5",
            displayError && "border-yumm-coral"
          )}
        >
          {uploading ? (
            <>
              <Loader2
                size={ICON_SIZE.lg}
                className="animate-spin text-yumm-pink"
              />
              <span className="font-display text-xs font-semibold text-ink-muted">
                Mengunggah...
              </span>
            </>
          ) : (
            <>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-yumm-pink/10 text-yumm-pink">
                <ImageIcon size={ICON_SIZE.lg} strokeWidth={2.2} />
              </span>
              <span className="font-display text-xs font-semibold text-ink-muted">
                Klik untuk pilih gambar
              </span>
              <span className="text-[10px] text-ink-muted/70">
                JPG, PNG, WebP · maksimal 5 MB
              </span>
            </>
          )}
        </button>
      )}

      {displayError && (
        <p className="text-xs text-yumm-coral">{displayError}</p>
      )}
    </div>
  );
}
