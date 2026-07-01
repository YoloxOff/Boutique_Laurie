"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/admin/permissions";
import { db, isDatabaseConfigured } from "@/db";
import { productReviews } from "@/db/schema";

export async function moderateReview(reviewId: string, status: "approved" | "rejected") {
  await requirePermission("reviews");
  if (!isDatabaseConfigured) return;

  await db.update(productReviews).set({ status }).where(eq(productReviews.id, reviewId));
  revalidatePath("/admin/avis");
}
