"use server";

import { inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/admin/permissions";
import { logActivity } from "@/lib/admin/activity-log";
import { db, isDatabaseConfigured } from "@/db";
import { users } from "@/db/schema";

export async function bulkSetCustomerBlocked(blocked: boolean, formData: FormData) {
  const session = await requirePermission("customers");
  if (!isDatabaseConfigured) return;
  const ids = formData.getAll("ids").map(String);
  if (ids.length === 0) return;

  await db
    .update(users)
    .set({ suspendedAt: blocked ? new Date() : null })
    .where(inArray(users.id, ids));
  await logActivity(session, blocked ? "customer.block" : "customer.unblock", `${ids.length} client(s)`);
  revalidatePath("/admin/clients");
}
