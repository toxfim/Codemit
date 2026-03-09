import { Hono } from "hono";
import { businessesService } from "@codemit/db/services";

const workspacesRouter = new Hono();

workspacesRouter.get("/", async (ctx) => {
  const businesses = await businessesService.listAll();

  return ctx.json({
    status: "success",
    data: businesses.map((business) => ({
      membershipId: business.id,
      role: "OWNER",
      business: {
        id: business.id,
        name: business.name,
        category: business.category,
        aiFaq: business.aiFaq,
        ownerUserId: business.ownerUserId,
      },
    })),
  });
});

export default workspacesRouter;
