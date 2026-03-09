// Mijozlarga ko'rsatilgan xizmatlar uchun schema

import * as PG from "drizzle-orm/pg-core";

import { businessTable } from "./business.schema";
import { timestampstz } from "../core";

export const servicesTable = PG.pgTable("services", {
  id: PG.uuid().notNull().primaryKey().defaultRandom(),
  businessId: PG.uuid()
    .notNull()
    .references(() => businessTable.id, { onDelete: "cascade" }),
  name: PG.text().notNull(),
  description: PG.text(),
  price: PG.integer().notNull(),

  ...timestampstz(),
});
