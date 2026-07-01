"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/guard";
import { db, isDatabaseConfigured } from "@/db";
import { promoCodes } from "@/db/schema";

export type PromoFormState = { error: string | null };

export async function createPromoCode(
  _prevState: PromoFormState,
  formData: FormData
): Promise<PromoFormState> {
  await requireAdmin();
  if (!isDatabaseConfigured) {
    return { error: "Mode démo : configurez Neon (DATABASE_URL) pour créer des codes promo." };
  }

  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const type = String(formData.get("type") ?? "percentage") as "percentage" | "fixed" | "free_shipping";
  const value = String(formData.get("value") ?? "0");

  if (!code) return { error: "Le code est obligatoire." };

  await db.insert(promoCodes).values({ code, type, value });
  revalidatePath("/admin/codes-promo");
  return { error: null };
}
