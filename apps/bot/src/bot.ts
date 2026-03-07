import { Bot } from "grammy";

import configs from "./configs";
import { registerStartHandler } from "./handlers/start.handler";

export const createBot = () => {
  const bot = new Bot(configs.BOT_TOKEN);

  registerStartHandler(bot);

  return bot;
};
