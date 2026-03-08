import { z } from "zod";

export const updateBusinessSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  category: z.string().min(2).max(255).optional(),
  aiFaq: z.string().max(10_000).optional(),
});
