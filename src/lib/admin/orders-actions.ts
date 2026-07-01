"use server";

import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/admin/permissions";
import { logActivity } from "@/lib/admin/activity-log";
import { db, isDatabaseConfigured } from "@/db";
import { orders, orderStatusEnum } from "@/db/schema";

export async function updateOrderStatus(
  orderId: string,
  status: (typeof orderStatusEnum.enumValues)[number]
) {
  const session = await requirePermission("orders");
  if (!isDatabaseConfigured) return;

  await db.update(orders).set({ status }).where(eq(orders.id, orderId));
  await logActivity(session, "order.update_status", `${orderId} -> ${status}`);
  revalidatePath("/admin/commandes");
}

export async function bulkUpdateOrderStatus(
  status: (typeof orderStatusEnum.enumValues)[number],
  formData: FormData
) {
  const session = await requirePermission("orders");
  if (!isDatabaseConfigured) return;
  const ids = formData.getAll("ids").map(String);
  if (ids.length === 0) return;

  await db.update(orders).set({ status }).where(inArray(orders.id, ids));
  await logActivity(session, "order.bulk_update_status", `${ids.length} commande(s) -> ${status}`);
  revalidatePath("/admin/commandes");
}
