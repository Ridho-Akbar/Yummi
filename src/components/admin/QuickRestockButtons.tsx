"use client";

import { useTransition } from "react";
import { cn } from "@/lib/utils";
import {
  adjustReadyStock,
  setReadyStockToZero,
} from "@/features/products/actions";

interface QuickRestockButtonsProps {
  productId: string;
  currentStock: number;
}

const QUICK_BUTTONS: { label: string; delta: number }[] = [
  { label: "−10", delta: -10 },
  { label: "−1", delta: -1 },
  { label: "+1", delta: 1 },
  { label: "+10", delta: 10 },
];

export function QuickRestockButtons({
  productId,
  currentStock,
}: QuickRestockButtonsProps) {
  const [isPending, startTransition] = useTransition();

  function handleAdjust(delta: number) {
    startTransition(async () => {
      await adjustReadyStock(productId, delta);
    });
  }

  function handleReset() {
    startTransition(async () => {
      await setReadyStockToZero(productId);
    });
  }

  return (
    <div className="flex items-center gap-1">
      {QUICK_BUTTONS.map((btn) => {
        const wouldGoNegative = currentStock + btn.delta < 0;
        return (
          <button
            key={btn.label}
            type="button"
            disabled={isPending || wouldGoNegative}
            onClick={() => handleAdjust(btn.delta)}
            className={cn(
              "flex h-7 w-8 items-center justify-center rounded-lg",
              "font-display text-[11px] font-bold transition-colors",
              "disabled:cursor-not-allowed disabled:opacity-40",
              btn.delta > 0
                ? "bg-yumm-pink/10 text-yumm-pink hover:bg-yumm-pink/20"
                : "bg-surface-muted text-ink-muted hover:bg-neutral-200"
            )}
          >
            {btn.label}
          </button>
        );
      })}
      <button
        type="button"
        disabled={isPending || currentStock === 0}
        onClick={handleReset}
        className={cn(
          "flex h-7 items-center justify-center rounded-lg px-2",
          "font-display text-[11px] font-bold transition-colors",
          "bg-yumm-coral/10 text-yumm-coral hover:bg-yumm-coral/20",
          "disabled:cursor-not-allowed disabled:opacity-40"
        )}
      >
        0
      </button>
    </div>
  );
}
