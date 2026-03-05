import { relations } from "drizzle-orm";
import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { Enums, timestampstz } from "../core";

import { clientsTable } from ".";

export const chatsTable = pgTable("chats", {
  id: uuid().defaultRandom().primaryKey(),

  clientId: integer()
    .notNull()
    .references(() => clientsTable.id),
  text: text().notNull(),

  role: Enums.ChatRole().notNull().default("CLIENT"),
  ...timestampstz(),
});

export const chatsRelations = relations(chatsTable, ({ one }) => ({
  client: one(clientsTable, {
    fields: [chatsTable.clientId],
    references: [clientsTable.id],
  }),
}));

export type TypeChat = typeof chatsTable.$inferSelect;

