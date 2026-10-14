"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";
import {
  deleteOrder,
  type DeleteOrderState,
} from "@/features/orders/update-actions";

interface DeleteOrderButtonProps {
  orderId: string;
}

const initialState: DeleteOrderState = {};

export function DeleteOrderButton({ orderId }: DeleteOrderButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [state, formAction] = useActionState(deleteOrder, initialState);

  if (!confirming) {
    return (
      <Button
        type="button"
        variant="ghost"
        onClick={() => setConfirming(true)}
        className="w-full border border-yumm-coral/40 text-yumm-coral hover:bg-yumm-coral/10"
      >
        Hapus pesanan
      </Button>
    );
  }

  return (
    <div className="space-y-3 rounded-yumm border border-yumm-coral/40 bg-yumm-coral/5 p-4">
      <p className="text-sm text-ink">
        Pesanan ini akan dihapus dari daftar. Data tetap tersimpan di database
        untuk audit.
      </p>
      {state.error && (
        <p className="text-xs text-yumm-coral">{state.error}</p>
      )}
      <form action={formAction} className="flex gap-2">
        <input type="hidden" name="orderId" value={orderId} />
        <Button
          type="button"
          variant="ghost"
          onClick={() => setConfirming(false)}
          className="flex-1"
        >
          Batal
        </Button>
        <ConfirmSubmit />
      </form>
    </div>
  );
}

function ConfirmSubmit() {
  const { useFormStatus: _unused } = { useFormStatus: null };
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="flex-1 bg-yumm-coral hover:bg-yumm-coral/80"
    >
      {pending ? "Menghapus..." : "Ya, hapus"}
    </Button>
  );
}