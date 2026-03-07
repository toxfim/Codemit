import type { Context, Next } from "hono";
import { createMiddleware } from "hono/factory";
import { businessMembershipsService, userSessionsService, usersService } from "@codemit/db/services";

import { hashToken } from "../utils/security";

type AuthPayload = {
  userId: string;
  sessionId: string;
};

export const authMiddleware = createMiddleware(async (ctx: Context, next: Next) => {
  const authorization = ctx.req.header("authorization");
  const bearerToken = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : null;

  if (!bearerToken) {
    return ctx.json({ status: "error", message: "Unauthorized" }, 401);
  }

  const tokenHash = hashToken(bearerToken);

  const session = await userSessionsService.findValidByTokenHash(tokenHash);

  if (!session) {
    return ctx.json({ status: "error", message: "Unauthorized" }, 401);
  }

  ctx.set("auth", { userId: session.userId, sessionId: session.id } as AuthPayload);

  await next();
});

export const getAuth = (ctx: Context) => {
  const auth = ctx.get("auth") as AuthPayload | undefined;
  if (!auth) {
    throw new Error("Auth context missing");
  }
  return auth;
};

export const getCurrentUser = async (ctx: Context) => {
  const { userId } = getAuth(ctx);
  return usersService.findById(userId);
};

export const getMembership = async (ctx: Context, businessId: string) => {
  const { userId } = getAuth(ctx);
  return businessMembershipsService.findByUserAndBusiness(userId, businessId);
};

export const requireRole = (role: "OWNER" | "MANAGER" | "EMPLOYEE", actualRole: string) => {
  const hierarchy = { OWNER: 3, MANAGER: 2, EMPLOYEE: 1 } as const;
  return hierarchy[actualRole as keyof typeof hierarchy] >= hierarchy[role];
};
