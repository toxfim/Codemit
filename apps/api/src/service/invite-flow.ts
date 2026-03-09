import { invitesService } from "@codemit/db/services";

export const expireInviteIfNeeded = async (inviteId: string) => {
  const invite = await invitesService.findById(inviteId);

  if (!invite) return null;
  if (invite.status !== "PENDING") return invite;
  if (invite.expiresAt > new Date()) return invite;

  const updated = await invitesService.setExpired(invite.id);
  return updated ?? invite;
};
