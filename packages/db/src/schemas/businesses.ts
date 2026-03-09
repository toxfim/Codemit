import * as PG from "drizzle-orm/pg-core";

import { Enums, timestampstz } from "../core";
import { relations } from "drizzle-orm";
import { membersTable } from "./members";

export const businessTable = PG.pgTable("businesses", {
  id: PG.uuid().defaultRandom().primaryKey(),

  ownerUserId: PG.uuid()
    .notNull()
    .references(() => membersTable.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),

  name: PG.text().notNull(),
  description: PG.text(),

  status: Enums.BusinessProfileStatus().notNull().default("ACTIVE"),

  ...timestampstz(),
});

export const businessesRelations = relations(
  businessTable,
  ({ one, many }) => ({
    owner: one(membersTable, {
      fields: [businessTable.ownerUserId],
      references: [membersTable.id],
    }),
    members: many(membersTable),
  }),
);

export type BusinessInsert = typeof businessTable.$inferInsert;
export type BusinessSelect = typeof businessTable.$inferSelect;
