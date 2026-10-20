"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Cake } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CarouselImage } from "@/features/carousel/queries";

export function MenuCarousel({ images = [] }: { images?: CarouselImage[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-muted sm:aspect-[21/9]">
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-yumm-pink/20 via-yumm-lilac/20 to-yumm-mint/20">
          <Cake size={48} className="text-yumm-pink/40" />
          <p className="mt-4 font-display text-sm font-bold text-ink-muted">Belum ada promo minggu ini</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-muted sm:aspect-[21/9]">
      {images.map((img, idx) => (
        <div
          key={img.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-in-out",
            idx === current ? "z-10 opacity-100" : "z-0 opacity-0"
          )}
        >
          <Image
            src={img.imageUrl}
            alt={`Carousel ${idx + 1}`}
            fill
            className="object-cover"
            priority={idx === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
        </div>
      ))}
      
      <div className="absolute bottom-5 right-5 z-20 flex gap-1.5 sm:bottom-8 sm:right-8">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Slide ${idx + 1}`}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              idx === current ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
            )}
          />
        ))}
      </div>
    </div>
  );
}