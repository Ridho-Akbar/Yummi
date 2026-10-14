"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { setUserRole, type SetRoleState } from "@/features/users/actions";
import type { UserRole } from "@/features/users/types";

interface UserRoleButtonProps {
  userId: string;
  currentRole: UserRole;
  viewerRole: UserRole;
  isSelf: boolean;
}

const initialState: SetRoleState = {};

export function UserRoleButton({
  userId,
  currentRole,
  viewerRole,
  isSelf,
}: UserRoleButtonProps) {
  const [state, formAction] = useActionState(setUserRole, initialState);

  if (isSelf) {
    return (
      <span className="text-xs italic text-ink-muted">(kamu sendiri)</span>
    );
  }

  const viewerIsSuperadmin = viewerRole === "superadmin";
  const viewerIsAdmin = viewerRole === "admin";

  // Admin biasa tidak bisa menyentuh superadmin
  if (viewerIsAdmin && currentRole === "superadmin") {
    return (
      <span className="text-xs italic text-ink-muted">
        Hanya superadmin
      </span>
    );
  }

  // Tentukan tombol berdasarkan role target
  // - user      → "Jadikan admin"
  // - admin     → "Cabut admin" (dan superadmin bisa promote ke superadmin)
  // - superadmin→ "Turunkan jadi admin" (hanya superadmin)

  const buttons: {
    label: string;
    targetRole: UserRole;
    variant: "promote" | "demote";
  }[] = [];

  if (currentRole === "user") {
    buttons.push({
      label: "Jadikan admin",
      targetRole: "admin",
      variant: "promote",
    });
  } else if (currentRole === "admin") {
    buttons.push({
      label: "Cabut admin",
      targetRole: "user",
      variant: "demote",
    });
    if (viewerIsSuperadmin) {
      buttons.push({
        label: "Jadikan superadmin",
        targetRole: "superadmin",
        variant: "promote",
      });
    }
  } else if (currentRole === "superadmin") {
    if (viewerIsSuperadmin) {
      buttons.push({
        label: "Turunkan jadi admin",
        targetRole: "admin",
        variant: "demote",
      });
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      {buttons.map((btn) => (
        <form key={btn.targetRole} action={formAction}>
          <input type="hidden" name="userId" value={userId} />
          <input type="hidden" name="role" value={btn.targetRole} />
          <SubmitButton label={btn.label} variant={btn.variant} />
        </form>
      ))}
      {state.error && (
        <p className="w-full text-right text-xs text-yumm-coral">
          {state.error}
        </p>
      )}
    </div>
  );
}

interface SubmitButtonProps {
  label: string;
  variant: "promote" | "demote";
}

function SubmitButton({ label, variant }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "shrink-0 rounded-yumm border px-3 py-1.5 font-display text-xs font-semibold transition-colors",
        variant === "promote"
          ? "border-yumm-pink/40 text-yumm-pink hover:bg-yumm-pink/10"
          : "border-yumm-coral/40 text-yumm-coral hover:bg-yumm-coral/10",
        pending && "opacity-50"
      )}
    >
      {pending ? "Menyimpan..." : label}
    </button>
  );
}