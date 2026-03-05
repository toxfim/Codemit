import { eq } from "drizzle-orm";

import db from "../db";
import { chatsTable } from "../schemas";

type ChatInsert = typeof chatsTable.$inferInsert;

class ChatsService {
  async createOne(payload: ChatInsert) {
    const [newChat] = await db.insert(chatsTable).values(payload).returning();

    if (!newChat) {
      throw new Error("Failed to create chat");
    }

    return newChat;
  }

  async findOneById(id: string) {
    const chat = await db.query.chatsTable.findFirst({
      where: eq(chatsTable.id, id),
    });

    return chat ?? null;
  }

  async updateOneById(id: string, payload: Partial<ChatInsert>) {
    const [updatedChat] = await db
      .update(chatsTable)
      .set(payload)
      .where(eq(chatsTable.id, id))
      .returning();

    return updatedChat ?? null;
  }
}

const chatsService = new ChatsService();
export default chatsService;
