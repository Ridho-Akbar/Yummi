"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/lib/icons";
import { Button } from "@/components/ui/Button";
import {
  updateOrderPayment,
  type UpdatePaymentState,
} from "@/features/orders/payment-actions";
import {
  MIN_DP_AMOUNT,
  type PaymentStatus,
} from "@/features/orders/payment-schema";

interface PaymentChangerProps {
  orderId: string;
  currentStatus: PaymentStatus;
  currentAmount: number;
  orderTotal: number;
}

const STATUS_LABELS: Record<PaymentStatus, string> = {
  unpaid: "Belum bayar",
  dp: "DP",
  paid: "Lunas",
};

const STATUS_STYLES: Record<PaymentStatus, string> = {
  unpaid: "bg-yumm-coral/15 text-yumm-coral",
  dp: "bg-yumm-lemon/40 text-ink",
  paid: "bg-yumm-mint/30 text-emerald-700",
};

const DP_PRESETS = [50_000, 100_000, 200_000];

const initialState: UpdatePaymentState = {};

export function PaymentChanger({
  orderId,
  currentStatus,
  currentAmount,
  orderTotal,
}: PaymentChangerProps) {
  const [open, setOpen] = useState(false);
  const [mountKey, setMountKey] = useState(0);

  function handleOpen() {
    setMountKey((k) => k + 1);
    setOpen(true);
  }

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold",
              STATUS_STYLES[currentStatus]
            )}
          >
            {STATUS_LABELS[currentStatus]}
          </span>
          {currentStatus !== "unpaid" && (
            <span className="font-display text-sm font-semibold text-ink">
              Rp{currentAmount.toLocaleString("id-ID")}
            </span>
          )}
        </div>

        {currentStatus === "unpaid" && (
          <p className="text-xs text-ink-muted">
            Belum ada pembayaran diterima.
          </p>
        )}

        {currentStatus === "dp" && (
          <p className="text-xs text-ink-muted">
            Sisa: Rp{(orderTotal - currentAmount).toLocaleString("id-ID")}
          </p>
        )}

        <Button
          type="button"
          variant="ghost"
          onClick={handleOpen}
          className="w-full border border-neutral-200"
        >
          Ubah status pembayaran
        </Button>
      </div>

      {open && (
        <PaymentModal
          key={mountKey}
          orderId={orderId}
          currentStatus={currentStatus}
          currentAmount={currentAmount}
          orderTotal={orderTotal}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

interface PaymentModalProps {
  orderId: string;
  currentStatus: PaymentStatus;
  currentAmount: number;
  orderTotal: number;
  onClose: () => void;
}

function PaymentModal({
  orderId,
  currentStatus,
  currentAmount,
  orderTotal,
  onClose,
}: PaymentModalProps) {
  const [state, formAction] = useActionState(
    updateOrderPayment,
    initialState
  );
  const [status, setStatus] = useState<PaymentStatus>(currentStatus);
  const [amount, setAmount] = useState<string>(
    currentStatus === "dp" ? String(currentAmount) : ""
  );

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(onClose, 900);
      return () => clearTimeout(timer);
    }
  }, [state.success, onClose]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function handleBlur() {
    const digits = amount.replace(/\D/g, "");
    if (!digits) return;

    const num = Number(digits);
    if (!Number.isFinite(num) || num <= 0) {
      setAmount("");
      return;
    }

    const final = num < 1000 ? num * 1000 : num;
    setAmount(String(final));
  }

  function applyPreset(value: number) {
    setAmount(String(value));
  }

  const numericAmount = Number(amount.replace(/\D/g, "")) || 0;
  const remaining = orderTotal - numericAmount;
  const isDpTooLow = status === "dp" && numericAmount < MIN_DP_AMOUNT;
  const isDpTooHigh = status === "dp" && numericAmount >= orderTotal;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md space-y-5 rounded-yumm-lg bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Status Pembayaran
            </p>
            <h2 className="mt-1 font-display text-lg font-bold text-ink">
              Total pesanan: Rp{orderTotal.toLocaleString("id-ID")}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-full p-2 text-ink-muted transition-colors hover:bg-surface-muted"
          >
            <X size={ICON_SIZE.md} />
          </button>
        </div>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="orderId" value={orderId} />
          <input type="hidden" name="status" value={status} />
          <input
            type="hidden"
            name="amountPaid"
            value={status === "paid" ? orderTotal : numericAmount}
          />

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Status
            </p>
            <div className="grid grid-cols-3 gap-2">
              <StatusOption
                active={status === "unpaid"}
                activeClass="border-yumm-coral bg-yumm-coral/10 text-yumm-coral"
                label="Belum bayar"
                onClick={() => {
                  setStatus("unpaid");
                  setAmount("");
                }}
              />
              <StatusOption
                active={status === "dp"}
                activeClass="border-yumm-lemon bg-yumm-lemon/30 text-ink"
                label="DP"
                onClick={() => setStatus("dp")}
              />
              <StatusOption
                active={status === "paid"}
                activeClass="border-emerald-500 bg-yumm-mint/30 text-emerald-700"
                label="Lunas"
                onClick={() => {
                  setStatus("paid");
                  setAmount("");
                }}
              />
            </div>
          </div>

          {status === "dp" && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="amount"
                  className="block text-xs font-semibold uppercase tracking-wide text-ink-muted"
                >
                  Nominal DP (Rp)
                </label>
                <input
                  id="amount"
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value.replace(/\D/g, ""))
                  }
                  onBlur={handleBlur}
                  placeholder="Ketik 300 untuk Rp300.000"
                  autoFocus
                  className={cn(
                    "w-full rounded-yumm border bg-surface px-4 py-2.5",
                    "font-body text-sm text-ink placeholder:text-ink-muted/60",
                    "focus:outline-hidden focus:ring-2",
                    isDpTooLow || isDpTooHigh
                      ? "border-yumm-coral focus:border-yumm-coral focus:ring-yumm-coral/20"
                      : "border-neutral-200 focus:border-yumm-pink focus:ring-yumm-pink/20"
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                  Pilih cepat
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {DP_PRESETS.map((preset) => {
                    const isActive = numericAmount === preset;
                    const isDisabled = preset >= orderTotal;

                    return (
                      <button
                        key={preset}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => applyPreset(preset)}
                        className={cn(
                          "rounded-yumm border-2 px-2 py-2.5",
                          "font-display text-xs font-semibold transition-all",
                          "disabled:cursor-not-allowed disabled:opacity-40",
                          isActive
                            ? "border-yumm-pink bg-yumm-pink/10 text-yumm-pink"
                            : "border-neutral-200 bg-white text-ink-muted hover:border-yumm-pink hover:bg-yumm-pink/5 hover:text-yumm-pink"
                        )}
                      >
                        Rp{(preset / 1000).toLocaleString("id-ID")}rb
                      </button>
                    );
                  })}
                </div>
              </div>

              {isDpTooLow && (
                <p className="text-xs text-yumm-coral">
                  Minimal Rp{MIN_DP_AMOUNT.toLocaleString("id-ID")}.
                </p>
              )}
              {isDpTooHigh && (
                <p className="text-xs text-yumm-coral">
                  Harus lebih kecil dari total. Pakai status Lunas kalau
                  sudah penuh.
                </p>
              )}
              {!isDpTooLow && !isDpTooHigh && numericAmount > 0 && (
                <p className="text-xs text-ink-muted">
                  Sisa yang harus dibayar:{" "}
                  <span className="font-semibold text-yumm-pink">
                    Rp{Math.max(remaining, 0).toLocaleString("id-ID")}
                  </span>
                </p>
              )}
            </div>
          )}

          {status === "paid" && (
            <div className="rounded-yumm bg-yumm-mint/20 px-4 py-3 text-xs text-emerald-800">
              Menandai pesanan sebagai <strong>Lunas</strong>. Nominal
              otomatis diset sama dengan total pesanan.
            </div>
          )}

          {status === "unpaid" && (
            <div className="rounded-yumm bg-yumm-coral/10 px-4 py-3 text-xs text-yumm-coral">
              Menandai pesanan sebagai <strong>Belum bayar</strong>. Nominal
              pembayaran akan direset ke 0.
            </div>
          )}

          {state.error && (
            <p className="text-xs text-yumm-coral">{state.error}</p>
          )}
          {state.success && (
            <p className="text-xs text-emerald-600">{state.success}</p>
          )}

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              Batal
            </Button>
            <SaveButton
              disabled={status === "dp" && (isDpTooLow || isDpTooHigh)}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

interface StatusOptionProps {
  active: boolean;
  activeClass: string;
  label: string;
  onClick: () => void;
}

function StatusOption({
  active,
  activeClass,
  label,
  onClick,
}: StatusOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-yumm border-2 px-3 py-3 font-display text-xs font-semibold transition-all",
        active
          ? activeClass
          : "border-neutral-200 bg-white text-ink-muted hover:border-neutral-300"
      )}
    >
      {label}
    </button>
  );
}

function SaveButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || disabled} className="flex-1">
      {pending ? "Menyimpan..." : "Simpan"}
    </Button>
  );
}