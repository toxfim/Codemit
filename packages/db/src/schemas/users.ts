import { relations } from "drizzle-orm";
import * as PG from "drizzle-orm/pg-core";

import { Enums, timestampstz } from "../core";

import { membersTable } from "./members";
import { sessionTable } from "./sessions";
import { businessesTable } from "./businesses";

export const usersTable = PG.pgTable("users", {
  id: PG.serial().primaryKey().notNull(),
  email: PG.varchar({ length: 255 }).notNull().unique(),
  passwordHash: PG.varchar({ length: 255 }).notNull(),
  name: PG.varchar({ length: 255 }).notNull(),
  avatar: PG.varchar({ length: 255 }),
  systemRole: Enums.UserSystemRole().notNull().default("USER"),
  ...timestampstz(),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  ownedBusinesses: many(businessesTable),
  businessMembers: many(membersTable),
  sessions: many(sessionTable),
}));

export type TypeUser = typeof usersTable.$inferSelect;
export type TypeInsertUser = typeof usersTable.$inferInsert;
