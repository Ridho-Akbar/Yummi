"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Loader2, X } from "lucide-react";
import { ImageCropper } from "./ImageCropper";
import { uploadProductImage, deleteProductImage } from "@/lib/supabase/storage";
import { saveCarouselImage, deleteCarouselImage } from "@/features/carousel/actions";
import type { CarouselImage } from "@/features/carousel/queries";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function CarouselManager({ initialImages }: { initialImages: CarouselImage[] }) {
  const [images, setImages] = useState(initialImages);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const url = URL.createObjectURL(file);
    setSelectedImage(url);
    // Reset input agar file yang sama bisa dipilih lagi jika batal
    e.target.value = "";
  }

  async function handleCropComplete(croppedFile: File) {
    setIsUploading(true);
    setSelectedImage(null);

    const res = await uploadProductImage(croppedFile);
    
    if (res.error || !res.url) {
      alert(res.error || "Gagal upload");
      setIsUploading(false);
      return;
    }

    const saveRes = await saveCarouselImage(res.url);
    
    if (saveRes.error) {
      alert(saveRes.error);
    } else if (saveRes.data) {
      setImages((prev) => [...prev, saveRes.data as CarouselImage]);
      router.refresh();
    }
    
    setIsUploading(false);
  }

  async function confirmDelete() {
    if (!deletingId) return;
    const img = images.find((i) => i.id === deletingId);
    if (!img) return;

    setIsDeleting(true);
    setImages((prev) => prev.filter((i) => i.id !== deletingId));
    
    await deleteCarouselImage(deletingId, img.imageUrl);
    await deleteProductImage(img.imageUrl);
    
    setDeletingId(null);
    setIsDeleting(false);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Grid: Ubah jadi 2 kolom di HP, 2 di Tablet, 3 di Desktop agar gambar lebih besar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        
        {/* Tombol Tambah */}
        <label className="flex aspect-[21/9] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-neutral-200 bg-white transition-colors hover:border-yumm-pink hover:bg-yumm-pink/5">
          {isUploading ? (
            <Loader2 size={24} className="animate-spin text-yumm-pink" />
          ) : (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yumm-pink/10">
                <Plus size={20} className="text-yumm-pink" />
              </div>
              <span className="font-display text-xs font-semibold text-ink-muted">
                Upload Gambar
              </span>
            </>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </label>

        {/* List Gambar */}
        {images.map((img) => (
          <div key={img.id} className="group relative aspect-[21/9] overflow-hidden rounded-2xl border border-neutral-200 bg-surface-muted shadow-sm">
            <Image
              src={img.imageUrl}
              alt="Carousel"
              fill
              className="object-cover"
            />
            
            {/* Overlay Hover & Tombol Hapus */}
            <div className="absolute inset-0 bg-ink/30 opacity-0 transition-opacity group-hover:opacity-100" />
            <button
              type="button"
              onClick={() => setDeletingId(img.id)}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-yumm-coral shadow-md opacity-0 backdrop-blur-sm transition-all hover:scale-110 group-hover:opacity-100"
              title="Hapus gambar"
            >
              <Trash2 size={14} />
            </button>
            
            {/* Dialog Konfirmasi Kustom di dalam Card */}
            {deletingId === img.id && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-ink/80 backdrop-blur-sm p-3 text-center">
                <p className="text-xs font-semibold text-white">Hapus gambar ini?</p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setDeletingId(null)}
                    disabled={isDeleting}
                    className="rounded-full bg-white/20 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-white/30 disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-1.5 rounded-full bg-yumm-coral px-3 py-1.5 text-[10px] font-bold text-white hover:bg-red-600 disabled:opacity-50"
                  >
                    {isDeleting ? <Loader2 size={10} className="animate-spin" /> : "Hapus"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Cropper */}
      {selectedImage && (
        <ImageCropper
          imageSrc={selectedImage}
          onCropComplete={handleCropComplete}
          onCancel={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}