import { z } from "zod";

export const createBusinessSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  type: z.enum(["RESTAURANT", "STORE", "MART"]),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().min(3, "Address is required"),
});

export type CreateBusinessInput = z.infer<typeof createBusinessSchema>;

export const updateBusinessSchema = createBusinessSchema.partial();

export type UpdateBusinessDto = z.infer<typeof updateBusinessSchema>;
