import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { creatorService } from "@codemit/db/services";

import { createCreatorSchema, updateCreatorSchema } from "../../validation/creators";

const creatorsRouter = new Hono();

const parseNumberParam = (value: string) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

creatorsRouter.post("/", zValidator("json", createCreatorSchema), async (ctx) => {
  const data = ctx.req.valid("json");

  try {
    const result = await creatorService.createOne(data);
    return ctx.json({ status: "success", data: result }, 201);
  } catch (error: Error | any) {
    return ctx.json({ status: "error", message: error.message }, 500);
  }
});

creatorsRouter.put("/:id", zValidator("json", updateCreatorSchema), async (ctx) => {
  const id = parseNumberParam(ctx.req.param("id"));
  const data = ctx.req.valid("json");

  if (id === null) {
    return ctx.json({ status: "error", message: "Invalid creator id" }, 400);
  }

  try {
    const result = await creatorService.updateOneById(id, data);

    if (!result) {
      return ctx.json({ status: "error", message: "Creator not found" }, 404);
    }

    return ctx.json({ status: "success", data: result });
  } catch (error: Error | any) {
    return ctx.json({ status: "error", message: error.message }, 500);
  }
});

creatorsRouter.get("/:id", async (ctx) => {
  const id = parseNumberParam(ctx.req.param("id"));

  if (id === null) {
    return ctx.json({ status: "error", message: "Invalid creator id" }, 400);
  }

  try {
    const result = await creatorService.findOneById(id);

    if (!result) {
      return ctx.json({ status: "error", message: "Creator not found" }, 404);
    }

    return ctx.json({ status: "success", data: result });
  } catch (error: Error | any) {
    return ctx.json({ status: "error", message: error.message }, 500);
  }
});

creatorsRouter.get("/", async (ctx) => {
  const { page, limit } = ctx.req.query();

  try {
    const result = await creatorService.findManyPaginated({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    });

    return ctx.json({ status: "success", data: result });
  } catch (error: Error | any) {
    return ctx.json({ status: "error", message: error.message }, 500);
  }
});

export default creatorsRouter;
