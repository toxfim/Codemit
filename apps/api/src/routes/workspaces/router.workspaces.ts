import { Hono } from "hono";
import { businessMembershipsService } from "@codemit/db/services";

import { authMiddleware, getAuth } from "../../middlewares/auth";

const workspacesRouter = new Hono();

workspacesRouter.use("*", authMiddleware);

workspacesRouter.get("/", async (ctx) => {
  const { userId } = getAuth(ctx);

  const memberships = await businessMembershipsService.listWorkspacesByUser(userId);

  return ctx.json({
    status: "success",
    data: memberships.map((item) => ({
      membershipId: item.membershipId,
      role: item.role,
      business: {
        id: item.businessId,
        name: item.name,
        category: item.category,
        aiFaq: item.aiFaq,
        ownerUserId: item.ownerUserId,
      },
    })),
  });
});

export default workspacesRouter;
