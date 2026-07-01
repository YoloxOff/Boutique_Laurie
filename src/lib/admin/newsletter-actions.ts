"use server";

import { inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/admin/permissions";
import { logActivity } from "@/lib/admin/activity-log";
import { db, isDatabaseConfigured } from "@/db";
import { newsletterSubscribers } from "@/db/schema";

export async function bulkUpdateNewsletterStatus(active: boolean, formData: FormData) {
  const session = await requirePermission("newsletter");
  if (!isDatabaseConfigured) return;

  const ids = formData.getAll("ids").map(String);
  if (ids.length === 0) return;

  await db
    .update(newsletterSubscribers)
    .set({ active })
    .where(inArray(newsletterSubscribers.id, ids));
  await logActivity(session, active ? "newsletter.reactivate" : "newsletter.deactivate", `${ids.length} abonné(s)`);
  revalidatePath("/admin/newsletter");
}

export async function bulkDeleteNewsletterSubscribers(formData: FormData) {
  const session = await requirePermission("newsletter");
  if (!isDatabaseConfigured) return;

  const ids = formData.getAll("ids").map(String);
  if (ids.length === 0) return;

  await db.delete(newsletterSubscribers).where(inArray(newsletterSubscribers.id, ids));
  await logActivity(session, "newsletter.delete", `${ids.length} abonné(s)`);
  revalidatePath("/admin/newsletter");
}
