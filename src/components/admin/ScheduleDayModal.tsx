"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { ICON_SIZE } from "@/lib/icons";
import { Button } from "@/components/ui/Button";
import {
  saveScheduleEntry,
  deleteScheduleEntry,
  type ScheduleState,
} from "@/features/schedule/actions";
import type { ScheduleEntry } from "@/features/schedule/queries";

interface ScheduleDayModalProps {
  date: Date;
  entry?: ScheduleEntry;
  onClose: () => void;
}

const initialState: ScheduleState = {};

export function ScheduleDayModal({
  date,
  entry,
  onClose,
}: ScheduleDayModalProps) {
  const [isAvailable, setIsAvailable] = useState(entry?.isAvailable ?? true);
  const [note, setNote] = useState(entry?.note ?? "");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [saveState, saveAction] = useActionState(
    saveScheduleEntry,
    initialState
  );
  const [deleteState, deleteAction] = useActionState(
    deleteScheduleEntry,
    initialState
  );

  const dateStr = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");

  const isDefaultState = isAvailable && !note.trim();

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

  useEffect(() => {
    if (saveState.success || deleteState.success) {
      const timer = setTimeout(onClose, 900);
      return () => clearTimeout(timer);
    }
  }, [saveState.success, deleteState.success, onClose]);

  const formatted = date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const error = saveState.error ?? deleteState.error;
  const success = saveState.success ?? deleteState.success;

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
              Atur Jadwal
            </p>
            <h2 className="mt-1 font-display text-lg font-bold text-ink">
              {formatted}
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

        <form action={saveAction} className="space-y-4">
          <input type="hidden" name="date" value={dateStr} />
          <input
            type="hidden"
            name="isAvailable"
            value={isAvailable ? "on" : ""}
          />

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Status
            </p>
            <div className="grid grid-cols-2 gap-2">
              <StatusToggle
                active={isAvailable}
                activeClass="border-emerald-500 bg-yumm-mint/30 text-emerald-700"
                label="Tersedia"
                onClick={() => setIsAvailable(true)}
              />
              <StatusToggle
                active={!isAvailable}
                activeClass="border-yumm-coral bg-yumm-coral/10 text-yumm-coral"
                label="Tidak tersedia"
                onClick={() => setIsAvailable(false)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="note"
              className="block text-xs font-semibold uppercase tracking-wide text-ink-muted"
            >
              Catatan (opsional)
            </label>
            <textarea
              id="note"
              name="note"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Libur nasional, hanya terima pesanan sebelum jam 12"
              className="w-full rounded-yumm border border-neutral-200 bg-surface px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink-muted/60 focus:border-yumm-pink focus:outline-hidden focus:ring-2 focus:ring-yumm-pink/20"
            />
          </div>

          {isDefaultState && (
            <div className="rounded-yumm bg-surface-muted px-4 py-3 text-xs text-ink-muted">
              Menandai tersedia tanpa catatan berarti tanggal ini kembali ke
              pengaturan default. Tidak ada jadwal khusus yang disimpan.
            </div>
          )}

          {error && !confirmingDelete && (
            <p className="text-xs text-yumm-coral">{error}</p>
          )}
          {success && (
            <p className="text-xs text-emerald-600">{success}</p>
          )}

          <SaveSubmitButton isDefaultState={isDefaultState} />
        </form>

        {entry && (
          <div className="border-t border-neutral-100 pt-4">
            {!confirmingDelete ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setConfirmingDelete(true)}
                className="w-full border border-yumm-coral/40 text-yumm-coral hover:bg-yumm-coral/10"
              >
                Hapus jadwal
              </Button>
            ) : (
              <form
                action={deleteAction}
                className="space-y-3 rounded-yumm border border-yumm-coral/40 bg-yumm-coral/5 p-4"
              >
                <input type="hidden" name="date" value={dateStr} />
                <p className="text-xs text-ink">
                  Jadwal tanggal ini akan dihapus dan kembali ke pengaturan
                  default.
                </p>
                {deleteState.error && (
                  <p className="text-xs text-yumm-coral">
                    {deleteState.error}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setConfirmingDelete(false)}
                    className="flex-1"
                  >
                    Batal
                  </Button>
                  <DeleteSubmitButton />
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface StatusToggleProps {
  active: boolean;
  activeClass: string;
  label: string;
  onClick: () => void;
}

function StatusToggle({
  active,
  activeClass,
  label,
  onClick,
}: StatusToggleProps) {
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

function SaveSubmitButton({ isDefaultState }: { isDefaultState: boolean }) {
  const { pending } = useFormStatus();
  const label = isDefaultState ? "Kembalikan ke default" : "Simpan";
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Menyimpan..." : label}
    </Button>
  );
}

function DeleteSubmitButton() {
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