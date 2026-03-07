import { Hono } from "hono";

import { healthCheck } from ".";
import { authRouter } from "./auth";
import { businessesRouter } from "./businesses";
import { clientsRouter } from "./clients";
import { creatorsRouter } from "./creators";
import { invitesRouter } from "./invites";
import { profilesRouter } from "./profiles";
import { workspacesRouter } from "./workspaces";

const appRouter = new Hono();

appRouter.get("/", (c) =>
  c.json({
    message: "Welcome to the API!",
    description: "This is the main entry point for the API.",
  }),
);

appRouter.get("/health", healthCheck);
appRouter.route("/clients", clientsRouter);
appRouter.route("/creators", creatorsRouter);
appRouter.route("/profiles", profilesRouter);
appRouter.route("/auth", authRouter);
appRouter.route("/workspaces", workspacesRouter);
appRouter.route("/businesses", businessesRouter);
appRouter.route("/invites", invitesRouter);

export default appRouter;
