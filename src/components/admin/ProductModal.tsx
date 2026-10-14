"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { PriceInput } from "./PriceInput";
import { ImageUploadField } from "./ImageUploadField";
import {
  createProduct,
  updateProduct,
  type ProductState,
} from "@/features/products/actions";
import type { Product } from "@/types";

interface ProductModalProps {
  product?: Product;
  trigger: React.ReactNode;
}

export function ProductModal({ product, trigger }: ProductModalProps) {
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
        className="scrollbar-yumm max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-yumm-lg bg-white p-6 shadow-xl"
      >
        <ProductForm
          key={mountKey}
          product={product}
          onClose={() => setOpen(false)}
        />
      </div>
    </div>
  );
}

interface ProductFormProps {
  product?: Product;
  onClose: () => void;
}

const initialState: ProductState = {};

function ProductForm({ product, onClose }: ProductFormProps) {
  const action = product ? updateProduct : createProduct;
  const [state, formAction] = useActionState(action, initialState);
  const fieldErrors = state.fieldErrors ?? {};

  return (
    <>
      <div className="mb-6 flex items-start justify-between gap-4">
        <h2 className="font-display text-xl font-bold text-ink">
          {product ? "Edit Produk" : "Tambah Produk"}
        </h2>
        <button
          onClick={onClose}
          aria-label="Tutup"
          className="rounded-full p-2 text-ink-muted transition-colors hover:bg-surface-muted"
        >
          ×
        </button>
      </div>

      <form action={formAction} className="space-y-4">
        {product && (
          <input type="hidden" name="productId" value={product.id} />
        )}

        <Field
          label="Nama produk"
          name="name"
          defaultValue={product?.name ?? ""}
          placeholder="Contoh: Kue Tart Cokelat"
          error={fieldErrors.name?.[0]}
        />

        <Field
          label="Deskripsi"
          name="description"
          textarea
          defaultValue={product?.description ?? ""}
          placeholder="Deskripsi singkat yang akan dilihat pelanggan"
          error={fieldErrors.description?.[0]}
        />

        <ImageUploadField
          name="imageUrl"
          initialUrl={product?.image_url ?? null}
          error={fieldErrors.imageUrl?.[0]}
        />

        <PriceInput
          name="price"
          defaultValue={product ? Number(product.price) : undefined}
          hint="Ketik 150 untuk Rp150.000. Minimal Rp1.000."
          error={fieldErrors.price?.[0]}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Stok jadi hari ini"
            name="readyStock"
            type="number"
            defaultValue={product ? String(product.ready_stock) : "0"}
            placeholder="0"
            hint="Produk siap jual (walk-in)."
            error={fieldErrors.readyStock?.[0]}
          />
          <Field
            label="Kapasitas pre-order / hari"
            name="dailyCapacity"
            type="number"
            defaultValue={product ? String(product.daily_capacity) : "50"}
            placeholder="50"
            hint="Maksimal pesanan pre-order per hari."
            error={fieldErrors.dailyCapacity?.[0]}
          />
        </div>

        <Field
          label="Minimum order (qty)"
          name="minOrderQty"
          type="number"
          defaultValue={product ? String(product.min_order_qty) : "1"}
          placeholder="1"
          hint="Jumlah minimal per pesanan. Isi 1 kalau tidak ada minimum."
          error={fieldErrors.minOrderQty?.[0]}
        />

        <label className="flex items-center gap-3 rounded-yumm border border-neutral-100 px-4 py-3">
          <input
            type="checkbox"
            name="isAvailable"
            defaultChecked={product?.is_available ?? true}
            className="h-4 w-4 rounded border-neutral-300 text-yumm-pink focus:ring-yumm-pink"
          />
          <span className="text-sm text-ink">
            Tampilkan produk di form pesanan
          </span>
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

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1"
          >
            Tutup
          </Button>
          <SubmitButton isEdit={!!product} />
        </div>
      </form>
    </>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  defaultValue?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
}

function Field({
  label,
  name,
  type = "text",
  textarea,
  defaultValue,
  placeholder,
  hint,
  error,
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
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={2}
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
      {hint && !error && <p className="text-xs text-ink-muted">{hint}</p>}
      {error && <p className="text-xs text-yumm-coral">{error}</p>}
    </div>
  );
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="flex-1">
      {pending ? "Menyimpan..." : isEdit ? "Simpan" : "Tambah"}
    </Button>
  );
}