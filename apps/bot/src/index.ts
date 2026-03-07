import { Bot } from "grammy";

import configs from "./configs";

const bot = new Bot(configs.BOT_TOKEN);

bot.command("start", async (ctx) => {
  const rawText = ctx.message?.text ?? "";
  const token = rawText.split(" ").at(1);

  if (!token) {
    await ctx.reply("Welcome! Open an invite link from your manager to start onboarding.");
    return;
  }

  if (!ctx.from) {
    await ctx.reply("Could not read Telegram user identity.");
    return;
  }

  try {
    const response = await fetch(`${configs.API_BASE_URL}/invites/bot/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        telegramUserId: String(ctx.from.id),
        telegramUsername: ctx.from.username ?? undefined,
      }),
    });

    const data = (await response.json()) as {
      status: "success" | "error";
      data?: { onboardingUrl: string };
      message?: string;
    };

    if (!response.ok || data.status !== "success" || !data.data) {
      await ctx.reply(data.message || "Invite is invalid, expired, or already used.");
      return;
    }

    await ctx.reply(
      `Invite accepted. Complete onboarding here:\n${data.data.onboardingUrl}`,
    );
  } catch {
    await ctx.reply("Could not process invite right now. Please try again.");
  }
});

bot.start({
  onStart: (info) => {
    console.log(`Bot started as @${info.username}`);
  },
});
