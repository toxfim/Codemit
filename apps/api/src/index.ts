import { serve } from "@hono/node-server";

import configs from "./config";
import { honoApp } from "./lib";

serve(
  {
    fetch: honoApp.fetch,
    port: configs.PORT,
  },
  (event) => {
    console.log(`Server is running on port ${event.port}`);
  },
);
