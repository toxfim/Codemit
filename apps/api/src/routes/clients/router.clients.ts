import { Hono } from "hono";
import { clientsService } from "@codemit/db/services";

const clientsRouter = new Hono();

const parseNumberParam = (value: string) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

clientsRouter.get("/", async (ctx) => {
  const { page, limit } = ctx.req.query();

  try {
    const result = await clientsService.findManyPaginated({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    });

    return ctx.json({ status: "success", data: result });
  } catch (error: Error | any) {
    return ctx.json({ status: "error", message: error.message }, 500);
  }
});

clientsRouter.get("/:id", async (ctx) => {
  const id = parseNumberParam(ctx.req.param("id"));

  if (id === null) {
    return ctx.json({ status: "error", message: "Invalid client id" }, 400);
  }

  try {
    const result = await clientsService.findOneById(id);

    if (!result) {
      return ctx.json({ status: "error", message: "Client not found" }, 404);
    }

    return ctx.json({ status: "success", data: result });
  } catch (error: Error | any) {
    return ctx.json({ status: "error", message: error.message }, 500);
  }
});

export default clientsRouter;
