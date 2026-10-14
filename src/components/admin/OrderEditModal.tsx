"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { ICON_SIZE } from "@/lib/icons";
import { Button } from "@/components/ui/Button";
import {
  updateOrder,
  type UpdateOrderState,
} from "@/features/orders/update-actions";
import type { OrderItemInput } from "@/features/orders/schema";
import type { AdminOrderDetail } from "@/features/orders/queries";
import type { Product } from "@/types";

interface OrderEditModalProps {
  order: AdminOrderDetail;
  products: Product[];
  trigger: React.ReactNode;
}

export function OrderEditModal({
  order,
  products,
  trigger,
}: OrderEditModalProps) {
  const [open, setOpen] = useState(false);
  const [mountKey, setMountKey] = useState(0);

  function handleOpen() {
    setMountKey((k) => k + 1);
    setOpen(true);
  }

  if (!open) {
    return <div onClick={handleOpen}>{trigger}</div>;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center"
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-yumm-lg bg-white p-6 shadow-xl"
      >
        <OrderEditForm
          key={mountKey}
          order={order}
          products={products}
          onClose={() => setOpen(false)}
        />
      </div>
    </div>
  );
}

interface OrderEditFormProps {
  order: AdminOrderDetail;
  products: Product[];
  onClose: () => void;
}

interface FormFields {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  note: string;
  orderDate: string;
}

const initialState: UpdateOrderState = {};

function OrderEditForm({ order, products, onClose }: OrderEditFormProps) {
  const itemsLocked = order.status !== "pending";

  const [state, formAction] = useActionState(updateOrder, initialState);
  const [items, setItems] = useState<OrderItemInput[]>(
    order.items.map((i) => ({
      productId: i.productId,
      name: i.name,
      price: i.price,
      qty: i.qty,
    }))
  );
  const [fields, setFields] = useState<FormFields>({
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    customerAddress: order.customerAddress ?? "",
    note: order.note ?? "",
    orderDate: order.orderDate,
  });

  function setField<K extends keyof FormFields>(name: K, value: FormFields[K]) {
    setFields((prev) => ({ ...prev, [name]: value }));
  }

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  );

  function addProduct(product: Product) {
    if (itemsLocked) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: Number(product.price),
          qty: 1,
        },
      ];
    });
  }

  function updateQty(productId: string, delta: number) {
    if (itemsLocked) return;
    setItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId ? { ...i, qty: i.qty + delta } : i
        )
        .filter((i) => i.qty > 0)
    );
  }

  const fieldErrors = state.fieldErrors ?? {};

  return (
    <>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Edit Pesanan
          </p>
          <p className="mt-1 inline-block rounded-md bg-surface-muted px-2.5 py-1 font-mono text-sm font-semibold text-ink">
            {order.orderCode}
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Tutup"
          className="rounded-full p-2 text-ink-muted transition-colors hover:bg-surface-muted"
        >
          <X size={ICON_SIZE.md} />
        </button>
      </div>

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="orderId" value={order.id} />
        <input type="hidden" name="items" value={JSON.stringify(items)} />

        <Section title="Data pelanggan">
          <div className="space-y-4">
            <Field
              label="Nama lengkap"
              name="customerName"
              value={fields.customerName}
              onChange={(v) => setField("customerName", v)}
              error={fieldErrors.customerName?.[0]}
            />
            <Field
              label="Nomor HP / WhatsApp"
              name="customerPhone"
              type="tel"
              value={fields.customerPhone}
              onChange={(v) => setField("customerPhone", v)}
              error={fieldErrors.customerPhone?.[0]}
            />
            <Field
              label="Alamat pengiriman"
              name="customerAddress"
              textarea
              value={fields.customerAddress}
              onChange={(v) => setField("customerAddress", v)}
              error={fieldErrors.customerAddress?.[0]}
            />
            <Field
              label="Catatan"
              name="note"
              textarea
              value={fields.note}
              onChange={(v) => setField("note", v)}
              error={fieldErrors.note?.[0]}
            />
            <Field
              label="Tanggal pengiriman"
              name="orderDate"
              type="date"
              value={fields.orderDate}
              onChange={(v) => setField("orderDate", v)}
              error={fieldErrors.orderDate?.[0]}
            />
          </div>
        </Section>

        <Section title="Produk">
          {itemsLocked && (
            <div className="mb-4 rounded-yumm bg-yumm-lemon/30 px-4 py-3 text-xs text-ink">
              Item terkunci karena status sudah <strong>{order.status}</strong>.
              Untuk mengubah item, ubah status ke <strong>pending</strong>{" "}
              dulu.
            </div>
          )}

          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between gap-3 rounded-yumm border border-neutral-100 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-semibold text-ink">
                    {item.name}
                  </p>
                  <p className="text-xs text-ink-muted">
                    Rp{item.price.toLocaleString("id-ID")} × {item.qty}
                  </p>
                </div>
                {!itemsLocked && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQty(item.productId, -1)}
                      className="h-7 w-7 rounded-full bg-surface-muted font-bold text-ink"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-display text-sm font-semibold">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.productId, 1)}
                      className="h-7 w-7 rounded-full bg-yumm-pink font-bold text-white"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!itemsLocked && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Tambah produk
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {products.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => addProduct(product)}
                    className="flex items-center justify-between gap-2 rounded-yumm border border-neutral-100 px-3 py-2 text-left text-xs transition-colors hover:border-yumm-pink hover:bg-yumm-pink/5"
                  >
                    <span className="truncate font-display font-semibold text-ink">
                      {product.name}
                    </span>
                    <span className="shrink-0 text-ink-muted">
                      + Rp{Number(product.price).toLocaleString("id-ID")}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
            <span className="font-display text-sm font-semibold text-ink-muted">
              Total
            </span>
            <span className="font-display text-xl font-bold text-yumm-pink">
              Rp{total.toLocaleString("id-ID")}
            </span>
          </div>
        </Section>

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

        <div className="flex gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1"
          >
            Batal
          </Button>
          <SubmitButton />
        </div>
      </form>
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-yumm border border-neutral-100 p-4">
      <h3 className="mb-3 font-display text-sm font-bold text-ink">{title}</h3>
      {children}
    </div>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

function Field({
  label,
  name,
  type = "text",
  textarea,
  value,
  onChange,
  error,
}: FieldProps) {
  const baseClass = cn(
    "w-full rounded-yumm border border-neutral-200 bg-surface px-4 py-2.5",
    "font-body text-sm text-ink placeholder:text-ink-muted/60",
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
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseClass}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
    <Button type="submit" disabled={pending} className="flex-1">
      {pending ? "Menyimpan..." : "Simpan perubahan"}
    </Button>
  );
}