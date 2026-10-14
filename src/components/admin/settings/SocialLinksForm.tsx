"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/lib/icons";
import { Button } from "@/components/ui/Button";
import {
  saveSocialLinks,
  type SocialLinkState,
} from "@/features/social-links/actions";
import {
  SOCIAL_PLATFORMS,
  type SocialLink,
  type SocialLinkDraft,
} from "@/features/social-links/types";

interface SocialLinksFormProps {
  initial: SocialLink[];
}

const initialState: SocialLinkState = {};

function toDraft(links: SocialLink[]): SocialLinkDraft[] {
  return links.map((l) => ({
    id: l.id,
    platform: l.platform,
    url: l.url,
    isActive: l.isActive,
  }));
}

export function SocialLinksForm({ initial }: SocialLinksFormProps) {
  const [state, formAction] = useActionState(saveSocialLinks, initialState);
  const [items, setItems] = useState<SocialLinkDraft[]>(toDraft(initial));

  function addItem() {
    setItems((prev) => [
      ...prev,
      { id: null, platform: "instagram", url: "", isActive: true },
    ]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem<K extends keyof SocialLinkDraft>(
    index: number,
    field: K,
    value: SocialLinkDraft[K]
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
    <form
      action={formAction}
      className="space-y-5 rounded-yumm-lg border border-neutral-100 bg-white p-5 shadow-sm sm:p-6"
    >
      <header>
        <h2 className="font-display text-base font-bold text-ink">
          Sosial Media
        </h2>
        <p className="mt-1 text-xs text-ink-muted">
          Link ke akun sosial media. Tampil di footer halaman depan.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-yumm border border-dashed border-neutral-200 px-4 py-8 text-center">
          <p className="text-sm text-ink-muted">
            Belum ada sosial media. Tambah link pertama.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="rounded-yumm border border-neutral-100 bg-surface/50 p-4"
            >
              <input
                type="hidden"
                name={`items[${index}].id`}
                value={item.id ?? ""}
              />

              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="font-display text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Link {index + 1}
                </span>
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
                    aria-label="Hapus"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-yumm-coral transition-colors hover:bg-yumm-coral/10"
                  >
                    <Trash2 size={14} strokeWidth={2.2} />
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
                <div className="space-y-1.5">
                  <label
                    htmlFor={`social-${index}-platform`}
                    className="block font-display text-[10px] font-semibold uppercase tracking-wide text-ink-muted"
                  >
                    Platform
                  </label>
                  <select
                    id={`social-${index}-platform`}
                    name={`items[${index}].platform`}
                    value={item.platform}
                    onChange={(e) =>
                      updateItem(index, "platform", e.target.value)
                    }
                    className="w-full rounded-yumm border border-neutral-200 bg-white px-3 py-2.5 font-body text-sm text-ink focus:border-yumm-pink focus:outline-hidden focus:ring-2 focus:ring-yumm-pink/20"
                  >
                    {SOCIAL_PLATFORMS.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor={`social-${index}-url`}
                    className="block font-display text-[10px] font-semibold uppercase tracking-wide text-ink-muted"
                  >
                    URL
                  </label>
                  <input
                    id={`social-${index}-url`}
                    name={`items[${index}].url`}
                    type="url"
                    value={item.url}
                    onChange={(e) =>
                      updateItem(index, "url", e.target.value)
                    }
                    placeholder="https://instagram.com/yummi"
                    className="w-full rounded-yumm border border-neutral-200 bg-white px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink-muted/50 focus:border-yumm-pink focus:outline-hidden focus:ring-2 focus:ring-yumm-pink/20"
                  />
                </div>
              </div>

              <label className="mt-3 flex items-center gap-2">
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
                  Tampilkan di footer
                </span>
              </label>
            </div>
          ))}
        </div>
      )}

      {items.length < 10 && (
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
          Tambah sosial media
        </button>
      )}

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
