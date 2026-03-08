import { relations } from "drizzle-orm";
import * as PG from "drizzle-orm/pg-core";
import { membersTable } from "./members";

export const locationsTable = PG.pgTable("locations", {
  id: PG.serial().primaryKey(),

  businessId: PG.uuid()
    .references(() => membersTable.id)
    .notNull(),

  lat: PG.doublePrecision().notNull(),
  lng: PG.doublePrecision().notNull(),

  region: PG.varchar({ length: 255 }).notNull(),
  district: PG.varchar({ length: 255 }).notNull(),
  address: PG.text(),
});

export const locationsRelations = relations(locationsTable, ({ one }) => ({
  profile: one(membersTable, {
    fields: [locationsTable.businessId],
    references: [membersTable.id],
    relationName: "profileLocations",
  }),
}));

export type TypeLocation = typeof locationsTable.$inferSelect;
