import { z } from "zod";

export const faqItemSchema = z.object({
  id: z.string().uuid().nullable().optional(),
  question: z
    .string()
    .trim()
    .min(5, "Pertanyaan minimal 5 karakter")
    .max(200, "Pertanyaan maksimal 200 karakter"),
  answer: z
    .string()
    .trim()
    .min(5, "Jawaban minimal 5 karakter")
    .max(1000, "Jawaban maksimal 1000 karakter"),
  isActive: z.coerce.boolean(),
});

export const faqListSchema = z.object({
  items: z.array(faqItemSchema).min(1, "Minimal 1 FAQ").max(20, "Maksimal 20 FAQ"),
});

export type FaqItemInput = z.infer<typeof faqItemSchema>;
