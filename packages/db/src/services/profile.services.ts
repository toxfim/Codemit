import { eq } from "drizzle-orm";

import db from "../db";
import { profileTable } from "../schemas";

type ProfileInsert = typeof profileTable.$inferInsert;

class ProfileService {
  async createOne(payload: ProfileInsert) {
    const [newProfile] = await db.insert(profileTable).values(payload).returning();

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
}

const profileService = new ProfileService();
export default profileService;
