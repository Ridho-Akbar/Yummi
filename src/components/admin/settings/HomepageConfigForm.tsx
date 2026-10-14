"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  updateHomepageConfig,
  type SettingsState,
} from "@/features/site/actions";
import type { HomepageConfig } from "@/features/site/types";

interface HomepageConfigFormProps {
  initial: HomepageConfig;
}

const initialState: SettingsState = {};

const CATEGORIES: {
  key: keyof HomepageConfig;
  label: string;
  description: string;
}[] = [
  {
    key: "latestCount",
    label: "Terbaru",
    description: "Produk yang baru ditambahkan.",
  },
  {
    key: "bestSellerCount",
    label: "Best Seller",
    description: "Produk paling laris sepanjang masa.",
  },
  {
    key: "terlarisCount",
    label: "Terlaris",
    description: "Produk paling banyak dipesan dalam 30 hari terakhir.",
  },
];

export function HomepageConfigForm({ initial }: HomepageConfigFormProps) {
  const [state, formAction] = useActionState(
    updateHomepageConfig,
    initialState
  );

  const total =
    initial.latestCount + initial.terlarisCount + initial.bestSellerCount;

  return (
    <div className="space-y-5">
      <form
        action={formAction}
        className="space-y-5 rounded-yumm-lg border border-neutral-100 bg-white p-5 shadow-sm sm:p-6"
      >
        <header>
          <h2 className="font-display text-base font-bold text-ink">
            Jumlah Produk di Homepage
          </h2>
          <p className="mt-1 text-xs text-ink-muted">
            Atur berapa banyak produk yang tampil per kategori.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.key}
              className="rounded-yumm border border-neutral-100 bg-surface/50 p-4"
            >
              <label
                htmlFor={cat.key}
                className="block font-display text-xs font-semibold uppercase tracking-wide text-ink-muted"
              >
                {cat.label}
              </label>
              <input
                id={cat.key}
                name={cat.key}
                type="number"
                min={0}
                max={6}
                defaultValue={initial[cat.key]}
                className={cn(
                  "mt-2 w-full rounded-yumm border border-neutral-200 bg-white px-4 py-2.5",
                  "font-display text-2xl font-bold text-ink",
                  "focus:border-yumm-pink focus:outline-hidden focus:ring-2 focus:ring-yumm-pink/20"
                )}
              />
              <p className="mt-2 text-xs text-ink-muted">{cat.description}</p>
            </div>
          ))}
        </div>

        <div className="rounded-yumm bg-yumm-lemon/20 px-4 py-3 text-xs text-ink">
          <strong>Catatan:</strong> Setiap kategori minimal 0 dan maksimal 6
          produk. Set 0 kalau ingin menyembunyikan kategori tersebut. Total
          saat ini: {total} produk.
        </div>

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

      <div className="rounded-yumm-lg border border-neutral-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-base font-bold text-ink">
              Pin Produk Tertentu
            </h3>
            <p className="mt-1 text-xs text-ink-muted">
              Pilih produk spesifik untuk tampil di homepage. Slot yang
              dikosongkan akan diisi otomatis oleh sistem.
            </p>
          </div>
          <Link
            href="/admin/homepage"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-yumm bg-yumm-pink px-4 py-2 font-display text-xs font-semibold text-white transition-colors hover:bg-yumm-coral"
          >
            Atur Pin
            <ArrowRight size={12} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
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