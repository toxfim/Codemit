import { eq } from "drizzle-orm";

import db from "../db";
import { paymentsTable } from "../schemas";

type PaymentInsert = typeof paymentsTable.$inferInsert;

class PaymentsService {
  async createOne(payload: PaymentInsert) {
    const [newPayment] = await db.insert(paymentsTable).values(payload).returning();

    if (!newPayment) {
      throw new Error("Failed to create payment");
    }

    return newPayment;
  }

  async findOneById(id: string) {
    const payment = await db.query.paymentsTable.findFirst({
      where: eq(paymentsTable.id, id),
    });

    return payment ?? null;
  }

  async updateOneById(id: string, payload: Partial<PaymentInsert>) {
    const [updatedPayment] = await db
      .update(paymentsTable)
      .set(payload)
      .where(eq(paymentsTable.id, id))
      .returning();

    return updatedPayment ?? null;
  }
}

const paymentsService = new PaymentsService();
export default paymentsService;
