import { z } from "zod";

export const updateOrderItemSchema = z.object({
  productId: z.string().uuid(),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  qty: z.number().int().positive().max(999),
});

export const updateOrderSchema = z.object({
  orderId: z.string().uuid("ID pesanan tidak valid"),
  customerName: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter")
    .max(80, "Nama maksimal 80 karakter"),
  customerPhone: z
    .string()
    .trim()
    .regex(/^(\+62|62|0)8[1-9][0-9]{6,11}$/, "Nomor HP tidak valid"),
  customerAddress: z
    .string()
    .trim()
    .min(10, "Alamat minimal 10 karakter")
    .max(300, "Alamat maksimal 300 karakter"),
  orderDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal salah"),
  note: z.string().trim().max(500).optional().or(z.literal("")),
  items: z.array(updateOrderItemSchema).min(1, "Minimal satu produk"),
});

export const deleteOrderSchema = z.object({
  orderId: z.string().uuid("ID pesanan tidak valid"),
});

export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;