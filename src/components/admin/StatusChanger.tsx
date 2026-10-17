"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  CheckCircle2,
  Clock,
  Loader2,
  Truck,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/lib/icons";
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

const STATUS_ICONS: Record<OrderStatus, typeof Clock> = {
  pending: Clock,
  confirmed: CheckCircle2,
  done: Truck,
  cancelled: XCircle,
};

const STATUS_STYLES: Record<
  OrderStatus,
  { active: string; inactive: string }
> = {
  pending: {
    active: "border-yumm-coral bg-yumm-coral/10 text-yumm-coral",
    inactive: "border-neutral-200 bg-white text-ink-muted hover:border-yumm-coral hover:text-yumm-coral",
  },
  confirmed: {
    active: "border-yumm-lilac bg-yumm-lilac/15 text-yumm-lilac",
    inactive: "border-neutral-200 bg-white text-ink-muted hover:border-yumm-lilac hover:text-yumm-lilac",
  },
  done: {
    active: "border-emerald-500 bg-yumm-mint/30 text-emerald-700",
    inactive: "border-neutral-200 bg-white text-ink-muted hover:border-emerald-500 hover:text-emerald-700",
  },
  cancelled: {
    active: "border-neutral-400 bg-neutral-200 text-ink",
    inactive: "border-neutral-200 bg-white text-ink-muted hover:border-neutral-400 hover:text-ink",
  },
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
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="orderId" value={orderId} />

      <p className="font-display text-xs font-semibold uppercase tracking-wide text-ink-muted">
        Ubah status
      </p>

      <div className="grid grid-cols-2 gap-2">
        {orderStatuses.map((status) => (
          <StatusButton
            key={status}
            status={status}
            isActive={currentStatus === status}
          />
        ))}
      </div>

      {state.error && (
        <p className="text-xs text-yumm-coral">{state.error}</p>
      )}
      {state.success && (
        <p className="text-xs text-emerald-600">{state.success}</p>
      )}
    </form>
  );
}

interface StatusButtonProps {
  status: OrderStatus;
  isActive: boolean;
}

function StatusButton({ status, isActive }: StatusButtonProps) {
  const { pending, data } = useFormStatus();

  // Cek apakah tombol INI yang sedang diklik
  const isThisButtonSubmitting =
    pending && data?.get("status") === status;

  // Disable semua tombol jika ada form yang sedang submit
  const disabled = isActive || pending;

  const Icon = STATUS_ICONS[status];
  const styles = STATUS_STYLES[status];

  return (
    <button
      type="submit"
      name="status"
      value={status}
      disabled={disabled}
      className={cn(
        "relative flex items-center justify-center gap-2 rounded-yumm border-2 px-3 py-2.5",
        "font-display text-xs font-semibold transition-all duration-150",
        isActive ? styles.active : styles.inactive,
        disabled && !isThisButtonSubmitting && "opacity-50 cursor-not-allowed",
        isThisButtonSubmitting && "opacity-100"
      )}
    >
      {isThisButtonSubmitting ? (
        <>
          <Loader2
            size={ICON_SIZE.sm}
            className="animate-spin"
            strokeWidth={2.5}
          />
          <span>Memproses...</span>
        </>
      ) : (
        <>
          <Icon size={ICON_SIZE.sm} strokeWidth={2.5} />
          <span>{STATUS_LABELS[status]}</span>
        </>
      )}
    </button>
  );
}