import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { OAuth2Client } from "google-auth-library";

import configs from "../../config";
import { authMiddleware, getCurrentUser } from "../../middlewares/auth";
import { loginGoogle, loginLocal, registerOwner } from "../../service/auth-flow";
import { googleAuthSchema, loginSchema, registerSchema } from "../../validation/auth";

const authRouter = new Hono();
const googleClient = new OAuth2Client();

authRouter.post("/register", zValidator("json", registerSchema), async (ctx) => {
  try {
    const payload = ctx.req.valid("json");
    const result = await registerOwner(payload);

    return ctx.json({
      status: "success",
      data: {
        accessToken: result.session.accessToken,
        expiresAt: result.session.expiresAt,
        user: result.user,
        business: result.business,
      },
    });
  } catch (error: Error | any) {
    return ctx.json({ status: "error", message: error.message }, 400);
  }
});

authRouter.post("/login", zValidator("json", loginSchema), async (ctx) => {
  try {
    const payload = ctx.req.valid("json");
    const result = await loginLocal(payload);

    return ctx.json({
      status: "success",
      data: {
        accessToken: result.session.accessToken,
        expiresAt: result.session.expiresAt,
        user: result.user,
      },
    });
  } catch (error: Error | any) {
    return ctx.json({ status: "error", message: error.message }, 400);
  }
});

authRouter.post("/google", zValidator("json", googleAuthSchema), async (ctx) => {
  try {
    const payload = ctx.req.valid("json");

    let googlePayload: {
      googleId: string;
      email: string;
      fullName: string;
      avatarUrl?: string;
    };

    if (payload.idToken) {
      if (!configs.GOOGLE_CLIENT_ID) {
        return ctx.json(
          { status: "error", message: "GOOGLE_CLIENT_ID is not configured" },
          500,
        );
      }

      const ticket = await googleClient.verifyIdToken({
        idToken: payload.idToken,
        audience: configs.GOOGLE_CLIENT_ID,
      });
      const verified = ticket.getPayload();

      if (!verified?.sub || !verified.email || !verified.name) {
        return ctx.json({ status: "error", message: "Invalid Google token" }, 400);
      }

      googlePayload = {
        googleId: verified.sub,
        email: verified.email,
        fullName: verified.name,
        avatarUrl: verified.picture,
      };
    } else {
      googlePayload = {
        googleId: payload.googleId!,
        email: payload.email!,
        fullName: payload.fullName!,
        avatarUrl: payload.avatarUrl,
      };
    }

    const result = await loginGoogle(googlePayload);

    return ctx.json({
      status: "success",
      data: {
        accessToken: result.session.accessToken,
        expiresAt: result.session.expiresAt,
        user: result.user,
        business: result.business,
      },
    });
  } catch (error: Error | any) {
    return ctx.json({ status: "error", message: error.message }, 400);
  }
});

authRouter.get("/me", authMiddleware, async (ctx) => {
  const user = await getCurrentUser(ctx);
  if (!user) {
    return ctx.json({ status: "error", message: "User not found" }, 404);
  }
  return ctx.json({ status: "success", data: user });
});

export default authRouter;
