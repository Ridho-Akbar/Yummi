"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { formatLongDate } from "@/lib/calendar";
import { MessageText } from "./BulkScheduleInputStage";
import type { ModalMessage } from "./BulkScheduleModal";
import type { ConflictEntry } from "@/features/schedule/types";
import { X } from "lucide-react";
import { ICON_SIZE } from "@/lib/icons";

interface BulkScheduleConfirmStageProps {
  startDate: string;
  endDate: string;
  isAvailable: boolean;
  note: string;
  conflicts: ConflictEntry[];
  totalDates: number;
  isPending: boolean;
  message: ModalMessage | null;
  onConfirmAll: () => void;
  onConfirmSkip: () => void;
  onBack: () => void;
  onClose: () => void;
}

export function BulkScheduleConfirmStage({
  startDate,
  endDate,
  isAvailable,
  note,
  conflicts,
  totalDates,
  isPending,
  message,
  onConfirmAll,
  onConfirmSkip,
  onBack,
  onClose,
}: BulkScheduleConfirmStageProps) {
  const untouchedCount = totalDates - conflicts.length;

  return (
    <>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-yumm-coral">
            Konfirmasi Diperlukan
          </p>
          <h2 className="mt-1 font-display text-lg font-bold text-ink">
            {conflicts.length} jadwal akan ditimpa
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
        <SummaryBox
          startDate={startDate}
          endDate={endDate}
          isAvailable={isAvailable}
          note={note}
          untouchedCount={untouchedCount}
          conflictCount={conflicts.length}
        />

        <ConflictList conflicts={conflicts} />

        {message && <MessageText message={message} />}

        <div className="space-y-2">
          <Button
            type="button"
            onClick={onConfirmSkip}
            disabled={isPending || untouchedCount === 0}
            variant="secondary"
            className="w-full"
          >
            {isPending
              ? "Memproses..."
              : untouchedCount === 0
              ? "Tidak ada tanggal kosong"
              : `Hanya isi ${untouchedCount} tanggal kosong`}
          </Button>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              disabled={isPending}
              className="flex-1"
            >
              Ubah
            </Button>
            <Button
              type="button"
              onClick={onConfirmAll}
              disabled={isPending}
              className="flex-1 bg-yumm-coral hover:bg-yumm-coral/80"
            >
              {isPending ? "Menyimpan..." : "Timpa semua"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

interface SummaryBoxProps {
  startDate: string;
  endDate: string;
  isAvailable: boolean;
  note: string;
  untouchedCount: number;
  conflictCount: number;
}

function SummaryBox({
  startDate,
  endDate,
  isAvailable,
  note,
  untouchedCount,
  conflictCount,
}: SummaryBoxProps) {
  return (
    <div className="rounded-yumm bg-yumm-lemon/30 px-4 py-3 text-xs text-ink">
      <p className="font-semibold">
        Rentang: {formatLongDate(startDate)} – {formatLongDate(endDate)}
      </p>
      <p className="mt-1">
        Status baru: <strong>{isAvailable ? "Tersedia" : "Tidak tersedia"}</strong>
        {note && (
          <>
            {" "}
            · Catatan: <em>{note}</em>
          </>
        )}
      </p>
      <p className="mt-1 text-ink-muted">
        {untouchedCount} tanggal belum punya jadwal, {conflictCount} tanggal
        akan ditimpa.
      </p>
    </div>
  );
}

function ConflictList({ conflicts }: { conflicts: ConflictEntry[] }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
        Jadwal yang akan ditimpa
      </p>
      <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
        {conflicts.map((c) => (
          <div
            key={c.date}
            className="rounded-yumm border border-neutral-100 px-3 py-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-display text-sm font-semibold text-ink">
                {formatLongDate(c.date)}
              </p>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase",
                  c.isAvailable
                    ? "bg-yumm-mint/30 text-emerald-700"
                    : "bg-yumm-coral/15 text-yumm-coral"
                )}
              >
                {c.isAvailable ? "Tersedia" : "Tutup"}
              </span>
            </div>
            {c.note && (
              <p className="mt-1 text-xs italic text-ink-muted">"{c.note}"</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
