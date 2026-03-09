import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { businessesService, invitesService } from "@codemit/db/services";

import configs from "../../config";
import { createInviteSchema } from "../../validation/invites";
import { updateBusinessSchema } from "../../validation/businesses";
import { generateToken, hashToken } from "../../utils/security";
import { expireInviteIfNeeded } from "../../service/invite-flow";

const businessesRouter = new Hono();

businessesRouter.get("/:businessId", async (ctx) => {
  const { businessId } = ctx.req.param();
  const business = await businessesService.findById(businessId);

  if (!business) {
    return ctx.json({ status: "error", message: "Business not found" }, 404);
  }

  return ctx.json({
    status: "success",
    data: {
      business,
      membership: {
        role: "OWNER",
      },
    },
  });
});

businessesRouter.patch("/:businessId", zValidator("json", updateBusinessSchema), async (ctx) => {
  const { businessId } = ctx.req.param();
  const payload = ctx.req.valid("json");

  const updated = await businessesService.updateOneById(businessId, payload);

  if (!updated) {
    return ctx.json({ status: "error", message: "Business not found" }, 404);
  }

  return ctx.json({ status: "success", data: updated });
});

businessesRouter.get("/:businessId/invites", async (ctx) => {
  const { businessId } = ctx.req.param();
  const invites = await invitesService.listByBusinessId(businessId);

  const normalized = await Promise.all(
    invites.map(async (invite) => {
      const item = await expireInviteIfNeeded(invite.id);
      return item ?? invite;
    }),
  );

  return ctx.json({ status: "success", data: normalized });
});

businessesRouter.post(
  "/:businessId/invites",
  zValidator("json", createInviteSchema),
  async (ctx) => {
    const { businessId } = ctx.req.param();
    const business = await businessesService.findById(businessId);

    if (!business) {
      return ctx.json({ status: "error", message: "Business not found" }, 404);
    }

    const payload = ctx.req.valid("json");
    const token = generateToken(24);
    const tokenHash = hashToken(token);
    const expiresAt = new Date(
      Date.now() + (payload.expiresInHours ?? 48) * 60 * 60 * 1000,
    );

    const invite = await invitesService.createOne({
      businessId,
      invitedByUserId: business.ownerUserId,
      role: payload.role,
      tokenHash,
      expiresAt,
      status: "PENDING",
    });

    if (!invite) {
      return ctx.json({ status: "error", message: "Failed to create invite" }, 500);
    }

    const inviteLink = `https://t.me/${configs.BOT_USERNAME}?start=${token}`;
    const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}`;

    return ctx.json({
      status: "success",
      data: {
        invite,
        inviteLink,
        telegramShareUrl,
      },
    });
  },
);

businessesRouter.post("/:businessId/invites/:inviteId/cancel", async (ctx) => {
  const { businessId, inviteId } = ctx.req.param();

  const invite = await invitesService.cancelByBusinessAndId(businessId, inviteId);

  if (!invite) {
    return ctx.json({ status: "error", message: "Invite not found" }, 404);
  }

  return ctx.json({ status: "success", data: invite });
});

export default businessesRouter;
