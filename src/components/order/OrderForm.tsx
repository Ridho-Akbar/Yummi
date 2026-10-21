"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Cake, Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { DesktopCart, MobileCart } from "./OrderCart";
import { createOrder, type CreateOrderState } from "@/features/orders/actions";
import type { OrderItemInput } from "@/features/orders/schema";
import type { Product } from "@/types";
import type { ProductCapacity } from "@/features/orders/queries";

interface OrderFormProps {
  products: Product[];
  initialDate: string;
  initialProductId?: string;
  initialItems?: { productId: string; qty: number }[];
  isLoggedIn: boolean;
  initialCapacities: Record<string, ProductCapacity>;
  minDate?: string;
  maxDate?: string;
}

interface FormFields {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  note: string;
  orderDate: string;
  accessPassword: string;
}

const initialState: CreateOrderState = {};

export function OrderForm({
  products,
  initialDate,
  initialProductId,
  initialItems: urlItems,
  isLoggedIn,
  initialCapacities,
  minDate,
  maxDate,
}: OrderFormProps) {
  const [state, formAction] = useActionState(createOrder, initialState);
  const [items, setItems] = useState<OrderItemInput[]>([]);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [capacities, setCapacities] = useState(initialCapacities);
  const [isLoadingCapacity, setIsLoadingCapacity] = useState(false);
  const [dateError, setDateError] = useState(false);

  const addTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastFetchedDateRef = useRef(initialDate);
  const autoAddedRef = useRef(false);

  const [fields, setFields] = useState<FormFields>({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    note: "",
    orderDate: initialDate,
    accessPassword: "",
  });

  function setField<K extends keyof FormFields>(name: K, value: FormFields[K]) {
    setFields((prev) => ({ ...prev, [name]: value }));
  }

  useEffect(() => {
    if (autoAddedRef.current) return;

    if (urlItems && urlItems.length > 0) {
      const validItems: OrderItemInput[] = [];
      urlItems.forEach((ui) => {
        const product = products.find((p) => p.id === ui.productId);
        if (product) {
          validItems.push({
            productId: product.id,
            name: product.name,
            price: Number(product.price),
            qty: Math.max(ui.qty, product.min_order_qty ?? 1),
          });
        }
      });

      if (validItems.length > 0) {
        setItems(validItems);
        autoAddedRef.current = true;
        return;
      }
    }

    if (initialProductId) {
      const product = products.find((p) => p.id === initialProductId);
      if (product) {
        setItems([
          {
            productId: product.id,
            name: product.name,
            price: Number(product.price),
            qty: product.min_order_qty ?? 1,
          },
        ]);
      }
    }

    autoAddedRef.current = true;
  }, [initialProductId, urlItems, products]);

  useEffect(() => {
    const currentDate = fields.orderDate.trim();
    if (!currentDate) {
      setCapacities({});
      lastFetchedDateRef.current = "";
      return;
    }
    if (currentDate === lastFetchedDateRef.current) return;

    let cancelled = false;
    setIsLoadingCapacity(true);

    fetch(`/api/capacity?date=${encodeURIComponent(currentDate)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        setCapacities(data.capacities ?? {});
        lastFetchedDateRef.current = currentDate;
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoadingCapacity(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fields.orderDate]);

  useEffect(() => {
    if (fields.orderDate.trim()) setDateError(false);
  }, [fields.orderDate]);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items]
  );

  useEffect(() => {
    return () => {
      if (addTimeoutRef.current) clearTimeout(addTimeoutRef.current);
    };
  }, []);

  function cartQtyFor(productId: string): number {
    const item = items.find((i) => i.productId === productId);
    return item?.qty ?? 0;
  }

  function addProduct(product: Product) {
    const minQty = product.min_order_qty ?? 1;
    const capacity = capacities[product.id];
    const inCart = cartQtyFor(product.id);

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
          qty: minQty,
        },
      ];
    });

    setJustAdded(product.id);
    if (addTimeoutRef.current) clearTimeout(addTimeoutRef.current);
    addTimeoutRef.current = setTimeout(() => {
      setJustAdded(null);
    }, 700);
  }

  function updateQty(productId: string, delta: number) {
    const product = products.find((p) => p.id === productId);
    const minQty = product?.min_order_qty ?? 1;
    const capacity = capacities[productId];

    setItems((prev) =>
      prev
        .map((i) => {
          if (i.productId !== productId) return i;
          let next = i.qty + delta;
          if (next < minQty) next = minQty;
          if (capacity && next > capacity.remaining) {
            next = capacity.remaining;
          }
          return { ...i, qty: next };
        })
        .filter((i) => i.qty > 0)
    );
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!fields.orderDate.trim()) {
      e.preventDefault();
      setDateError(true);
      const el = document.getElementById("orderDate");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus();
      return;
    }
  }

  const fieldErrors = state.fieldErrors ?? {};

  return (
    <form action={formAction} onSubmit={handleSubmit} className="relative">
      <input type="hidden" name="items" value={JSON.stringify(items)} />

      <div className="lg:grid lg:grid-cols-[1fr_340px] lg:items-start lg:gap-6">
        <div className="space-y-6">
          <Section title="1. Pilih Tanggal Dulu">
            <p className="mb-4 text-sm text-ink-muted">
              Tentukan tanggal acara dulu supaya sisa kapasitas produk terlihat akurat.
            </p>
            <div className="space-y-1.5">
              <label
                htmlFor="orderDate"
                className="block font-display text-xs font-semibold uppercase tracking-wide text-ink-muted"
              >
                Tanggal pengiriman <span className="text-yumm-coral">*</span>
              </label>
              <input
                id="orderDate"
                name="orderDate"
                type="date"
                value={fields.orderDate}
                onChange={(e) => setField("orderDate", e.target.value)}
                min={minDate}
                max={maxDate}
                className={cn(
                  "w-full rounded-yumm border bg-surface px-4 py-3",
                  "font-body text-base text-ink",
                  "focus:outline-hidden focus:ring-2",
                  dateError || fieldErrors.orderDate
                    ? "border-yumm-coral focus:border-yumm-coral focus:ring-yumm-coral/20"
                    : "border-neutral-200 focus:border-yumm-pink focus:ring-yumm-pink/20"
                )}
              />
              {dateError && !fields.orderDate && (
                <p className="text-xs text-yumm-coral">
                  Tanggal wajib dipilih sebelum mengirim pesanan.
                </p>
              )}
              {fieldErrors.orderDate && (
                <p className="text-xs text-yumm-coral">
                  {fieldErrors.orderDate[0]}
                </p>
              )}
            </div>
          </Section>

          <Section title="2. Pilih Produk">
            {products.length === 0 ? (
              <p className="text-sm text-ink-muted">
                Belum ada produk yang tersedia hari ini.
              </p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {products.map((product) => {
                  const capacity = capacities[product.id];
                  const inCart = cartQtyFor(product.id);
                  const remainingForUser = capacity
                    ? Math.max(capacity.remaining - inCart, 0)
                    : null;

                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      justAdded={justAdded === product.id}
                      remainingForUser={remainingForUser}
                      hasDate={Boolean(fields.orderDate.trim())}
                      isLoadingCapacity={isLoadingCapacity}
                      onAdd={() => addProduct(product)}
                    />
                  );
                })}
              </div>
            )}
          </Section>

          <Section title="3. Data Pemesan">
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
                placeholder="08123456789"
                value={fields.customerPhone}
                onChange={(v) => setField("customerPhone", v)}
                error={fieldErrors.customerPhone?.[0]}
              />
              <Field
                label="Alamat pengiriman"
                name="customerAddress"
                textarea
                placeholder="Jalan, nomor rumah, kelurahan, kecamatan"
                value={fields.customerAddress}
                onChange={(v) => setField("customerAddress", v)}
                error={fieldErrors.customerAddress?.[0]}
              />
              <Field
                label="Catatan (opsional)"
                name="note"
                textarea
                placeholder="Misalnya: sambal dipisah, jangan sampai dingin"
                value={fields.note}
                onChange={(v) => setField("note", v)}
                error={fieldErrors.note?.[0]}
              />
            </div>
          </Section>

          {!isLoggedIn && (
            <Section title="4. Sandi Akses">
              <p className="mb-3 text-sm text-ink-muted">
                Karena kamu belum login, masukkan sandi akses yang kamu terima
                dari admin lewat WhatsApp. Ini untuk mencegah pesanan palsu.
              </p>
              <Field
                label="Sandi akses"
                name="accessPassword"
                type="password"
                placeholder="Sandi dari admin"
                value={fields.accessPassword}
                onChange={(v) => setField("accessPassword", v)}
                error={fieldErrors.accessPassword?.[0]}
              />
            </Section>
          )}

          {items.length > 0 && <div className="h-28 lg:hidden" aria-hidden />}
        </div>

        <aside className="mt-6 hidden lg:mt-0 lg:sticky lg:top-6 lg:block">
          <DesktopCart
            items={items}
            total={total}
            itemCount={itemCount}
            error={state.error}
            onUpdateQty={updateQty}
            onRemove={removeItem}
            products={products}
          />
        </aside>
      </div>

      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden">
          <MobileCart
            items={items}
            total={total}
            itemCount={itemCount}
            error={state.error}
            expanded={mobileCartOpen}
            onToggle={() => setMobileCartOpen((v) => !v)}
            onUpdateQty={updateQty}
            onRemove={removeItem}
            products={products}
          />
        </div>
      )}
    </form>
  );
}

interface ProductCardProps {
  product: Product;
  justAdded: boolean;
  remainingForUser: number | null;
  hasDate: boolean;
  isLoadingCapacity: boolean;
  onAdd: () => void;
}

function ProductCard({
  product,
  justAdded,
  remainingForUser,
  hasDate,
  isLoadingCapacity,
  onAdd,
}: ProductCardProps) {
  const minQty = product.min_order_qty ?? 1;

  const utilization = useMemo(() => {
    if (remainingForUser === null) return null;
    const cap = product.daily_capacity;
    if (cap <= 0) return null;
    const used = cap - remainingForUser;
    return used / cap;
  }, [remainingForUser, product.daily_capacity]);

  const showCapacityBadge =
    hasDate &&
    !isLoadingCapacity &&
    remainingForUser !== null &&
    utilization !== null &&
    utilization >= 0.8;

  const isReadyStockEmpty = product.ready_stock <= 0;
  const isCapacityFull = hasDate && remainingForUser !== null && remainingForUser <= 0;
  const showOutWarning = isReadyStockEmpty || isCapacityFull;

  return (
    <button
      type="button"
      onClick={onAdd}
      className={cn(
        "group flex items-stretch gap-3 rounded-yumm border-2 p-2.5 text-left transition-all duration-150",
        "active:scale-[0.98]",
        justAdded
          ? "border-emerald-500 bg-yumm-mint/30"
          : showOutWarning
          ? "border-yumm-coral/30 bg-yumm-coral/5 hover:border-yumm-coral"
          : "border-neutral-100 bg-white hover:border-yumm-pink hover:bg-yumm-pink/5"
      )}
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-yumm bg-surface-muted">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="80px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-yumm-pink/10 via-yumm-lilac/10 to-yumm-mint/20">
            <Cake size={28} className="text-yumm-pink/40" strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <p className="truncate font-display text-sm font-semibold text-ink">
          {product.name}
        </p>
        <p className="mt-0.5 text-xs text-ink-muted">
          Rp{Number(product.price).toLocaleString("id-ID")}
          {minQty > 1 && (
            <span className="ml-1.5 text-yumm-coral">· min {minQty}</span>
          )}
        </p>

        {isCapacityFull ? (
          <span className="mt-1.5 inline-block w-fit rounded-full bg-yumm-coral px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-wide text-white">
            Penuh untuk tanggal ini
          </span>
        ) : isReadyStockEmpty ? (
          <span className="mt-1.5 inline-block w-fit rounded-full bg-yumm-coral/20 px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-wide text-yumm-coral">
            Stok habis (Bisa Pre-Order)
          </span>
        ) : showCapacityBadge ? (
          <span className="mt-1.5 inline-block w-fit rounded-full bg-yumm-lemon/50 px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-wide text-ink">
            Sisa {remainingForUser}
          </span>
        ) : null}
      </div>

      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center self-center rounded-full text-white transition-all duration-200",
          justAdded
            ? "bg-emerald-500"
            : showOutWarning
            ? "bg-yumm-coral/50 group-hover:bg-yumm-coral"
            : "bg-yumm-pink group-hover:bg-yumm-coral"
        )}
        aria-hidden
      >
        {justAdded ? (
          <Check size={14} strokeWidth={3} />
        ) : (
          <Plus size={14} strokeWidth={3} />
        )}
      </span>
    </button>
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
    <div className="rounded-yumm-lg border border-neutral-100 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-4 font-display text-base font-bold text-ink">
        {title}
      </h2>
      {children}
    </div>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
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
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseClass}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseClass}
        />
      )}
      {error && <p className="text-xs text-yumm-coral">{error}</p>}
    </div>
  );
}