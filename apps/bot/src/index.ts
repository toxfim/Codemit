import { createBot } from "./bot";

const bot = createBot();
bot.start({
  onStart: (info) => {
    console.log(`Bot started as @${info.username}`);
  },
});
