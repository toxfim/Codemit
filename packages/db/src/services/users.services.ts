import { eq } from "drizzle-orm";

import db from "../db";
import { usersTable, type UserInsert } from "../schemas";

class UsersService {
  async findById(id: string) {
    return (
      (await db.query.usersTable.findFirst({
        where: eq(usersTable.id, id),
      })) ?? null
    );
  }

  async findByEmail(email: string) {
    return (
      (await db.query.usersTable.findFirst({
        where: eq(usersTable.email, email),
      })) ?? null
    );
  }

  async findByTelegramId(telegramId: string) {
    return (
      (await db.query.usersTable.findFirst({
        where: eq(usersTable.telegramId, telegramId),
      })) ?? null
    );
  }

  async createOne(payload: UserInsert) {
    const [user] = await db.insert(usersTable).values(payload).returning();
    return user ?? null;
  }

  async updateOneById(id: string, payload: Partial<UserInsert>) {
    const [user] = await db
      .update(usersTable)
      .set(payload)
      .where(eq(usersTable.id, id))
      .returning();
    return user ?? null;
  }
}

const usersService = new UsersService();
export default usersService;
