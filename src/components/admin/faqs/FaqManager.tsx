"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/lib/icons";
import { Button } from "@/components/ui/Button";
import { saveFaqList, type FaqState } from "@/features/faqs/actions";
import type { Faq, FaqDraft } from "@/features/faqs/types";

interface FaqManagerProps {
  initial: Faq[];
}

const initialState: FaqState = {};

function toDraft(faqs: Faq[]): FaqDraft[] {
  return faqs.map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
    isActive: f.isActive,
  }));
}

export function FaqManager({ initial }: FaqManagerProps) {
  const [state, formAction] = useActionState(saveFaqList, initialState);
  const [items, setItems] = useState<FaqDraft[]>(toDraft(initial));

  function addItem() {
    setItems((prev) => [
      ...prev,
      { id: null, question: "", answer: "", isActive: true },
    ]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem<K extends keyof FaqDraft>(
    index: number,
    field: K,
    value: FaqDraft[K]
  ) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  function moveUp(index: number) {
    if (index === 0) return;
    setItems((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }

  function moveDown(index: number) {
    if (index === items.length - 1) return;
    setItems((prev) => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }

  return (
    <form action={formAction} className="space-y-4">
      {items.length === 0 ? (
        <div className="rounded-yumm-lg border border-dashed border-neutral-200 bg-white px-4 py-12 text-center">
          <p className="text-sm text-ink-muted">
            Belum ada FAQ. Tambah pertanyaan pertama.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className={cn(
                "rounded-yumm-lg border bg-white p-4 shadow-sm transition-opacity",
                item.isActive ? "border-neutral-100" : "border-neutral-100 opacity-60"
              )}
            >
              <input type="hidden" name={`items[${index}].id`} value={item.id ?? ""} />

              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yumm-pink/10 font-display text-xs font-bold text-yumm-pink">
                    {index + 1}
                  </span>
                  <span className="font-display text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    FAQ {index + 1}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    aria-label="Naikkan"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronUp size={14} strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(index)}
                    disabled={index === items.length - 1}
                    aria-label="Turunkan"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronDown size={14} strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    aria-label="Hapus FAQ"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-yumm-coral transition-colors hover:bg-yumm-coral/10"
                  >
                    <Trash2 size={14} strokeWidth={2.2} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label
                    htmlFor={`faq-${index}-question`}
                    className="block font-display text-[10px] font-semibold uppercase tracking-wide text-ink-muted"
                  >
                    Pertanyaan
                  </label>
                  <input
                    id={`faq-${index}-question`}
                    name={`items[${index}].question`}
                    type="text"
                    value={item.question}
                    onChange={(e) =>
                      updateItem(index, "question", e.target.value)
                    }
                    placeholder="Contoh: Bagaimana cara pesan?"
                    className="w-full rounded-yumm border border-neutral-200 bg-surface px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink-muted/50 focus:border-yumm-pink focus:outline-hidden focus:ring-2 focus:ring-yumm-pink/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor={`faq-${index}-answer`}
                    className="block font-display text-[10px] font-semibold uppercase tracking-wide text-ink-muted"
                  >
                    Jawaban
                  </label>
                  <textarea
                    id={`faq-${index}-answer`}
                    name={`items[${index}].answer`}
                    rows={3}
                    value={item.answer}
                    onChange={(e) =>
                      updateItem(index, "answer", e.target.value)
                    }
                    placeholder="Jawaban singkat dan jelas"
                    className="w-full rounded-yumm border border-neutral-200 bg-surface px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink-muted/50 focus:border-yumm-pink focus:outline-hidden focus:ring-2 focus:ring-yumm-pink/20"
                  />
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name={`items[${index}].isActive`}
                    checked={item.isActive}
                    onChange={(e) =>
                      updateItem(index, "isActive", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-neutral-300 text-yumm-pink focus:ring-yumm-pink"
                  />
                  <span className="text-xs text-ink-muted">
                    Tampilkan di halaman depan
                  </span>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length < 20 && (
        <button
          type="button"
          onClick={addItem}
          className="flex w-full items-center justify-center gap-2 rounded-yumm border-2 border-dashed border-neutral-200 bg-white py-3 font-display text-sm font-semibold text-ink-muted transition-colors hover:border-yumm-pink hover:bg-yumm-pink/5 hover:text-yumm-pink"
        >
          <Plus size={ICON_SIZE.sm} strokeWidth={2.5} />
          Tambah FAQ
        </button>
      )}

      <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-yumm-lg border border-neutral-100 bg-white/95 p-4 shadow-lg backdrop-blur-sm">
        <p className="text-xs text-ink-muted">
          {items.length} FAQ · {items.filter((i) => i.isActive).length} aktif
        </p>

        {state.error && (
          <div className="rounded-yumm border border-yumm-coral/30 bg-yumm-coral/10 px-4 py-3 text-sm text-yumm-coral">
            {state.error}
          </div>
        )}
        {state.success && (
          <div className="rounded-yumm border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {state.success}
          </div>
        )}

        <div className="flex justify-end">
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Menyimpan..." : "Simpan semua"}
    </Button>
  );
}
