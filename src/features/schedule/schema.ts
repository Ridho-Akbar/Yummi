import { z } from "zod";

export const scheduleEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal salah"),
  isAvailable: z.coerce.boolean(),
  note: z.string().trim().max(200).optional().or(z.literal("")),
});

export const deleteScheduleSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal salah"),
});

export const bulkScheduleSchema = z
  .object({
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal mulai salah"),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal akhir salah"),
    isAvailable: z.coerce.boolean(),
    note: z.string().trim().max(200).optional().or(z.literal("")),
    skipConflicts: z.coerce.boolean().default(false),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "Tanggal akhir harus setelah tanggal mulai",
    path: ["endDate"],
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      const diff = (end.getTime() - start.getTime()) / 86_400_000;
      return diff <= 90;
    },
    {
      message: "Maksimal 90 hari dalam satu kali pengaturan",
      path: ["endDate"],
    }
  );