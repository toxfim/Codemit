import * as PG from "drizzle-orm/pg-core";

import { timestampstz } from "../core";

import { businessTable } from "./business.schema";

export const clientsTable = PG.pgTable("clients", {
  id: PG.uuid().notNull().primaryKey().defaultRandom(),
  name: PG.text(),
  businessId: PG.uuid()
    .notNull()
    .references(() => businessTable.id, { onDelete: "cascade" }),

  phone: PG.text(),
  telegramId: PG.text(),
  ...timestampstz(),
});
