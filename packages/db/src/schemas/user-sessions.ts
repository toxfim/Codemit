import { uuid, varchar, timestamp, pgTable } from "drizzle-orm/pg-core";

import { timestampstz } from "../core";
import { usersTable } from "./users";

export const userSessionsTable = pgTable("user_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => usersTable.id)
    .notNull(),
  tokenHash: varchar("token_hash", { length: 128 }).notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  ...timestampstz(),
});

export type UserSessionInsert = typeof userSessionsTable.$inferInsert;
