"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, KeyRound, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/lib/icons";
import { Button } from "@/components/ui/Button";
import {
  updateOrderPassword,
  type SettingsState,
} from "@/features/site/actions";
import type { OrderAccess } from "@/features/site/types";

interface OrderPasswordFormProps {
  initial: OrderAccess;
}

const initialState: SettingsState = {};

export function OrderPasswordForm({ initial }: OrderPasswordFormProps) {
  const [state, formAction] = useActionState(
    updateOrderPassword,
    initialState
  );
  const fieldErrors = state.fieldErrors ?? {};

  const hasPassword = Boolean(initial.passwordHash);
  const updatedAt = initial.updatedAt
    ? new Date(initial.updatedAt).toLocaleString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-yumm-lg border border-neutral-100 bg-white p-5 shadow-sm sm:p-6"
    >
      <header>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full",
              hasPassword
                ? "bg-yumm-mint/30 text-emerald-700"
                : "bg-yumm-coral/15 text-yumm-coral"
            )}
          >
            {hasPassword ? (
              <ShieldCheck size={18} strokeWidth={2.2} />
            ) : (
              <AlertCircle size={18} strokeWidth={2.2} />
            )}
          </span>
          <div>
            <h2 className="font-display text-base font-bold text-ink">
              Sandi Akses Order
            </h2>
            <p className="mt-0.5 text-xs text-ink-muted">
              Sandi yang diberikan ke pelanggan anonim supaya bisa memesan.
            </p>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "rounded-yumm border px-4 py-3 text-xs",
          hasPassword
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border-yumm-coral/30 bg-yumm-coral/10 text-yumm-coral"
        )}
      >
        {hasPassword ? (
          <>
            <strong>Sandi sudah diatur.</strong>
            {updatedAt && (
              <span className="ml-1 text-emerald-700">
                Terakhir diperbarui: {updatedAt}.
              </span>
            )}
          </>
        ) : (
          <>
            <strong>Belum ada sandi kustom.</strong> Sistem masih memakai
            nilai dari environment <code>ADMIN_ORDER_PASSWORD</code>. Isi
            form di bawah untuk memindahkannya ke database.
          </>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="newPassword"
            className="flex items-center gap-1.5 font-display text-xs font-semibold uppercase tracking-wide text-ink-muted"
          >
            <KeyRound size={12} strokeWidth={2.5} />
            Sandi baru
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Minimal 6 karakter"
            className={cn(
              "w-full rounded-yumm border border-neutral-200 bg-surface px-4 py-2.5",
              "font-body text-sm text-ink placeholder:text-ink-muted/50",
              "focus:border-yumm-pink focus:outline-hidden focus:ring-2 focus:ring-yumm-pink/20",
              fieldErrors.newPassword && "border-yumm-coral"
            )}
          />
          {fieldErrors.newPassword && (
            <p className="text-xs text-yumm-coral">
              {fieldErrors.newPassword[0]}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="confirmPassword"
            className="flex items-center gap-1.5 font-display text-xs font-semibold uppercase tracking-wide text-ink-muted"
          >
            <KeyRound size={12} strokeWidth={2.5} />
            Konfirmasi sandi baru
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Ulangi sandi baru"
            className={cn(
              "w-full rounded-yumm border border-neutral-200 bg-surface px-4 py-2.5",
              "font-body text-sm text-ink placeholder:text-ink-muted/50",
              "focus:border-yumm-pink focus:outline-hidden focus:ring-2 focus:ring-yumm-pink/20",
              fieldErrors.confirmPassword && "border-yumm-coral"
            )}
          />
          {fieldErrors.confirmPassword && (
            <p className="text-xs text-yumm-coral">
              {fieldErrors.confirmPassword[0]}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-yumm bg-surface-muted px-4 py-3 text-xs text-ink-muted">
        <strong>Tips:</strong> Setelah menyimpan, segera beritahu pelanggan
        yang butuh sandi baru lewat WhatsApp. Sandi lama akan otomatis tidak
        berlaku.
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
        <SubmitButton hasPassword={hasPassword} />
      </div>
    </form>
  );
}

function SubmitButton({ hasPassword }: { hasPassword: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending
        ? "Menyimpan..."
        : hasPassword
        ? "Perbarui sandi"
        : "Simpan sandi"}
    </Button>
  );
}
