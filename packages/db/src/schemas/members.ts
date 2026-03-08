// packages/db/src/schema/business_members.ts
import { relations } from "drizzle-orm";
import * as PG from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { Enums, timestampstz } from "../core";
import { businessTable } from "./businesses";

export const membersTable = PG.pgTable(
  "business_members",
  {
    id: PG.uuid("id").defaultRandom().primaryKey(),

    businessId: PG.uuid("business_id")
      .notNull()
      .references(() => businessTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

    userId: PG.uuid("user_id")
      .notNull()
      .references(() => usersTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

    role: Enums.MembersRole().notNull().default("EMPLOYEE"),
    ...timestampstz(),
  },

  (table) => ({
    businessUserUnique: PG.uniqueIndex(
      "business_members_business_user_unique",
    ).on(table.businessId, table.userId),
  }),
);

export const businessMembersRelations = relations(
  businessMembersTable,
  ({ one }) => ({
    business: one(businessTable, {
      fields: [businessMembersTable.businessId],
      references: [businessTable.id],
    }),
    user: one(usersTable, {
      fields: [businessMembersTable.userId],
      references: [usersTable.id],
    }),
  }),
);

export type TypeBusinessMember = typeof businessMembersTable.$inferSelect;
export type TypeInsertBusinessMember = typeof businessMembersTable.$inferInsert;
