import { and, eq } from "drizzle-orm";

import db from "../db";
import {
  businessMembershipsTable,
  businessesTable,
  type MembershipInsert,
} from "../schemas";

class BusinessMembershipsService {
  async createOne(payload: MembershipInsert) {
    const [membership] = await db
      .insert(businessMembershipsTable)
      .values(payload)
      .returning();
    return membership ?? null;
  }

  async findByUserAndBusiness(userId: string, businessId: string) {
    return (
      (await db.query.businessMembershipsTable.findFirst({
        where: and(
          eq(businessMembershipsTable.userId, userId),
          eq(businessMembershipsTable.businessId, businessId),
        ),
      })) ?? null
    );
  }

  async findOwnerMembershipByUser(userId: string) {
    return (
      (await db.query.businessMembershipsTable.findFirst({
        where: and(
          eq(businessMembershipsTable.userId, userId),
          eq(businessMembershipsTable.role, "OWNER"),
        ),
      })) ?? null
    );
  }

  async listWorkspacesByUser(userId: string) {
    return db
      .select({
        membershipId: businessMembershipsTable.id,
        role: businessMembershipsTable.role,
        businessId: businessesTable.id,
        name: businessesTable.name,
        category: businessesTable.category,
        aiFaq: businessesTable.aiFaq,
        ownerUserId: businessesTable.ownerUserId,
      })
      .from(businessMembershipsTable)
      .innerJoin(
        businessesTable,
        and(
          eq(businessMembershipsTable.businessId, businessesTable.id),
          eq(businessMembershipsTable.userId, userId),
        ),
      );
  }

  async upsertMembershipRole(businessId: string, userId: string, role: "OWNER" | "MANAGER" | "EMPLOYEE") {
    await db
      .insert(businessMembershipsTable)
      .values({
        businessId,
        userId,
        role,
      })
      .onConflictDoUpdate({
        target: [
          businessMembershipsTable.businessId,
          businessMembershipsTable.userId,
        ],
        set: {
          role,
          updatedAt: new Date(),
        },
      });
  }
}

const businessMembershipsService = new BusinessMembershipsService();
export default businessMembershipsService;
