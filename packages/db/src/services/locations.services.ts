import { eq } from "drizzle-orm";

import db from "../db";
import { locationsTable } from "../schemas";

type LocationInsert = typeof locationsTable.$inferInsert;

class LocationsService {
  async createOne(payload: LocationInsert) {
    const [newLocation] = await db.insert(locationsTable).values(payload).returning();

    if (!newLocation) {
      throw new Error("Failed to create location");
    }

    return newLocation;
  }

  async findOneById(id: number) {
    const location = await db.query.locationsTable.findFirst({
      where: eq(locationsTable.id, id),
    });

    return location ?? null;
  }

  async updateOneById(id: number, payload: Partial<LocationInsert>) {
    const [updatedLocation] = await db
      .update(locationsTable)
      .set(payload)
      .where(eq(locationsTable.id, id))
      .returning();

    return updatedLocation ?? null;
  }
}

const locationsService = new LocationsService();
export default locationsService;
