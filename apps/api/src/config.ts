import { getEnv } from "@codemit/shared/utils";

const configs = {
  PORT: Number(getEnv("PORT", "4400")),
  BOT_TOKEN: getEnv("BOT_TOKEN"),
  BOT_USERNAME: getEnv("BOT_USERNAME", "codemit_bot"),
  DASHBOARD_URL: getEnv("DASHBOARD_URL", "http://localhost:3000"),
  GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID", ""),
  DEVS_CHAT_ID: getEnv("DEVS_CHAT_ID").split("/").map(Number),
};

export default configs;
