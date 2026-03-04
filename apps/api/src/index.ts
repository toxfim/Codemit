import { serve } from "@hono/node-server";
import { Hono } from "hono";
import configs from "./config";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import codemitBot from "./service/bot-api";

const app = new Hono();

app.use(cors());
app.use(logger());

app.get("/", (c) => c.text("Hello World!"));

app.get("/test-bot", async (c) => {
  configs.DEVS_CHAT_ID.forEach(async (chatId) => {
    const response = await codemitBot.sendMessage({
      chatId,
      text: "Hello World!"
    });
    console.log(response);
  });

  return c.json({
    message: "Hello World!",
  });
});

serve(
  {
    fetch: app.fetch,
    port: configs.PORT,
  },
  (event) => {
    console.log(`Server is running on port ${event.port}`);
  },
);
