import { count, desc, eq } from "drizzle-orm";

import db from "../db";
import { profileTable } from "../schemas";

type ProfileInsert = typeof profileTable.$inferInsert;

class ProfileService {
  async createOne(payload: ProfileInsert) {
    const [newProfile] = await db
      .insert(profileTable)
      .values(payload)
      .returning();

    if (!newProfile) {
      throw new Error("Failed to create profile");
    }

    return newProfile;
  }

  async findOneById(id: string) {
    const profile = await db.query.profileTable.findFirst({
      where: eq(profileTable.id, id),
    });

    return profile ?? null;
  }

  async updateOneById(id: string, payload: Partial<ProfileInsert>) {
    const [updatedProfile] = await db
      .update(profileTable)
      .set(payload)
      .where(eq(profileTable.id, id))
      .returning();

    return updatedProfile ?? null;
  }
  async findManyPaginated({
    page = 1,
    limit = 10,
  }: { page?: number; limit?: number } = {}) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);
    const offset = (safePage - 1) * safeLimit;

    const [totalResult] = await db
      .select({ total: count() })
      .from(profileTable);

    const data = await db
      .select()
      .from(profileTable)
      .orderBy(desc(profileTable.id))
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

const profileService = new ProfileService();
export default profileService;
