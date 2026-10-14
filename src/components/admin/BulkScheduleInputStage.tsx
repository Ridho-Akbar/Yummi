"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { ModalMessage } from "./BulkScheduleModal";
import { X } from "lucide-react";
import { ICON_SIZE } from "@/lib/icons";

interface BulkScheduleInputStageProps {
  startDate: string;
  endDate: string;
  isAvailable: boolean;
  note: string;
  isPending: boolean;
  message: ModalMessage | null;
  onStartDateChange: (v: string) => void;
  onEndDateChange: (v: string) => void;
  onAvailabilityChange: (v: boolean) => void;
  onNoteChange: (v: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function BulkScheduleInputStage({
  startDate,
  endDate,
  isAvailable,
  note,
  isPending,
  message,
  onStartDateChange,
  onEndDateChange,
  onAvailabilityChange,
  onNoteChange,
  onSubmit,
  onClose,
}: BulkScheduleInputStageProps) {
  return (
    <>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Atur Rentang Tanggal
          </p>
          <h2 className="mt-1 font-display text-lg font-bold text-ink">
            Tutup atau buka banyak tanggal
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

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <DateInput
            id="startDate"
            label="Dari tanggal"
            value={startDate}
            onChange={onStartDateChange}
          />
          <DateInput
            id="endDate"
            label="Sampai tanggal"
            value={endDate}
            onChange={onEndDateChange}
          />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Status
          </p>
          <div className="grid grid-cols-2 gap-2">
            <StatusButton
              active={!isAvailable}
              activeClass="border-yumm-coral bg-yumm-coral/10 text-yumm-coral"
              label="Tutup"
              onClick={() => onAvailabilityChange(false)}
            />
            <StatusButton
              active={isAvailable}
              activeClass="border-emerald-500 bg-yumm-mint/30 text-emerald-700"
              label="Buka"
              onClick={() => onAvailabilityChange(true)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="bulk-note"
            className="block text-xs font-semibold uppercase tracking-wide text-ink-muted"
          >
            Catatan (opsional)
          </label>
          <input
            id="bulk-note"
            type="text"
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="Contoh: Libur Lebaran"
            className="w-full rounded-yumm border border-neutral-200 bg-surface px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink-muted/60 focus:border-yumm-pink focus:outline-hidden focus:ring-2 focus:ring-yumm-pink/20"
          />
        </div>

        <div className="rounded-yumm bg-surface-muted px-4 py-3 text-xs text-ink-muted">
          Maksimal 90 hari per sekali pengaturan. Kalau ada jadwal lama di
          rentang itu, kamu akan diminta konfirmasi.
        </div>

        {message && <MessageText message={message} />}

        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isPending}
            className="flex-1"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isPending}
            className="flex-1"
          >
            {isPending ? "Memeriksa..." : "Terapkan"}
          </Button>
        </div>
      </div>
    </>
  );
}

interface DateInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}

function DateInput({ id, label, value, onChange }: DateInputProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-xs font-semibold uppercase tracking-wide text-ink-muted"
      >
        {label}
      </label>
      <input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-yumm border border-neutral-200 bg-surface px-4 py-2.5 font-body text-sm text-ink focus:border-yumm-pink focus:outline-hidden focus:ring-2 focus:ring-yumm-pink/20"
      />
    </div>
  );
}

interface StatusButtonProps {
  active: boolean;
  activeClass: string;
  label: string;
  onClick: () => void;
}

function StatusButton({
  active,
  activeClass,
  label,
  onClick,
}: StatusButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-yumm border-2 px-4 py-3 font-display text-sm font-semibold transition-all",
        active
          ? activeClass
          : "border-neutral-200 bg-white text-ink-muted hover:border-neutral-300"
      )}
    >
      {label}
    </button>
  );
}

export function MessageText({ message }: { message: ModalMessage }) {
  return (
    <p
      className={cn(
        "text-xs",
        message.type === "error" ? "text-yumm-coral" : "text-emerald-600"
      )}
    >
      {message.text}
    </p>
  );
}
