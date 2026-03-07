import { uuid, varchar, text, pgTable } from "drizzle-orm/pg-core";

import { timestampstz } from "../core";
import { usersTable } from "./users";

export const businessesTable = pgTable("businesses", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 255 }).notNull().default("General"),
  aiFaq: text("ai_faq").notNull().default(""),
  ownerUserId: uuid("owner_user_id")
    .references(() => usersTable.id)
    .notNull(),
  ...timestampstz(),
});

export type BusinessInsert = typeof businessesTable.$inferInsert;
export type BusinessSelect = typeof businessesTable.$inferSelect;
