"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface PriceInputProps {
  name: string;
  defaultValue?: number;
  error?: string;
  hint?: string;
}

export function PriceInput({
  name,
  defaultValue,
  error,
  hint,
}: PriceInputProps) {
  const [value, setValue] = useState(
    defaultValue !== undefined && defaultValue > 0 ? String(defaultValue) : ""
  );

  function handleBlur() {
    const digits = value.replace(/\D/g, "");
    if (!digits) {
      setValue("");
      return;
    }

    const num = Number(digits);
    if (!Number.isFinite(num) || num <= 0) {
      setValue("");
      return;
    }

    // Kalau nilai di bawah Rp1.000, anggap user mengetik dalam ribuan.
    // Contoh: 23 → 23.000, 500 → 500.000. Nilai ≥ 1.000 dibiarkan.
    const final = num < 1000 ? num * 1000 : num;
    setValue(String(final));
  }

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="block font-display text-xs font-semibold uppercase tracking-wide text-ink-muted"
      >
        Harga (Rp)
      </label>
      <input
        id={name}
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        placeholder="Ketik 150 untuk Rp150.000, atau 150000"
        className={cn(
          "w-full rounded-yumm border border-neutral-200 bg-surface px-4 py-2.5",
          "font-body text-sm text-ink placeholder:text-ink-muted/50",
          "focus:border-yumm-pink focus:outline-hidden focus:ring-2 focus:ring-yumm-pink/20",
          error && "border-yumm-coral"
        )}
      />
      <input type="hidden" name={name} value={value.replace(/\D/g, "")} />
      {hint && !error && <p className="text-xs text-ink-muted">{hint}</p>}
      {error && <p className="text-xs text-yumm-coral">{error}</p>}
    </div>
  );
}
