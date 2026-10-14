"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import {
  updateOrderStatus,
  type UpdateStatusState,
} from "@/features/orders/status-actions";
import {
  orderStatuses,
  type OrderStatus,
} from "@/features/orders/status-schema";

interface StatusChangerProps {
  orderId: string;
  currentStatus: OrderStatus;
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Dikonfirmasi",
  done: "Selesai",
  cancelled: "Dibatalkan",
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "border-yumm-coral bg-yumm-coral/10 text-yumm-coral",
  confirmed: "border-yumm-lilac bg-yumm-lilac/10 text-yumm-lilac",
  done: "border-emerald-500 bg-yumm-mint/20 text-emerald-700",
  cancelled: "border-neutral-300 bg-neutral-100 text-ink-muted",
};

const initialState: UpdateStatusState = {};

export function StatusChanger({
  orderId,
  currentStatus,
}: StatusChangerProps) {
  const [state, formAction] = useActionState(
    updateOrderStatus,
    initialState
  );

  return (
    <div className="space-y-3">
      <p className="font-display text-xs font-semibold uppercase tracking-wide text-ink-muted">
        Ubah status
      </p>

      <div className="flex flex-wrap gap-2">
        {orderStatuses.map((status) => (
          <StatusButton
            key={status}
            orderId={orderId}
            status={status}
            label={STATUS_LABELS[status]}
            active={currentStatus === status}
            formAction={formAction}
          />
        ))}
      </div>

      {state.error && (
        <p className="text-xs text-yumm-coral">{state.error}</p>
      )}
      {state.success && (
        <p className="text-xs text-emerald-600">{state.success}</p>
      )}
    </div>
  );
}

interface StatusButtonProps {
  orderId: string;
  status: OrderStatus;
  label: string;
  active: boolean;
  formAction: (formData: FormData) => void;
}

function StatusButton({
  orderId,
  status,
  label,
  active,
  formAction,
}: StatusButtonProps) {
  const { pending } = useFormStatus();

  return (
    <form action={formAction}>
      <input type="hidden" name="orderId" value={orderId} />
      <input type="hidden" name="status" value={status} />
      <button
        type="submit"
        disabled={active || pending}
        className={cn(
          "rounded-full border-2 px-4 py-1.5",
          "font-display text-xs font-semibold",
          "transition-all duration-150",
          active
            ? STATUS_STYLES[status]
            : "border-neutral-200 bg-white text-ink-muted hover:border-neutral-300 hover:text-ink",
          active && "cursor-default",
          pending && "opacity-50"
        )}
      >
        {label}
      </button>
    </form>
  );
}