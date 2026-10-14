"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/lib/icons";
import { Button } from "@/components/ui/Button";
import type { SettingsState } from "@/features/site/actions";

interface RepeaterItem {
  title: string;
  desc: string;
}

interface RepeaterFormProps {
  action: (
    prevState: SettingsState,
    formData: FormData
  ) => Promise<SettingsState>;
  initialItems: RepeaterItem[];
  sectionTitle: string;
  description: string;
  minItems: number;
  maxItems: number;
  titlePlaceholder: string;
  descPlaceholder: string;
  emptyMessage: string;
}

const initialState: SettingsState = {};

export function RepeaterForm({
  action,
  initialItems,
  sectionTitle,
  description,
  minItems,
  maxItems,
  titlePlaceholder,
  descPlaceholder,
  emptyMessage,
}: RepeaterFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const [items, setItems] = useState<RepeaterItem[]>(
    initialItems.length > 0 ? initialItems : []
  );

  function addItem() {
    if (items.length >= maxItems) return;
    setItems((prev) => [...prev, { title: "", desc: "" }]);
  }

  function removeItem(index: number) {
    if (items.length <= minItems) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof RepeaterItem, value: string) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
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
    <form
      action={formAction}
      className="space-y-5 rounded-yumm-lg border border-neutral-100 bg-white p-5 shadow-sm sm:p-6"
    >
      <header>
        <h2 className="font-display text-base font-bold text-ink">
          {sectionTitle}
        </h2>
        <p className="mt-1 text-xs text-ink-muted">{description}</p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-yumm border border-dashed border-neutral-200 px-4 py-8 text-center">
          <p className="text-sm text-ink-muted">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="rounded-yumm border border-neutral-100 bg-surface/50 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yumm-pink/10 font-display text-xs font-bold text-yumm-pink">
                    {index + 1}
                  </span>
                  <span className="font-display text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    Item {index + 1}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    aria-label="Naikkan"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(index)}
                    disabled={index === items.length - 1}
                    aria-label="Turunkan"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    disabled={items.length <= minItems}
                    aria-label="Hapus item"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-yumm-coral transition-colors hover:bg-yumm-coral/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Trash2 size={14} strokeWidth={2.2} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label
                    htmlFor={`item-${index}-title`}
                    className="block font-display text-[10px] font-semibold uppercase tracking-wide text-ink-muted"
                  >
                    Judul
                  </label>
                  <input
                    id={`item-${index}-title`}
                    name={`items[${index}].title`}
                    type="text"
                    value={item.title}
                    onChange={(e) =>
                      updateItem(index, "title", e.target.value)
                    }
                    placeholder={titlePlaceholder}
                    className="w-full rounded-yumm border border-neutral-200 bg-white px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink-muted/50 focus:border-yumm-pink focus:outline-hidden focus:ring-2 focus:ring-yumm-pink/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor={`item-${index}-desc`}
                    className="block font-display text-[10px] font-semibold uppercase tracking-wide text-ink-muted"
                  >
                    Deskripsi
                  </label>
                  <textarea
                    id={`item-${index}-desc`}
                    name={`items[${index}].desc`}
                    rows={2}
                    value={item.desc}
                    onChange={(e) => updateItem(index, "desc", e.target.value)}
                    placeholder={descPlaceholder}
                    className="w-full rounded-yumm border border-neutral-200 bg-white px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink-muted/50 focus:border-yumm-pink focus:outline-hidden focus:ring-2 focus:ring-yumm-pink/20"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length < maxItems && (
        <button
          type="button"
          onClick={addItem}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-yumm border-2 border-dashed border-neutral-200 py-3",
            "font-display text-sm font-semibold text-ink-muted transition-colors",
            "hover:border-yumm-pink hover:bg-yumm-pink/5 hover:text-yumm-pink"
          )}
        >
          <Plus size={ICON_SIZE.sm} strokeWidth={2.5} />
          Tambah item
        </button>
      )}

      <p className="text-xs text-ink-muted">
        {items.length} dari maksimal {maxItems} item
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
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Menyimpan..." : "Simpan"}
    </Button>
  );
}
