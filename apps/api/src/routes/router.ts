import { Hono } from "hono";
import { healthCheck } from ".";
import createUser from "./create-user";

const appRouter = new Hono();

appRouter.get("/health", healthCheck);
appRouter.route("/user", createUser);

export default appRouter;
