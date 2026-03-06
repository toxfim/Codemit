import { relations } from "drizzle-orm";
import { integer, uuid, pgTable, varchar, text } from "drizzle-orm/pg-core";

import { Enums, timestampstz } from "../core";

import { creatorsTable } from "./creators";
import { locationsTable } from "./locations";

export const profileTable = pgTable("profile", {
  id: uuid().defaultRandom().primaryKey(),

  creatorId: integer()
    .references(() => creatorsTable.id)
    .notNull(),

  name: varchar({ length: 255 }).notNull(),
  description: text().notNull(),

  status: Enums.BusinessProfileStatus().notNull().default("SUSPENDED"),

  ...timestampstz(),
});

export const profileRelations = relations(profileTable, ({ one, many }) => ({
  creator: one(creatorsTable, {
    fields: [profileTable.creatorId],
    references: [creatorsTable.id],
  }),
  locations: many(locationsTable, { relationName: "profileLocations" }),
}));

export type TypeProfile = typeof profileTable.$inferSelect;
