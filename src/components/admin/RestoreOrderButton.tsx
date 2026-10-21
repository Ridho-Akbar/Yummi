"use client";

import { useTransition } from "react";
import { RotateCcw, Loader2 } from "lucide-react";
import { restoreOrder } from "@/features/orders/actions";

export function RestoreOrderButton({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleRestore() {
    if (!confirm("Pulihkan pesanan ini ke daftar aktif?")) return;
    startTransition(async () => {
      await restoreOrder(orderId);
    });
  }

  return (
    <button
      onClick={handleRestore}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 transition-colors hover:bg-emerald-100 disabled:opacity-50"
    >
      {isPending ? <Loader2 size={12} className="animate-spin" /> : <RotateCcw size={12} />}
      Pulihkan
    </button>
  );
}
