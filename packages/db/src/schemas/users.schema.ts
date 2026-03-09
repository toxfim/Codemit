import * as PG from "drizzle-orm/pg-core";

import { Enums, timestampstz } from "../core";

export const usersTable = PG.pgTable("users", {
  id: PG.uuid().primaryKey().notNull().defaultRandom(),

  email: PG.text().notNull().unique(),
  hashedPassword: PG.text(),

  name: PG.text().notNull(),
  systemRole: Enums.UserSystemRole().notNull().default("USER"),
  status: Enums.UserStatusEnum().notNull().default("ACTIVE"),

  ...timestampstz(),
});
