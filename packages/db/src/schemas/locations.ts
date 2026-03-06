import { relations } from "drizzle-orm";
import * as PG from "drizzle-orm/pg-core";

import { profileTable } from "./profile";

export const locationsTable = PG.pgTable("locations", {
  id: PG.serial().primaryKey(),

  businessId: PG.uuid()
    .references(() => profileTable.id)
    .notNull(),

  lat: PG.doublePrecision().notNull(),
  lng: PG.doublePrecision().notNull(),

  region: PG.varchar({ length: 255 }).notNull(),
  district: PG.varchar({ length: 255 }).notNull(),
  address: PG.text(),
});

export const locationsRelations = relations(locationsTable, ({ one }) => ({
  profile: one(profileTable, {
    fields: [locationsTable.businessId],
    references: [profileTable.id],
    relationName: "profileLocations",
  }),
}));

export type TypeLocation = typeof locationsTable.$inferSelect;
