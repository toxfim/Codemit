import * as PG from "drizzle-orm/pg-core";

import { AuthProviderEnum, timestampstz } from "../core";

import { usersTable } from "./users.schema";

export const accountsTable = PG.pgTable("accounts", {
  id: PG.uuid("id").primaryKey().notNull().defaultRandom(),

  userId: PG.integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),

  provider: AuthProviderEnum().notNull().default("GOOGLE"),

  ...timestampstz(),
});
