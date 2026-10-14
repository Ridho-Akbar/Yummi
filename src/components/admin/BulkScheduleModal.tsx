"use client";

import { useEffect, useState, useTransition } from "react";
import { BulkScheduleInputStage } from "./BulkScheduleInputStage";
import { BulkScheduleConfirmStage } from "./BulkScheduleConfirmStage";
import {
  previewBulkScheduleRange,
  applyBulkScheduleRange,
} from "@/features/schedule/actions";
import type { ConflictEntry } from "@/features/schedule/types";

interface BulkScheduleModalProps {
  trigger: React.ReactNode;
}

export interface ModalMessage {
  type: "error" | "success";
  text: string;
}

type Stage = "input" | "confirm";

export function BulkScheduleModal({ trigger }: BulkScheduleModalProps) {
  const today = new Date().toISOString().slice(0, 10);

  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("input");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<ModalMessage | null>(null);
  const [conflicts, setConflicts] = useState<ConflictEntry[]>([]);
  const [totalDates, setTotalDates] = useState(0);

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [isAvailable, setIsAvailable] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) {
      setStage("input");
      setConflicts([]);
      setTotalDates(0);
      setMessage(null);
      setStartDate(today);
      setEndDate(today);
      setIsAvailable(false);
      setNote("");
    }
  }, [open, today]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open]);

  function buildFormData(skipConflicts = false) {
    const fd = new FormData();
    fd.set("startDate", startDate);
    fd.set("endDate", endDate);
    fd.set("isAvailable", isAvailable ? "on" : "");
    fd.set("note", note);
    if (skipConflicts) fd.set("skipConflicts", "on");
    return fd;
  }

  function applyAndClose(skipConflicts: boolean) {
    setMessage(null);
    startTransition(async () => {
      const applied = await applyBulkScheduleRange(
        buildFormData(skipConflicts)
      );
      if (applied.error) {
        setMessage({ type: "error", text: applied.error });
        return;
      }
      setMessage({
        type: "success",
        text: applied.success ?? "Berhasil.",
      });
      setTimeout(() => setOpen(false), 1200);
    });
  }

  function handlePreview() {
    setMessage(null);
    startTransition(async () => {
      const preview = await previewBulkScheduleRange(buildFormData());

      if (preview.error) {
        setMessage({ type: "error", text: preview.error });
        return;
      }

      const found = preview.conflicts ?? [];
      if (found.length === 0) {
        applyAndClose(false);
        return;
      }

      setConflicts(found);
      setTotalDates(preview.totalDates ?? 0);
      setStage("confirm");
    });
  }

  function handleBack() {
    setStage("input");
    setConflicts([]);
    setMessage(null);
  }

  if (!open) {
    return <div onClick={() => setOpen(true)}>{trigger}</div>;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center"
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-yumm-lg bg-white p-6 shadow-xl"
      >
        {stage === "input" ? (
          <BulkScheduleInputStage
            startDate={startDate}
            endDate={endDate}
            isAvailable={isAvailable}
            note={note}
            isPending={isPending}
            message={message}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onAvailabilityChange={setIsAvailable}
            onNoteChange={setNote}
            onSubmit={handlePreview}
            onClose={() => setOpen(false)}
          />
        ) : (
          <BulkScheduleConfirmStage
            startDate={startDate}
            endDate={endDate}
            isAvailable={isAvailable}
            note={note}
            conflicts={conflicts}
            totalDates={totalDates}
            isPending={isPending}
            message={message}
            onConfirmAll={() => applyAndClose(false)}
            onConfirmSkip={() => applyAndClose(true)}
            onBack={handleBack}
            onClose={() => setOpen(false)}
          />
        )}
      </div>
    </div>
  );
}