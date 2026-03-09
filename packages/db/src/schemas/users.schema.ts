import * as PG from "drizzle-orm/pg-core";

import { timestampstz, UserStatusEnum, UserSystemRole } from "../core";

export const usersTable = PG.pgTable("users", {
  id: PG.uuid().primaryKey().notNull().defaultRandom(),

  email: PG.text().notNull().unique(),
  hashedPassword: PG.text(),

  name: PG.text().notNull(),
  systemRole: UserSystemRole().notNull().default("USER"),
  status: UserStatusEnum().notNull().default("ACTIVE"),

  ...timestampstz(),
});
