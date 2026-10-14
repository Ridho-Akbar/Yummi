import { z } from "zod";

export const orderStatuses = [
  "pending",
  "confirmed",
  "done",
  "cancelled",
] as const;

export const updateOrderStatusSchema = z.object({
  orderId: z.string().uuid("ID pesanan tidak valid"),
  status: z.enum(orderStatuses, {
    message: "Status tidak dikenal",
  }),
});

export type OrderStatus = (typeof orderStatuses)[number];
