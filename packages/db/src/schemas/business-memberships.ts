import { unique, uuid, pgTable } from "drizzle-orm/pg-core";

import { Enums, timestampstz } from "../core";
import { businessesTable } from "./businesses";
import { usersTable } from "./users";

export const businessMembershipsTable = pgTable(
  "business_memberships",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id")
      .references(() => businessesTable.id)
      .notNull(),
    userId: uuid("user_id")
      .references(() => usersTable.id)
      .notNull(),
    role: Enums.UserRoleEnum("role").notNull().default("EMPLOYEE"),
    ...timestampstz(),
  },
  (table) => [unique("business_memberships_business_user_unique").on(table.businessId, table.userId)],
);

export type MembershipInsert = typeof businessMembershipsTable.$inferInsert;
export type MembershipSelect = typeof businessMembershipsTable.$inferSelect;
