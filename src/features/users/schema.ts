import { z } from "zod";

export const setUserRoleSchema = z.object({
  userId: z.string().uuid("ID user tidak valid"),
  role: z.enum(["user", "admin"], { message: "Role tidak valid" }),
});
