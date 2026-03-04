import { getEnv } from "@codemit/shared/utils";

const configs = {
  PORT: Number(getEnv("PORT", "4400")),
  BOT_TOKEN: getEnv("BOT_TOKEN"),
  DEVS_CHAT_ID: getEnv("DEVS_CHAT_ID").split("/").map(Number),
};

export default configs;
