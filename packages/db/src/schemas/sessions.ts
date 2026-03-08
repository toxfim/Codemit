// packages/db/src/schema/sessions.ts
import { relations } from "drizzle-orm";
import * as PG from "drizzle-orm/pg-core";

import { usersTable } from "./users";
import { timestampstz } from "../core";

export const sessionsTable = PG.pgTable("sessions", {
  id: PG.uuid("id").defaultRandom().primaryKey(),

  userId: PG.uuid("user_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),

  tokenHash: PG.text("token_hash").notNull().unique(),
  expiresAt: PG.timestamp("expires_at", { withTimezone: true }).notNull(),

  ipAddress: PG.text("ip_address"),
  userAgent: PG.text("user_agent"),
  ...timestampstz(),
});

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));

export type TypeSession = typeof sessionsTable.$inferSelect;
export type TypeInsertSession = typeof sessionsTable.$inferInsert;
