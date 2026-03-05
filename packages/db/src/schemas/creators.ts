// import { relations } from "drizzle-orm";
import { serial, varchar, pgTable } from "drizzle-orm/pg-core";

import { Enums, timestampstz } from "../core";

// import { paymentsTable, profileTable } from ".";

export const creatorsTable = pgTable("creators", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),

  subscriptionPlan: Enums.SubscriptionPlanEnum("subscription_plan")
    .default("FREE")
    .notNull(),

  phone: varchar("phone", { length: 20 }).notNull(),

  role: Enums.UserRoleEnum().notNull().default("EMPLOYEE"),

  telegramId: varchar({ length: 255 }),
  ...timestampstz(),
});

// export const creatorsRelations = relations(creatorsTable, ({ many }) => ({
//   payments: many(paymentsTable),
//   business: many(profileTable),
// }));

// types
export type CreatorInput = typeof creatorsTable.$inferInsert;
export type CreatorUpdate = Partial<CreatorInput>;
