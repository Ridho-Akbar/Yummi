import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  price: z.coerce
    .number()
    .min(1000, "Harga minimal Rp1.000")
    .max(100_000_000, "Harga maksimal Rp100.000.000"),
  imageUrl: z.string().trim().url("URL tidak valid").optional().or(z.literal("")),
  isAvailable: z.coerce.boolean(),
  readyStock: z.coerce
    .number()
    .int()
    .nonnegative("Stok tidak boleh negatif"),
  dailyCapacity: z.coerce
    .number()
    .int()
    .nonnegative("Kapasitas tidak boleh negatif"),
  minOrderQty: z.coerce
    .number()
    .int()
    .min(1, "Minimum order minimal 1")
    .max(999, "Minimum order maksimal 999")
    .default(1),
});

export const createProductSchema = productSchema;

export const updateProductSchema = productSchema.extend({
  productId: z.string().uuid("ID produk tidak valid"),
});

export type ProductInput = z.infer<typeof productSchema>;