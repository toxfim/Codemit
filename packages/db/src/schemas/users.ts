import { uuid, varchar, text, pgTable } from "drizzle-orm/pg-core";

import { Enums, timestampstz } from "../core";

export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).unique(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  passwordHash: varchar("password_hash", { length: 255 }),
  telegramId: varchar("telegram_id", { length: 64 }).unique(),
  avatarUrl: text("avatar_url"),
  type: Enums.UserTypeEnum("type").default("OWNER").notNull(),
  status: Enums.UserStatusEnum("status").default("ACTIVE").notNull(),
  ...timestampstz(),
});

export type UserInsert = typeof usersTable.$inferInsert;
export type UserSelect = typeof usersTable.$inferSelect;
