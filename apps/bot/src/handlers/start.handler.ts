import type { Bot } from "grammy";

import { startInviteFlow } from "../services/invite-start.service";

export const registerStartHandler = (bot: Bot) => {
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
      const { ok, data } = await startInviteFlow({
        token,
        telegramUserId: String(ctx.from.id),
        telegramUsername: ctx.from.username ?? undefined,
      });

      if (!ok || data.status !== "success") {
        const message = data.status === "error"
          ? data.message
          : "Invite is invalid, expired, or already used.";
        await ctx.reply(message);
        return;
      }

      await ctx.reply("Invite accepted. Tap the button below to complete onboarding.", {
        reply_markup: {
          inline_keyboard: [[{ text: "Complete Onboarding", url: data.data.onboardingUrl }]],
        },
      });
    } catch {
      await ctx.reply("Could not process invite right now. Please try again.");
    }
  });
};
