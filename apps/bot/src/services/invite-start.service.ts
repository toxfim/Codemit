import configs from "../configs";
import type { InviteStartResponse } from "../types/invite-api";

export const startInviteFlow = async (input: {
  token: string;
  telegramUserId: string;
  telegramUsername?: string;
}) => {
  const response = await fetch(`${configs.API_BASE_URL}/invites/bot/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = (await response.json()) as InviteStartResponse;
  return { ok: response.ok, data };
};
