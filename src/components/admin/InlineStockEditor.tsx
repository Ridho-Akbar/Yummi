"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { Loader2, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { adjustReadyStock, updateReadyStock } from "@/features/products/actions";

interface InlineStockEditorProps {
  productId: string;
  currentStock: number;
}

export function InlineStockEditor({
  productId,
  currentStock,
}: InlineStockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(String(currentStock));
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) setValue(String(currentStock));
  }, [currentStock, isEditing]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  function handleAdjust(delta: number) {
    if (currentStock + delta < 0) return;
    
    startTransition(async () => {
      await adjustReadyStock(productId, delta);
    });
  }

  function handleSave() {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 0 || num === currentStock) {
      setIsEditing(false);
      setValue(String(currentStock));
      return;
    }

    setIsEditing(false);
    startTransition(async () => {
      const res = await updateReadyStock(productId, num);
      if (res.error) {
        setValue(String(currentStock));
        alert(res.error);
      }
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setIsEditing(false);
      setValue(String(currentStock));
    }
  }

  if (isPending) {
    return (
      <div className="flex h-8 w-[104px] items-center justify-center rounded-yumm border border-neutral-100 bg-surface-muted">
        <Loader2 size={14} className="animate-spin text-yumm-pink" />
      </div>
    );
  }

  return (
    <div className="flex h-8 w-[104px] items-center justify-between rounded-yumm border border-neutral-200 bg-white p-0.5">
      <button
        type="button"
        onClick={() => handleAdjust(-1)}
        disabled={currentStock <= 0}
        className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <Minus size={14} strokeWidth={2.5} />
      </button>

      {isEditing ? (
        <input
          ref={inputRef}
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="h-7 w-9 appearance-none bg-transparent text-center font-display text-sm font-bold text-ink outline-none [&::-webkit-inner-spin-button]:appearance-none"
          min={0}
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className={cn(
            "h-7 w-9 rounded-md font-display text-sm font-bold transition-colors hover:bg-surface-muted",
            currentStock < 3 ? "text-yumm-coral" : "text-ink"
          )}
          title="Klik untuk ubah manual"
        >
          {currentStock}
        </button>
      )}

      <button
        type="button"
        onClick={() => handleAdjust(1)}
        className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-muted hover:text-yumm-pink"
      >
        <Plus size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}