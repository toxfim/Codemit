import { eq } from "drizzle-orm";

import db from "../db";
import { creatorsTable, type CreatorInput } from "../schemas";

class CreatorService {
  async createOne(payload: CreatorInput) {
    const [newCreator] = await db
      .insert(creatorsTable)
      .values(payload)
      .returning();

    if (!newCreator) {
      throw new Error("Failed to create creator");
    }

    return newCreator!;
  }

  findCreatorById = async (id: number) => {
    const creator = await db.query.creatorsTable.findFirst({
      where: eq(creatorsTable.id, id),
    });
    return creator ?? null;
  };
}

const creatorService = new CreatorService();
export default creatorService;
