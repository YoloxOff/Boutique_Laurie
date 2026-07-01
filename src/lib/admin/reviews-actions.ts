"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/guard";
import { db, isDatabaseConfigured } from "@/db";
import { productReviews } from "@/db/schema";

export async function moderateReview(reviewId: string, status: "approved" | "rejected") {
  await requireAdmin();
  if (!isDatabaseConfigured) return;

  await db.update(productReviews).set({ status }).where(eq(productReviews.id, reviewId));
  revalidatePath("/admin/avis");
}
