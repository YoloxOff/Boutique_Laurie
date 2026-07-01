"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/admin/permissions";
import { db, isDatabaseConfigured } from "@/db";
import { orders, orderStatusEnum } from "@/db/schema";

export async function updateOrderStatus(
  orderId: string,
  status: (typeof orderStatusEnum.enumValues)[number]
) {
  await requirePermission("orders");
  if (!isDatabaseConfigured) return;

  await db.update(orders).set({ status }).where(eq(orders.id, orderId));
  revalidatePath("/admin/commandes");
}
