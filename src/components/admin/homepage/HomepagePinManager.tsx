"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/lib/icons";
import { Button } from "@/components/ui/Button";
import {
  saveHomepagePins,
  type HomepagePinState,
} from "@/features/homepage/actions";
import {
  HOMEPAGE_CATEGORY_INFO,
  type HomepageCategory,
  type HomepagePin,
} from "@/features/homepage/types";
import type { Product } from "@/types";

interface HomepagePinManagerProps {
  initialPins: HomepagePin[];
  products: Product[];
  categoryCounts: Record<HomepageCategory, number>;
}

const initialState: HomepagePinState = {};

type DraftPins = Record<HomepageCategory, string[]>;

const CATEGORIES: HomepageCategory[] = ["latest", "best_seller", "terlaris"];

function buildDraft(
  pins: HomepagePin[],
  products: Product[],
  counts: Record<HomepageCategory, number>
): DraftPins {
  const productIds = new Set(products.map((p) => p.id));
  const draft: DraftPins = {
    latest: [],
    best_seller: [],
    terlaris: [],
  };

  for (const category of CATEGORIES) {
    const categoryPins = pins
      .filter((p) => p.category === category)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .filter((p) => productIds.has(p.productId));

    const slots = Math.max(counts[category] ?? 2, 0);
    const filled = categoryPins.slice(0, slots).map((p) => p.productId);

    while (filled.length < slots) filled.push("");
    draft[category] = filled;
  }

  return draft;
}

export function HomepagePinManager({
  initialPins,
  products,
  categoryCounts,
}: HomepagePinManagerProps) {
  const [state, formAction] = useActionState(
    saveHomepagePins,
    initialState
  );
  const [draft, setDraft] = useState<DraftPins>(() =>
    buildDraft(initialPins, products, categoryCounts)
  );

  function updatePin(
    category: HomepageCategory,
    index: number,
    productId: string
  ) {
    setDraft((prev) => {
      const next = { ...prev };
      const list = [...(next[category] ?? [])];
      list[index] = productId;
      next[category] = list;
      return next;
    });
  }

  function addSlot(category: HomepageCategory) {
    setDraft((prev) => {
      const list = prev[category] ?? [];
      if (list.length >= 6) return prev;
      return { ...prev, [category]: [...list, ""] };
    });
  }

  function removeSlot(category: HomepageCategory, index: number) {
    setDraft((prev) => {
      const list = prev[category] ?? [];
      if (list.length <= 1) return prev;
      return {
        ...prev,
        [category]: list.filter((_, i) => i !== index),
      };
    });
  }

  return (
    <form action={formAction} className="space-y-6">
      <div className="rounded-yumm-lg border border-yumm-lemon/40 bg-yumm-lemon/10 px-4 py-3 text-xs text-ink">
        <strong>Catatan:</strong> Slot yang dikosongkan akan diisi otomatis
        oleh sistem berdasarkan kategori (produk terbaru, terlaris, atau best
        seller). Isi slot manual kalau ingin mem-pin produk tertentu.
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {CATEGORIES.map((category) => (
          <CategoryColumn
            key={category}
            category={category}
            products={products}
            slots={draft[category] ?? []}
            onUpdate={(index, productId) =>
              updatePin(category, index, productId)
            }
            onAdd={() => addSlot(category)}
            onRemove={(index) => removeSlot(category, index)}
          />
        ))}
      </div>

      <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-yumm-lg border border-neutral-100 bg-white/95 p-4 shadow-lg backdrop-blur-sm">
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

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-ink-muted">
            Setiap kategori maksimal 6 slot. Slot kosong = otomatis.
          </p>
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}

interface CategoryColumnProps {
  category: HomepageCategory;
  products: Product[];
  slots: string[];
  onUpdate: (index: number, productId: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

function CategoryColumn({
  category,
  products,
  slots,
  onUpdate,
  onAdd,
  onRemove,
}: CategoryColumnProps) {
  const info = HOMEPAGE_CATEGORY_INFO[category];

  return (
    <div className="rounded-yumm-lg border border-neutral-100 bg-white p-4 shadow-sm">
      <header className="mb-4">
        <h3 className="font-display text-base font-bold text-ink">
          {info.label}
        </h3>
        <p className="mt-1 text-xs text-ink-muted">{info.description}</p>
      </header>

      <div className="space-y-2">
        {slots.map((productId, index) => {
          const selected = products.find((p) => p.id === productId);
          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yumm-pink/10 font-display text-[10px] font-bold text-yumm-pink">
                  {index + 1}
                </span>
                <select
                  name={`${category}[${index}]`}
                  value={productId}
                  onChange={(e) => onUpdate(index, e.target.value)}
                  className="w-full min-w-0 flex-1 rounded-yumm border border-neutral-200 bg-surface px-3 py-2 font-body text-xs text-ink focus:border-yumm-pink focus:outline-hidden focus:ring-2 focus:ring-yumm-pink/20"
                >
                  <option value="">Otomatis</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                {slots.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    aria-label="Hapus slot"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-yumm-coral transition-colors hover:bg-yumm-coral/10"
                  >
                    <Trash2 size={13} strokeWidth={2.2} />
                  </button>
                )}
              </div>
              {selected && (
                <p className="pl-8 text-[10px] text-ink-muted">
                  Rp{Number(selected.price).toLocaleString("id-ID")}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {slots.length < 6 && (
        <button
          type="button"
          onClick={onAdd}
          className={cn(
            "mt-3 flex w-full items-center justify-center gap-1.5 rounded-yumm border-2 border-dashed border-neutral-200 py-2",
            "font-display text-xs font-semibold text-ink-muted transition-colors",
            "hover:border-yumm-pink hover:bg-yumm-pink/5 hover:text-yumm-pink"
          )}
        >
          <Plus size={12} strokeWidth={2.5} />
          Tambah slot
        </button>
      )}
    </div>
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
