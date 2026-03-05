import { count, desc, eq } from "drizzle-orm";

import db from "../db";
import { clientsTable } from "../schemas";

type ClientInsert = typeof clientsTable.$inferInsert;

type PaginationInput = {
  page?: number;
  limit?: number;
};

class ClientsService {
  async createOne(payload: ClientInsert) {
    const [newClient] = await db.insert(clientsTable).values(payload).returning();

    if (!newClient) {
      throw new Error("Failed to create client");
    }

    return newClient;
  }

  async findOneById(id: number) {
    const client = await db.query.clientsTable.findFirst({
      where: eq(clientsTable.id, id),
    });

    return client ?? null;
  }

  async updateOneById(id: number, payload: Partial<ClientInsert>) {
    const [updatedClient] = await db
      .update(clientsTable)
      .set(payload)
      .where(eq(clientsTable.id, id))
      .returning();

    return updatedClient ?? null;
  }

  async findManyPaginated({ page = 1, limit = 10 }: PaginationInput = {}) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);
    const offset = (safePage - 1) * safeLimit;

    const [totalResult] = await db.select({ total: count() }).from(clientsTable);

    const data = await db
      .select()
      .from(clientsTable)
      .orderBy(desc(clientsTable.id))
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

const clientsService = new ClientsService();
export default clientsService;
