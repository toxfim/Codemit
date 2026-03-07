import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  businessMembershipsService,
  invitesService,
  userSessionsService,
  usersService,
} from "@codemit/db/services";

import configs from "../../config";
import {
  botInviteStartSchema,
  completeOnboardingSchema,
} from "../../validation/invites";
import { generateToken, hashPassword, hashToken } from "../../utils/security";
import { expireInviteIfNeeded } from "../../service/auth-flow";

const invitesRouter = new Hono();

invitesRouter.get("/resolve-onboarding", async (ctx) => {
  const token = ctx.req.query("token");

  if (!token) {
    return ctx.json({ status: "error", message: "Token is required" }, 400);
  }

  const invite = await invitesService.findByOnboardingTokenHash(hashToken(token));

  if (!invite) {
    return ctx.json({ status: "error", message: "Invalid onboarding token" }, 404);
  }

  const normalizedInvite = await expireInviteIfNeeded(invite.id);
  if (!normalizedInvite || normalizedInvite.status !== "PENDING") {
    return ctx.json({ status: "error", message: "Invite is not available" }, 400);
  }

  if (
    !normalizedInvite.onboardingExpiresAt ||
    normalizedInvite.onboardingExpiresAt < new Date() ||
    normalizedInvite.onboardingConsumedAt
  ) {
    return ctx.json({ status: "error", message: "Onboarding token expired" }, 400);
  }

  return ctx.json({
    status: "success",
    data: {
      inviteId: normalizedInvite.id,
      businessId: normalizedInvite.businessId,
      role: normalizedInvite.role,
      status: normalizedInvite.status,
    },
  });
});

invitesRouter.post(
  "/bot/start",
  zValidator("json", botInviteStartSchema),
  async (ctx) => {
    const payload = ctx.req.valid("json");
    const invite = await invitesService.findByTokenHash(hashToken(payload.token));

    if (!invite) {
      return ctx.json({ status: "error", message: "Invalid invite token" }, 404);
    }

    const normalizedInvite = await expireInviteIfNeeded(invite.id);
    if (!normalizedInvite || normalizedInvite.status !== "PENDING") {
      return ctx.json({ status: "error", message: "Invite is not available" }, 400);
    }

    const onboardingRawToken = generateToken(24);
    const onboardingTokenHash = hashToken(onboardingRawToken);
    const onboardingExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const updatedInvite = await invitesService.markStarted({
      id: invite.id,
      telegramUserId: payload.telegramUserId,
      telegramUsername: payload.telegramUsername,
      onboardingTokenHash,
      onboardingExpiresAt,
    });

    if (!updatedInvite) {
      return ctx.json({ status: "error", message: "Failed to start onboarding" }, 500);
    }

    return ctx.json({
      status: "success",
      data: {
        onboardingUrl: `${configs.DASHBOARD_URL}/onboarding?token=${onboardingRawToken}`,
        inviteId: updatedInvite.id,
        businessId: updatedInvite.businessId,
      },
    });
  },
);

invitesRouter.post(
  "/complete-onboarding",
  zValidator("json", completeOnboardingSchema),
  async (ctx) => {
    const payload = ctx.req.valid("json");
    const invite = await invitesService.findByOnboardingTokenHash(hashToken(payload.token));

    if (!invite) {
      return ctx.json({ status: "error", message: "Invalid onboarding token" }, 404);
    }

    const normalizedInvite = await expireInviteIfNeeded(invite.id);
    if (!normalizedInvite || normalizedInvite.status !== "PENDING") {
      return ctx.json({ status: "error", message: "Invite is not available" }, 400);
    }

    if (
      !normalizedInvite.telegramUserId ||
      !normalizedInvite.onboardingExpiresAt ||
      normalizedInvite.onboardingExpiresAt < new Date() ||
      normalizedInvite.onboardingConsumedAt
    ) {
      return ctx.json({ status: "error", message: "Onboarding token expired" }, 400);
    }

    const telegramId = normalizedInvite.telegramUserId;

    let user = await usersService.findByTelegramId(telegramId);

    if (!user) {
      user = await usersService.createOne({
        fullName: payload.fullName,
        telegramId,
        passwordHash: hashPassword(payload.password),
      });
    } else {
      user =
        (await usersService.updateOneById(user.id, {
          fullName: payload.fullName,
          passwordHash: hashPassword(payload.password),
        })) ?? user;
    }

    if (!user) {
      return ctx.json({ status: "error", message: "Failed to create account" }, 500);
    }

    await businessMembershipsService.upsertMembershipRole(
      normalizedInvite.businessId,
      user.id,
      normalizedInvite.role,
    );

    const usedInvite = await invitesService.markUsed(normalizedInvite.id);

    const accessToken = generateToken(32);
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    await userSessionsService.createOne({
      userId: user.id,
      tokenHash: hashToken(accessToken),
      expiresAt,
    });

    return ctx.json({
      status: "success",
      data: {
        user,
        invite: usedInvite,
        accessToken,
        expiresAt,
      },
    });
  },
);

export default invitesRouter;
