"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  updateFooter,
  type SettingsState,
} from "@/features/site/actions";
import type { FooterContent } from "@/features/site/types";

interface FooterFormProps {
  initial: FooterContent;
}

const initialState: SettingsState = {};

export function FooterForm({ initial }: FooterFormProps) {
  const [state, formAction] = useActionState(updateFooter, initialState);
  const fieldErrors = state.fieldErrors ?? {};

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-yumm-lg border border-neutral-100 bg-white p-5 shadow-sm sm:p-6"
    >
      <header>
        <h2 className="font-display text-base font-bold text-ink">
          Footer
        </h2>
        <p className="mt-1 text-xs text-ink-muted">
          Teks yang tampil di bagian paling bawah halaman depan.
        </p>
      </header>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="tagline"
            className="block font-display text-xs font-semibold uppercase tracking-wide text-ink-muted"
          >
            Tagline footer
          </label>
          <input
            id="tagline"
            name="tagline"
            type="text"
            defaultValue={initial.tagline}
            placeholder="Kue buatan tangan, dibuat segar untuk setiap acara."
            className={cn(
              "w-full rounded-yumm border border-neutral-200 bg-surface px-4 py-2.5",
              "font-body text-sm text-ink placeholder:text-ink-muted/50",
              "focus:border-yumm-pink focus:outline-hidden focus:ring-2 focus:ring-yumm-pink/20",
              fieldErrors.tagline && "border-yumm-coral"
            )}
          />
          {fieldErrors.tagline && (
            <p className="text-xs text-yumm-coral">
              {fieldErrors.tagline[0]}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="copyright"
            className="block font-display text-xs font-semibold uppercase tracking-wide text-ink-muted"
          >
            Copyright
          </label>
          <input
            id="copyright"
            name="copyright"
            type="text"
            defaultValue={initial.copyright}
            placeholder="©Copyright 2026"
            className={cn(
              "w-full rounded-yumm border border-neutral-200 bg-surface px-4 py-2.5",
              "font-body text-sm text-ink placeholder:text-ink-muted/50",
              "focus:border-yumm-pink focus:outline-hidden focus:ring-2 focus:ring-yumm-pink/20",
              fieldErrors.copyright && "border-yumm-coral"
            )}
          />
          <p className="text-xs text-ink-muted">
            Nama toko, alamat, dan jam buka diambil otomatis dari pengaturan
            Info Toko.
          </p>
          {fieldErrors.copyright && (
            <p className="text-xs text-yumm-coral">
              {fieldErrors.copyright[0]}
            </p>
          )}
        </div>
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
