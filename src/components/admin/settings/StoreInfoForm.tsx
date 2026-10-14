"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  updateStoreInfo,
  type SettingsState,
} from "@/features/site/actions";
import type { StoreInfo } from "@/features/site/types";

interface StoreInfoFormProps {
  initial: StoreInfo;
}

const initialState: SettingsState = {};

export function StoreInfoForm({ initial }: StoreInfoFormProps) {
  const [state, formAction] = useActionState(updateStoreInfo, initialState);
  const fieldErrors = state.fieldErrors ?? {};

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-yumm-lg border border-neutral-100 bg-white p-5 shadow-sm sm:p-6"
    >
      <header>
        <h2 className="font-display text-base font-bold text-ink">
          Info Toko
        </h2>
        <p className="mt-1 text-xs text-ink-muted">
          Data ini tampil di footer dan halaman kontak.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Nama toko"
          name="name"
          defaultValue={initial.name}
          placeholder="Yumm!"
          error={fieldErrors.name?.[0]}
          required
        />
        <Field
          label="Tagline singkat"
          name="tagline"
          defaultValue={initial.tagline}
          placeholder="Pre-order makanan viral"
          error={fieldErrors.tagline?.[0]}
        />
        <Field
          label="Nomor telepon"
          name="phone"
          defaultValue={initial.phone}
          placeholder="0812-3456-7890"
          error={fieldErrors.phone?.[0]}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          defaultValue={initial.email}
          placeholder="hello@yummi.id"
          error={fieldErrors.email?.[0]}
        />
      </div>

      <Field
        label="Alamat lengkap"
        name="address"
        textarea
        defaultValue={initial.address}
        placeholder="Jalan, nomor, kelurahan, kecamatan, kota"
        error={fieldErrors.address?.[0]}
      />

      <Field
        label="Jam operasional"
        name="hours"
        defaultValue={initial.hours}
        placeholder="Senin - Sabtu, 08.00 - 20.00"
        error={fieldErrors.hours?.[0]}
      />

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

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  defaultValue?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

function Field({
  label,
  name,
  type = "text",
  textarea,
  defaultValue,
  placeholder,
  error,
  required,
}: FieldProps) {
  const baseClass = cn(
    "w-full rounded-yumm border border-neutral-200 bg-surface px-4 py-2.5",
    "font-body text-sm text-ink placeholder:text-ink-muted/50",
    "focus:border-yumm-pink focus:outline-hidden focus:ring-2 focus:ring-yumm-pink/20",
    error && "border-yumm-coral"
  );

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="block font-display text-xs font-semibold uppercase tracking-wide text-ink-muted"
      >
        {label}
        {required && <span className="ml-1 text-yumm-coral">*</span>}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={3}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={baseClass}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={baseClass}
        />
      )}
      {error && <p className="text-xs text-yumm-coral">{error}</p>}
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
