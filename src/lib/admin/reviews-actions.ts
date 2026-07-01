"use server";

import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/admin/permissions";
import { logActivity } from "@/lib/admin/activity-log";
import { db, isDatabaseConfigured } from "@/db";
import { productReviews } from "@/db/schema";

export async function moderateReview(reviewId: string, status: "approved" | "rejected") {
  const session = await requirePermission("reviews");
  if (!isDatabaseConfigured) return;

  await db.update(productReviews).set({ status }).where(eq(productReviews.id, reviewId));
  await logActivity(session, `review.${status}`, reviewId);
  revalidatePath("/admin/avis");
}

export async function bulkModerateReviews(status: "approved" | "rejected", formData: FormData) {
  const session = await requirePermission("reviews");
  if (!isDatabaseConfigured) return;
  const ids = formData.getAll("ids").map(String);
  if (ids.length === 0) return;

  await db.update(productReviews).set({ status }).where(inArray(productReviews.id, ids));
  await logActivity(session, `review.bulk_${status}`, `${ids.length} avis`);
  revalidatePath("/admin/avis");
}

export async function bulkDeleteReviews(formData: FormData) {
  const session = await requirePermission("reviews");
  if (!isDatabaseConfigured) return;
  const ids = formData.getAll("ids").map(String);
  if (ids.length === 0) return;

  await db.delete(productReviews).where(inArray(productReviews.id, ids));
  await logActivity(session, "review.bulk_delete", `${ids.length} avis`);
  revalidatePath("/admin/avis");
}
