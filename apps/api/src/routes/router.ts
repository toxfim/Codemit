import { Hono } from "hono";

import { healthCheck } from ".";
import { clientsRouter } from "./clients/";
import { creatorsRouter } from "./creators/";
import { profilesRouter } from "./profiles/";

const appRouter = new Hono();

appRouter.get("/health", healthCheck);
appRouter.route("/clients", clientsRouter);
appRouter.route("/creators", creatorsRouter);
appRouter.route("/profiles", profilesRouter);

export default appRouter;
