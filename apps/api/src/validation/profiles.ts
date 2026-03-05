import z from "zod";
import { Constants } from "@codemit/db/helpers";

export const createProfileSchema = z.object({
  creatorId: z.number().int().positive(),
  name: z.string().min(1, "name_is_required"),
  description: z.string().min(1, "description_is_required"),
  status: z.enum(Constants.STATUS_BUSINESS_PROFILE).optional(),
});

export const updateProfileSchema = createProfileSchema.partial();
