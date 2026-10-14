"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/lib/icons";
import type {
  OrderStatus,
  PaymentStatus,
  DateFilter,
} from "@/features/orders/queries";

interface OrderSearchBarProps {
  initialQuery: string;
  initialStatus: OrderStatus | undefined;
  initialPaymentStatus: PaymentStatus | undefined;
  initialDateFilter: DateFilter;
}

const STATUS_FILTERS: { value: OrderStatus | undefined; label: string }[] = [
  { value: undefined, label: "Semua status" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Dikonfirmasi" },
  { value: "done", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
];

const PAYMENT_FILTERS: { value: PaymentStatus | undefined; label: string }[] = [
  { value: undefined, label: "Semua bayar" },
  { value: "unpaid", label: "Belum bayar" },
  { value: "dp", label: "DP" },
  { value: "paid", label: "Lunas" },
];

const DATE_FILTERS: { value: DateFilter; label: string }[] = [
  { value: "all", label: "Semua waktu" },
  { value: "today", label: "Hari ini" },
  { value: "week", label: "Minggu ini" },
  { value: "month", label: "Bulan ini" },
];

export function OrderSearchBar({
  initialQuery,
  initialStatus,
  initialPaymentStatus,
  initialDateFilter,
}: OrderSearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState<OrderStatus | undefined>(initialStatus);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | undefined>(
    initialPaymentStatus
  );
  const [dateFilter, setDateFilter] = useState<DateFilter>(initialDateFilter);
  const isFirstRender = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      params.set("view", "list");
      if (query.trim()) params.set("q", query.trim());
      if (status) params.set("status", status);
      if (paymentStatus) params.set("payment", paymentStatus);
      if (dateFilter !== "all") params.set("date", dateFilter);
      router.replace(`/admin/orders?${params.toString()}`);
    }, 350);

    return () => clearTimeout(timer);
  }, [query, status, paymentStatus, dateFilter, router]);

  useEffect(() => {
    function isTypingTarget(target: EventTarget | null): boolean {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target.isContentEditable
      );
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "/" && !isTypingTarget(e.target)) {
        e.preventDefault();
        inputRef.current?.focus();
        return;
      }
      if (e.key === "Escape") {
        const input = inputRef.current;
        if (input && document.activeElement === input) {
          if (query) setQuery("");
          else input.blur();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [query]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          inputMode="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari kode, nama, HP, atau alamat... (tekan / untuk fokus)"
          className="w-full rounded-yumm border border-neutral-200 bg-white px-4 py-3 pl-11 pr-14 font-body text-sm text-ink placeholder:text-ink-muted/60 focus:border-yumm-pink focus:outline-hidden focus:ring-2 focus:ring-yumm-pink/20"
        />
        <Search
          size={ICON_SIZE.md}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-muted transition-colors hover:bg-surface-muted"
            aria-label="Hapus pencarian"
          >
            <X size={ICON_SIZE.sm} />
          </button>
        ) : (
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-neutral-200 bg-surface-muted px-2 py-0.5 font-mono text-[10px] font-semibold text-ink-muted sm:inline-block">
            /
          </kbd>
        )}
      </div>

      <div className="space-y-2">
        <FilterRow
          label="Waktu"
          filters={DATE_FILTERS}
          activeValue={dateFilter}
          onSelect={(value) => {
            if (value) setDateFilter(value);
          }}
          activeClass="bg-yumm-pink text-white"
        />

        <FilterRow
          label="Bayar"
          filters={PAYMENT_FILTERS}
          activeValue={paymentStatus}
          onSelect={setPaymentStatus}
          activeClass="bg-emerald-600 text-white"
        />

        <FilterRow
          label="Status"
          filters={STATUS_FILTERS}
          activeValue={status}
          onSelect={setStatus}
          activeClass="bg-yumm-lilac text-white"
        />
      </div>
    </div>
  );
}

interface FilterRowProps<T> {
  label: string;
  filters: { value: T | undefined; label: string }[];
  activeValue: T | undefined;
  onSelect: (value: T | undefined) => void;
  activeClass: string;
}

function FilterRow<T extends string>({
  label,
  filters,
  activeValue,
  onSelect,
  activeClass,
}: FilterRowProps<T>) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </span>
      {filters.map((filter) => {
        const active = activeValue === filter.value;
        return (
          <button
            key={filter.label}
            type="button"
            onClick={() => onSelect(filter.value)}
            className={cn(
              "rounded-full px-3.5 py-1.5 font-display text-xs font-semibold transition-colors",
              active ? activeClass : "bg-white text-ink-muted hover:text-ink"
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}