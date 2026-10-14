"use client";

import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/lib/icons";

interface FloatingButtonProps {
  whatsappUrl: string;
}

export function FloatingButton({ whatsappUrl }: FloatingButtonProps) {
  const [mode, setMode] = useState<"whatsapp" | "top">("whatsapp");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    function handleScroll() {
      if (ticking) return;

      ticking = true;
      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY;

        // Tampilkan tombol setelah user scroll dari titik awal
        if (currentY > 200) {
          setVisible(true);
        } else {
          setVisible(false);
        }

        // Tentukan mode berdasarkan arah scroll
        // Scroll ke bawah → WhatsApp
        // Scroll ke atas → Scroll to top
        if (Math.abs(delta) > 4) {
          setMode(delta > 0 ? "whatsapp" : "top");
          lastScrollY = currentY;
        }

        ticking = false;
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleClick() {
    if (mode === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  const isTop = mode === "top";
  const Icon = isTop ? ArrowUp : MessageCircle;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isTop ? "Kembali ke atas" : "Chat WhatsApp"}
      className={cn(
        "fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lg",
        "transition-all duration-300",
        "hover:scale-110 active:scale-95",
        "sm:bottom-6 sm:right-6 sm:h-14 sm:w-14",
        isTop
          ? "bg-ink text-white"
          : "bg-emerald-500 text-white shadow-emerald-500/30",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <Icon
        size={ICON_SIZE.lg}
        strokeWidth={2.5}
        className={cn(
          "transition-transform duration-300",
          !isTop && "translate-y-0"
        )}
      />
    </button>
  );
}
