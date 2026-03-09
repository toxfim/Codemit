import { relations } from "drizzle-orm";
import { timestamp } from "drizzle-orm/pg-core";
import { pgTable, uuid, integer } from "drizzle-orm/pg-core";

import { Enums, timestampstz } from "../core";
import { businessMembersTable } from "./members";

export const paymentsTable = pgTable("payments", {
  id: uuid().defaultRandom().primaryKey(),

  userId: integer()
    .references(() => businessMembersTable.id)
    .notNull(),

  status: Enums.PaymentStatus().notNull().default("IN_PROGRESS"),
  type: Enums.PaymentType().notNull().default("INCOME"),
  resource: Enums.PaymentResource().notNull().default("EXTRA_BOT"),
  completedAt: timestamp({ withTimezone: true }),
  rejectedAt: timestamp({ withTimezone: true }),
  ...timestampstz(),
});

export const paymentsRelations = relations(paymentsTable, ({ one }) => ({
  user: one(businessMembersTable, {
    fields: [paymentsTable.userId],
    references: [businessMembersTable.id],
  }),
}));

export type TypePayment = typeof paymentsTable.$inferSelect;
