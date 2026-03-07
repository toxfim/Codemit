import { unique, uuid, varchar, pgTable } from "drizzle-orm/pg-core";

import { Enums, timestampstz } from "../core";
import { usersTable } from "./users";

export const authAccountsTable = pgTable(
  "auth_accounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => usersTable.id)
      .notNull(),
    provider: Enums.AuthProviderEnum("provider").notNull(),
    providerUserId: varchar("provider_user_id", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }),
    ...timestampstz(),
  },
  (table) => [unique("auth_accounts_provider_provider_user_unique").on(table.provider, table.providerUserId)],
);

export type AuthAccountInsert = typeof authAccountsTable.$inferInsert;
