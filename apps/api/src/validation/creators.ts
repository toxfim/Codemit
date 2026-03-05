import z from "zod";
import { Constants } from "@codemit/db/helpers";

export const createCreatorSchema = z.object({
  firstName: z.string().nonempty("firstname_is_required"),
  lastName: z.string().nonempty("lastname_is_required"),
  phone: z
    .string()
    .nonempty("phone_is_required")
    .min(10, "phone_must_be_at_least_10_characters"),
  role: z.enum(Constants.USER_ROLE),
  telegramId: z.string().nonempty("telegram_id_required"),
  subscriptionPlan: z.enum(Constants.SUBS_PLAN).default("FREE"),
});

export const updateCreatorSchema = createCreatorSchema.partial();
