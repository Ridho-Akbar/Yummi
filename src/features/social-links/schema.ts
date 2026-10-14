import { z } from "zod";

export const socialLinkItemSchema = z.object({
  id: z.string().uuid().nullable().optional(),
  platform: z.string().trim().min(1, "Platform wajib").max(40),
  url: z.string().trim().url("URL tidak valid").max(500),
  isActive: z.coerce.boolean(),
});

export const socialLinkListSchema = z.object({
  items: z.array(socialLinkItemSchema).max(10, "Maksimal 10 sosial media"),
});

export type SocialLinkItemInput = z.infer<typeof socialLinkItemSchema>;
