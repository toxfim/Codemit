import type { Context } from "hono";

const healthCheck = (ctx: Context) => {
  return ctx.json({
    status: "ok",
  });
};

export default healthCheck;
