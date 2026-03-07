import { and, eq } from "drizzle-orm";

import db from "../db";
import { authAccountsTable, type AuthAccountInsert } from "../schemas";

class AuthAccountsService {
  async findGoogleAccountByProviderId(providerUserId: string) {
    return (
      (await db.query.authAccountsTable.findFirst({
        where: and(
          eq(authAccountsTable.provider, "GOOGLE"),
          eq(authAccountsTable.providerUserId, providerUserId),
        ),
      })) ?? null
    );
  }

  async createOne(payload: AuthAccountInsert) {
    const [account] = await db.insert(authAccountsTable).values(payload).returning();
    return account ?? null;
  }

  async createOneIgnoreConflict(payload: AuthAccountInsert) {
    await db.insert(authAccountsTable).values(payload).onConflictDoNothing();
  }
}

const authAccountsService = new AuthAccountsService();
export default authAccountsService;
