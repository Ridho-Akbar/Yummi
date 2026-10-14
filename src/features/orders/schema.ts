import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.string().uuid(),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  qty: z.number().int().positive().max(999),
});

export const createOrderSchema = z.object({
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
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Pilih tanggal pengiriman"),
  note: z.string().trim().max(500).optional().or(z.literal("")),
  items: z.array(orderItemSchema).min(1, "Pilih minimal satu produk"),
  accessPassword: z.string().optional().or(z.literal("")),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;