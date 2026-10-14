"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/lib/icons";

interface CopyCodeButtonProps {
  code: string;
}

export function CopyCodeButton({ code }: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Diamkan; user bisa salin manual
      }
      document.body.removeChild(textarea);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-2 rounded-yumm border px-4 py-2",
        "font-display text-xs font-semibold transition-all duration-200",
        copied
          ? "border-emerald-500 bg-yumm-mint/30 text-emerald-700"
          : "border-yumm-pink/40 bg-white text-yumm-pink hover:bg-yumm-pink/5"
      )}
      aria-live="polite"
    >
      {copied ? (
        <>
          <Check size={ICON_SIZE.sm} />
          <span>Tersalin!</span>
        </>
      ) : (
        <>
          <Copy size={ICON_SIZE.sm} />
          <span>Salin kode</span>
        </>
      )}
    </button>
  );
}