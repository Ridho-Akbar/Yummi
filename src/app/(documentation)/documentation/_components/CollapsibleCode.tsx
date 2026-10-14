"use client";

import { useState } from "react";
import { Check, ChevronDown, Copy, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/lib/icons";

interface CollapsibleCodeProps {
  title: string;
  description?: string;
  code: string;
  language?: string;
  defaultOpen?: boolean;
}

export function CollapsibleCode({
  title,
  description,
  code,
  language = "sql",
  defaultOpen = false,
}: CollapsibleCodeProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback untuk browser yang tidak izinkan clipboard
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
        // diam
      }
      document.body.removeChild(textarea);
    }
  }

  return (
    <div className="overflow-hidden rounded-yumm-lg border border-neutral-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-surface-muted/50"
        aria-expanded={open}
      >
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yumm-lilac/15 text-yumm-lilac">
            <Terminal size={14} strokeWidth={2.5} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-bold text-ink">{title}</p>
            {description && (
              <p className="mt-1 text-xs text-ink-muted">{description}</p>
            )}
          </div>
        </div>
        <ChevronDown
          size={ICON_SIZE.md}
          strokeWidth={2.5}
          className={cn(
            "mt-1 shrink-0 text-ink-muted transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="relative border-t border-neutral-100 bg-ink/[0.02]">
          <div className="absolute right-3 top-3 z-10 flex gap-1">
            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                "flex h-8 items-center gap-1.5 rounded-yumm border border-neutral-200 bg-white px-2.5",
                "font-display text-[11px] font-semibold transition-colors",
                copied
                  ? "border-emerald-500 text-emerald-700"
                  : "text-ink-muted hover:border-yumm-pink hover:text-yumm-pink"
              )}
              aria-label="Salin kode"
            >
              {copied ? (
                <>
                  <Check size={12} strokeWidth={3} />
                  Tersalin
                </>
              ) : (
                <>
                  <Copy size={12} strokeWidth={2.5} />
                  Salin
                </>
              )}
            </button>
          </div>

          <pre className="scrollbar-yumm max-h-[500px] overflow-auto p-5 pr-16">
            <code className="font-mono text-[12px] leading-relaxed text-ink">
              {code}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
}
