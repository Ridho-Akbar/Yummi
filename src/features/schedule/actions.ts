"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { toDateString } from "@/lib/calendar";
import {
  scheduleEntrySchema,
  deleteScheduleSchema,
  bulkScheduleSchema,
} from "./schema";
import type {
  ConflictEntry,
  BulkPreviewResult,
  BulkApplyResult,
} from "./types";

export interface ScheduleState {
  error?: string;
  success?: string;
}

export async function saveScheduleEntry(
  _prevState: ScheduleState,
  formData: FormData
): Promise<ScheduleState> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Akses ditolak." };
  }

  const parsed = scheduleEntrySchema.safeParse({
    date: formData.get("date"),
    isAvailable: formData.get("isAvailable") === "on",
    note: formData.get("note") ?? "",
  });

  if (!parsed.success) {
    return { error: "Data tidak valid." };
  }

  const supabase = await createClient();

  // State default adalah "tersedia tanpa catatan". Karena itu secara semantik
  // sama dengan tidak punya jadwal khusus, hapus entry supaya tidak ada baris
  // kosong yang membingungkan di database.
  if (parsed.data.isAvailable && !parsed.data.note) {
    const { error } = await supabase
      .from("schedule")
      .delete()
      .eq("date", parsed.data.date);

    if (error) {
      return { error: "Gagal menyimpan. Coba lagi." };
    }

    revalidatePath("/admin/schedule");
    revalidatePath("/");

    return {
      success: "Tanggal ini kembali ke pengaturan default.",
    };
  }

  const { error } = await supabase.from("schedule").upsert(
    {
      date: parsed.data.date,
      is_available: parsed.data.isAvailable,
      note: parsed.data.note || null,
    },
    { onConflict: "date" }
  );

  if (error) {
    return { error: "Gagal menyimpan. Coba lagi." };
  }

  revalidatePath("/admin/schedule");
  revalidatePath("/");

  return { success: "Jadwal berhasil disimpan." };
}

export async function deleteScheduleEntry(
  _prevState: ScheduleState,
  formData: FormData
): Promise<ScheduleState> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Akses ditolak." };
  }

  const parsed = deleteScheduleSchema.safeParse({
    date: formData.get("date"),
  });

  if (!parsed.success) {
    return { error: "Data tidak valid." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("schedule")
    .delete()
    .eq("date", parsed.data.date);

  if (error) {
    return { error: "Gagal menghapus. Coba lagi." };
  }

  revalidatePath("/admin/schedule");
  revalidatePath("/");

  return { success: "Jadwal berhasil dihapus." };
}

function buildDateRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const cursor = new Date(start);
  const last = new Date(end);
  while (cursor <= last) {
    dates.push(toDateString(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

export async function previewBulkScheduleRange(
  formData: FormData
): Promise<BulkPreviewResult> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Akses ditolak." };
  }

  const parsed = bulkScheduleSchema.safeParse({
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    isAvailable: formData.get("isAvailable") === "on",
    note: formData.get("note") ?? "",
    skipConflicts: false,
  });

  if (!parsed.success) {
    const firstError = Object.values(
      parsed.error.flatten().fieldErrors
    )[0]?.[0];
    return { error: firstError ?? "Data tidak valid." };
  }

  const dates = buildDateRange(parsed.data.startDate, parsed.data.endDate);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("schedule")
    .select("date, is_available, note")
    .in("date", dates)
    .order("date");

  if (error) {
    return { error: "Gagal memeriksa jadwal. Coba lagi." };
  }

  const conflicts: ConflictEntry[] = (data ?? []).map((s) => ({
    date: s.date,
    isAvailable: s.is_available,
    note: s.note,
  }));

  return {
    conflicts,
    totalDates: dates.length,
  };
}

export async function applyBulkScheduleRange(
  formData: FormData
): Promise<BulkApplyResult> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Akses ditolak." };
  }

  const parsed = bulkScheduleSchema.safeParse({
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    isAvailable: formData.get("isAvailable") === "on",
    note: formData.get("note") ?? "",
    skipConflicts: formData.get("skipConflicts") === "on",
  });

  if (!parsed.success) {
    const firstError = Object.values(
      parsed.error.flatten().fieldErrors
    )[0]?.[0];
    return { error: firstError ?? "Data tidak valid." };
  }

  const supabase = await createClient();
  let dates = buildDateRange(parsed.data.startDate, parsed.data.endDate);

  if (parsed.data.skipConflicts) {
    const { data: existing, error: checkError } = await supabase
      .from("schedule")
      .select("date")
      .in("date", dates);

    if (checkError) {
      return { error: "Gagal memeriksa jadwal. Coba lagi." };
    }

    const existingSet = new Set((existing ?? []).map((e) => e.date));
    dates = dates.filter((d) => !existingSet.has(d));

    if (dates.length === 0) {
      return {
        success:
          "Semua tanggal di rentang sudah punya jadwal. Tidak ada yang diubah.",
        count: 0,
      };
    }
  }

  // Sama seperti single entry: state default dihapus, bukan disimpan.
  if (parsed.data.isAvailable && !parsed.data.note) {
    const { error } = await supabase
      .from("schedule")
      .delete()
      .in("date", dates);

    if (error) {
      return { error: "Gagal menyimpan. Coba lagi." };
    }

    revalidatePath("/admin/schedule");
    revalidatePath("/");

    return {
      success: `${dates.length} tanggal kembali ke pengaturan default.`,
      count: dates.length,
    };
  }

  const rows = dates.map((date) => ({
    date,
    is_available: parsed.data.isAvailable,
    note: parsed.data.note || null,
  }));

  const { error } = await supabase
    .from("schedule")
    .upsert(rows, { onConflict: "date" });

  if (error) {
    return { error: "Gagal menyimpan. Coba lagi." };
  }

  revalidatePath("/admin/schedule");
  revalidatePath("/");

  return {
    success: `${dates.length} tanggal berhasil diatur.`,
    count: dates.length,
  };
}