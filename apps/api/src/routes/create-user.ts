import { Hono } from "hono";
import { creatorService } from "@codemit/db/services";

const createUser = new Hono();

createUser.post("/", async (ctx) => {
  const body = await ctx.req.json();

  const result = await creatorService.createOne({
    firstName: body.firstName,
    lastName: body.lastName,
    phone: body.phone,
    role: "EMPLOYEE",
    telegramId: body.telegramId,
    subscriptionPlan: "FREE",
  });

  return ctx.json({ status: "success", data: result });
});

export default createUser;
