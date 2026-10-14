"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  updateWhatsapp,
  type SettingsState,
} from "@/features/site/actions";
import type { WhatsappConfig } from "@/features/site/types";

interface WhatsappFormProps {
  initial: WhatsappConfig;
}

const initialState: SettingsState = {};

export function WhatsappForm({ initial }: WhatsappFormProps) {
  const [state, formAction] = useActionState(updateWhatsapp, initialState);
  const fieldErrors = state.fieldErrors ?? {};

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-yumm-lg border border-neutral-100 bg-white p-5 shadow-sm sm:p-6"
    >
      <header>
        <h2 className="font-display text-base font-bold text-ink">
          WhatsApp
        </h2>
        <p className="mt-1 text-xs text-ink-muted">
          Konfigurasi tombol WhatsApp mengambang di halaman depan.
        </p>
      </header>

      <div className="space-y-1.5">
        <label
          htmlFor="url"
          className="block font-display text-xs font-semibold uppercase tracking-wide text-ink-muted"
        >
          URL WhatsApp
        </label>
        <input
          id="url"
          name="url"
          type="url"
          defaultValue={initial.url}
          placeholder="https://wa.me/6281234567890"
          className={cn(
            "w-full rounded-yumm border border-neutral-200 bg-surface px-4 py-2.5",
            "font-body text-sm text-ink placeholder:text-ink-muted/50",
            "focus:border-yumm-pink focus:outline-hidden focus:ring-2 focus:ring-yumm-pink/20",
            fieldErrors.url && "border-yumm-coral"
          )}
        />
        <p className="text-xs text-ink-muted">
          Format: <code>https://wa.me/62...</code> atau{" "}
          <code>https://wa.me/62...?text=...</code> untuk pesan otomatis.
        </p>
        {fieldErrors.url && (
          <p className="text-xs text-yumm-coral">{fieldErrors.url[0]}</p>
        )}
      </div>

      <label className="flex items-start gap-3 rounded-yumm border border-neutral-100 px-4 py-3">
        <input
          type="checkbox"
          name="floatingEnabled"
          defaultChecked={initial.floatingEnabled}
          className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-yumm-pink focus:ring-yumm-pink"
        />
        <div>
          <span className="block font-display text-sm font-semibold text-ink">
            Aktifkan tombol mengambang
          </span>
          <span className="mt-0.5 block text-xs text-ink-muted">
            Tombol WhatsApp akan muncul di pojok kanan bawah halaman depan.
            Klik untuk membuka chat, klik lagi saat scroll ke atas untuk
            kembali ke atas.
          </span>
        </div>
      </label>

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
