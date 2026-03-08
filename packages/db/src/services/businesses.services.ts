import { eq } from "drizzle-orm";

import db from "../db";
import { businessesTable, type BusinessInsert } from "../schemas";

class BusinessesService {
  async createOne(payload: BusinessInsert) {
    const [business] = await db.insert(businessesTable).values(payload).returning();
    return business ?? null;
  }

  async findById(id: string) {
    return (
      (await db.query.businessesTable.findFirst({
        where: eq(businessesTable.id, id),
      })) ?? null
    );
  }

  async listAll() {
    return db.select().from(businessesTable);
  }

  async updateOneById(id: string, payload: Partial<BusinessInsert>) {
    const [business] = await db
      .update(businessesTable)
      .set(payload)
      .where(eq(businessesTable.id, id))
      .returning();
    return business ?? null;
  }
}

const businessesService = new BusinessesService();
export default businessesService;
