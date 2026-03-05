import { count, desc, eq } from "drizzle-orm";

import db from "../db";
import { creatorsTable, type CreatorInput } from "../schemas";

type PaginationInput = {
  page?: number;
  limit?: number;
};

class CreatorService {
  async createOne(payload: CreatorInput) {
    const [newCreator] = await db.insert(creatorsTable).values(payload).returning();

    if (!newCreator) {
      throw new Error("Failed to create creator");
    }

    return newCreator;
  }

  async findOneById(id: number) {
    const creator = await db.query.creatorsTable.findFirst({
      where: eq(creatorsTable.id, id),
    });

    return creator ?? null;
  }

  async updateOneById(id: number, payload: Partial<CreatorInput>) {
    const [updatedCreator] = await db
      .update(creatorsTable)
      .set(payload)
      .where(eq(creatorsTable.id, id))
      .returning();

    return updatedCreator ?? null;
  }

  async findManyPaginated({ page = 1, limit = 10 }: PaginationInput = {}) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);
    const offset = (safePage - 1) * safeLimit;

    const [totalResult] = await db
      .select({ total: count() })
      .from(creatorsTable);

    const data = await db
      .select()
      .from(creatorsTable)
      .orderBy(desc(creatorsTable.id))
      .limit(safeLimit)
      .offset(offset);

    const total = Number(totalResult?.total ?? 0);
    const totalPages = Math.max(1, Math.ceil(total / safeLimit));

    return {
      data,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages,
      },
    };
  }
}

const creatorService = new CreatorService();
export default creatorService;

