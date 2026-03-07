import { and, eq } from "drizzle-orm";

import db from "../db";
import { invitesTable, type InviteInsert } from "../schemas";

class InvitesService {
  async createOne(payload: InviteInsert) {
    const [invite] = await db.insert(invitesTable).values(payload).returning();
    return invite ?? null;
  }

  async findById(id: string) {
    return (
      (await db.query.invitesTable.findFirst({
        where: eq(invitesTable.id, id),
      })) ?? null
    );
  }

  async findByTokenHash(tokenHash: string) {
    return (
      (await db.query.invitesTable.findFirst({
        where: eq(invitesTable.tokenHash, tokenHash),
      })) ?? null
    );
  }

  async findByOnboardingTokenHash(onboardingTokenHash: string) {
    return (
      (await db.query.invitesTable.findFirst({
        where: eq(invitesTable.onboardingTokenHash, onboardingTokenHash),
      })) ?? null
    );
  }

  async listByBusinessId(businessId: string) {
    return db.select().from(invitesTable).where(eq(invitesTable.businessId, businessId));
  }

  async setExpired(id: string) {
    const [invite] = await db
      .update(invitesTable)
      .set({
        status: "EXPIRED",
      })
      .where(eq(invitesTable.id, id))
      .returning();
    return invite ?? null;
  }

  async markStarted(params: {
    id: string;
    telegramUserId: string;
    telegramUsername?: string;
    onboardingTokenHash: string;
    onboardingExpiresAt: Date;
  }) {
    const [invite] = await db
      .update(invitesTable)
      .set({
        telegramUserId: params.telegramUserId,
        telegramUsername: params.telegramUsername,
        startedAt: new Date(),
        onboardingTokenHash: params.onboardingTokenHash,
        onboardingExpiresAt: params.onboardingExpiresAt,
      })
      .where(eq(invitesTable.id, params.id))
      .returning();
    return invite ?? null;
  }

  async markUsed(id: string) {
    const [invite] = await db
      .update(invitesTable)
      .set({
        status: "USED",
        usedAt: new Date(),
        onboardingConsumedAt: new Date(),
      })
      .where(eq(invitesTable.id, id))
      .returning();
    return invite ?? null;
  }

  async cancelByBusinessAndId(businessId: string, inviteId: string) {
    const [invite] = await db
      .update(invitesTable)
      .set({
        status: "CANCELLED",
        cancelledAt: new Date(),
      })
      .where(and(eq(invitesTable.id, inviteId), eq(invitesTable.businessId, businessId)))
      .returning();
    return invite ?? null;
  }
}

const invitesService = new InvitesService();
export default invitesService;
