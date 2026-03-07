import { uuid, varchar, timestamp, pgTable } from "drizzle-orm/pg-core";

import { Enums, timestampstz } from "../core";
import { businessesTable } from "./businesses";
import { usersTable } from "./users";

export const invitesTable = pgTable("invites", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessId: uuid("business_id")
    .references(() => businessesTable.id)
    .notNull(),
  invitedByUserId: uuid("invited_by_user_id")
    .references(() => usersTable.id)
    .notNull(),
  role: Enums.UserRoleEnum("role").notNull().default("EMPLOYEE"),
  tokenHash: varchar("token_hash", { length: 128 }).notNull().unique(),
  status: Enums.InviteStatusEnum("status").notNull().default("PENDING"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  telegramUserId: varchar("telegram_user_id", { length: 64 }),
  telegramUsername: varchar("telegram_username", { length: 255 }),
  startedAt: timestamp("started_at", { withTimezone: true }),
  onboardingTokenHash: varchar("onboarding_token_hash", { length: 128 }),
  onboardingExpiresAt: timestamp("onboarding_expires_at", { withTimezone: true }),
  onboardingConsumedAt: timestamp("onboarding_consumed_at", { withTimezone: true }),
  usedAt: timestamp("used_at", { withTimezone: true }),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
  ...timestampstz(),
});

export type InviteInsert = typeof invitesTable.$inferInsert;
export type InviteSelect = typeof invitesTable.$inferSelect;
