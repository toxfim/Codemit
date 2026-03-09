import * as PG from "drizzle-orm/pg-core";

import { Enums, timestampstz } from "../core";

import { usersTable } from "./users.schema";

export const businessTable = PG.pgTable("business", {
  id: PG.uuid("id").primaryKey().notNull().defaultRandom(),

  ownerId: PG.uuid()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),

  name: PG.text().notNull(),
  description: PG.text(),
  status: Enums.BusinessProfileStatus().notNull().default("ACTIVE"),
  aiFaq: PG.text(),
  ...timestampstz(),
});
