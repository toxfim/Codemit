import * as PG from "drizzle-orm/pg-core";
import { usersTable } from "./users.schema";
import { Enums } from "../core";
import { relations } from "drizzle-orm";
import { businessTable } from "./business.schema";

export const membersTable = PG.pgTable("members", {
  id: PG.uuid("id").primaryKey().defaultRandom(),

  businessId: PG.uuid()
    .notNull()
    .references(() => businessTable.id),

  userId: PG.uuid()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),

  businessRole: Enums.MembershipRole().notNull().default("EMPLOYEE"),
});

export const membersRelations = relations(membersTable, ({ one }) => ({}));
