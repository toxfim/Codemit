import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(2).max(255),
  email: z.string().email().max(255),
  password: z.string().min(6).max(128),
  businessName: z.string().min(2).max(255).optional(),
  businessCategory: z.string().min(2).max(255).optional(),
});

export const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(6).max(128),
});

export const googleAuthSchema = z
  .object({
    idToken: z.string().min(20).optional(),
    googleId: z.string().min(3).max(255).optional(),
    email: z.string().email().max(255).optional(),
    fullName: z.string().min(2).max(255).optional(),
    avatarUrl: z.string().url().optional(),
  })
  .refine(
    (data) => Boolean(data.idToken || (data.googleId && data.email && data.fullName)),
    {
      message: "Provide idToken or googleId/email/fullName payload",
    },
  );

export const updateBusinessSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  category: z.string().min(2).max(255).optional(),
  aiFaq: z.string().max(10_000).optional(),
});
