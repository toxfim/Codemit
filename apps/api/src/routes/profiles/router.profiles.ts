import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { profileService } from "@codemit/db/services";

import {
  createProfileSchema,
  updateProfileSchema,
} from "../../validation/profiles";

const profilesRouter = new Hono();

profilesRouter.get("/", async (ctx) => {
  const { page, limit } = ctx.req.query();

  try {
    const result = await profileService.findManyPaginated({
      page: Number(page),
      limit: Number(limit),
    });
    return ctx.json({ status: "success", data: result });
  } catch (error) {
    return ctx.json(
      { status: "error", message: "Failed to fetch profiles" },
      500,
    );
  }
});

profilesRouter.post(
  "/",
  zValidator("json", createProfileSchema),
  async (ctx) => {
    const data = ctx.req.valid("json");
    console.log(
      "Received data for creating profile:",
      JSON.stringify(data, null, 2),
    );
    try {
      const result = await profileService.createOne(data);
      return ctx.json({ status: "success", data: result }, 201);
    } catch (error: Error | any) {
      return ctx.json({ status: "error", message: error.message }, 500);
    }
  },
);

profilesRouter.put(
  "/:id",
  zValidator("json", updateProfileSchema),
  async (ctx) => {
    const id = ctx.req.param("id");
    const data = ctx.req.valid("json");

    try {
      const result = await profileService.updateOneById(id, data);

      if (!result) {
        return ctx.json({ status: "error", message: "Profile not found" }, 404);
      }

      return ctx.json({ status: "success", data: result });
    } catch (error: Error | any) {
      return ctx.json({ status: "error", message: error.message }, 500);
    }
  },
);

profilesRouter.get("/:id", async (ctx) => {
  const id = ctx.req.param("id");

  try {
    const result = await profileService.findOneById(id);

    if (!result) {
      return ctx.json({ status: "error", message: "Profile not found" }, 404);
    }

    return ctx.json({ status: "success", data: result });
  } catch (error: Error | any) {
    return ctx.json({ status: "error", message: error.message }, 500);
  }
});

export default profilesRouter;
