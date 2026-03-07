import { and, eq, gt } from "drizzle-orm";

import db from "../db";
import { userSessionsTable, type UserSessionInsert } from "../schemas";

class UserSessionsService {
  async createOne(payload: UserSessionInsert) {
    const [session] = await db.insert(userSessionsTable).values(payload).returning();
    return session ?? null;
  }

  async findValidByTokenHash(tokenHash: string, now = new Date()) {
    return (
      (await db.query.userSessionsTable.findFirst({
        where: and(
          eq(userSessionsTable.tokenHash, tokenHash),
          gt(userSessionsTable.expiresAt, now),
        ),
      })) ?? null
    );
  }
}

const userSessionsService = new UserSessionsService();
export default userSessionsService;
