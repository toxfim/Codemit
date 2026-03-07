import { z } from "zod";

export const createInviteSchema = z.object({
  role: z.enum(["MANAGER", "EMPLOYEE"]),
  expiresInHours: z.number().int().min(1).max(168).optional(),
});

export const botInviteStartSchema = z.object({
  token: z.string().min(10),
  telegramUserId: z.union([z.string(), z.number()]).transform(String),
  telegramUsername: z.string().max(255).optional(),
});

export const completeOnboardingSchema = z.object({
  token: z.string().min(10),
  fullName: z.string().min(2).max(255),
  password: z.string().min(6).max(128),
});
