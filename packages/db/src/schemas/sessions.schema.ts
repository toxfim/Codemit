import * as PG from "drizzle-orm/pg-core";

import { timestampstz } from "../core";

import { usersTable } from "./users.schema";

export const sessionsTable = PG.pgTable("sessions", {
  id: PG.uuid().primaryKey().defaultRandom(),
  userId: PG.integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),

  token: PG.text().notNull().unique(),

  expiresAt: PG.timestamp({ withTimezone: true }).notNull(),

  ...timestampstz(),
});
