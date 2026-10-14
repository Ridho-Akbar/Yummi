import { z } from "zod";

const storeInfoSchema = z.object({
  name: z.string().trim().min(1, "Nama toko wajib").max(80),
  tagline: z.string().trim().max(160).optional().or(z.literal("")),
  address: z.string().trim().max(300).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  email: z
    .string()
    .trim()
    .email("Email tidak valid")
    .optional()
    .or(z.literal("")),
  hours: z.string().trim().max(200).optional().or(z.literal("")),
});

const heroSchema = z.object({
  tagline: z.string().trim().min(1, "Tagline wajib").max(160),
  subtitle: z.string().trim().max(300).optional().or(z.literal("")),
});

const whyChooseItemSchema = z.object({
  title: z.string().trim().min(1).max(60),
  desc: z.string().trim().min(1).max(240),
});

const howToOrderItemSchema = z.object({
  title: z.string().trim().min(1).max(60),
  desc: z.string().trim().min(1).max(240),
});

const whatsappSchema = z.object({
  url: z
    .string()
    .trim()
    .url("URL tidak valid")
    .optional()
    .or(z.literal("")),
  floatingEnabled: z.coerce.boolean(),
});

const footerSchema = z.object({
  tagline: z.string().trim().max(200).optional().or(z.literal("")),
  copyright: z.string().trim().max(120).optional().or(z.literal("")),
});

const homepageConfigSchema = z.object({
  latestCount: z.coerce.number().int().min(0).max(6).default(2),
  terlarisCount: z.coerce.number().int().min(0).max(6).default(2),
  bestSellerCount: z.coerce.number().int().min(0).max(6).default(2),
});

export const updateOrderPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .trim()
      .min(6, "Sandi minimal 6 karakter")
      .max(100, "Sandi maksimal 100 karakter"),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi sandi tidak cocok",
    path: ["confirmPassword"],
  });

export const storeInfoFormSchema = storeInfoSchema;
export const heroFormSchema = heroSchema;
export const whyChooseFormSchema = z.object({
  items: z.array(whyChooseItemSchema).min(1).max(6),
});
export const howToOrderFormSchema = z.object({
  items: z.array(howToOrderItemSchema).min(1).max(6),
});
export const whatsappFormSchema = whatsappSchema;
export const footerFormSchema = footerSchema;
export const homepageConfigFormSchema = homepageConfigSchema;

export type StoreInfoInput = z.infer<typeof storeInfoSchema>;
export type HeroInput = z.infer<typeof heroSchema>;
export type WhyChooseInput = z.infer<typeof whyChooseItemSchema>;
export type HowToOrderInput = z.infer<typeof howToOrderItemSchema>;
export type WhatsappInput = z.infer<typeof whatsappSchema>;
export type FooterInput = z.infer<typeof footerSchema>;
export type HomepageConfigInput = z.infer<typeof homepageConfigSchema>;