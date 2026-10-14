import { z } from "zod";

export const paymentStatuses = ["unpaid", "dp", "paid"] as const;
export type PaymentStatus = (typeof paymentStatuses)[number];

export const MIN_DP_AMOUNT = 10_000;

export const updatePaymentSchema = z
  .object({
    orderId: z.string().uuid("ID pesanan tidak valid"),
    status: z.enum(paymentStatuses, { message: "Status tidak valid" }),
    amountPaid: z.coerce.number().nonnegative().default(0),
  })
  .refine(
    (data) => {
      if (data.status === "dp") return data.amountPaid >= MIN_DP_AMOUNT;
      return true;
    },
    {
      message: `Nominal DP minimal Rp${MIN_DP_AMOUNT.toLocaleString("id-ID")}`,
      path: ["amountPaid"],
    }
  );