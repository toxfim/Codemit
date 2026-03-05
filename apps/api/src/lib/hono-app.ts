import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import appRouter from "../routes";

const app = new Hono();

app.use(cors());
app.use(logger());

app.route("/", appRouter);

export default app;
