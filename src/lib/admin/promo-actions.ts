"use server";

import { inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/admin/permissions";
import { logActivity } from "@/lib/admin/activity-log";
import { db, isDatabaseConfigured } from "@/db";
import { promoCodes } from "@/db/schema";

export type PromoFormState = { error: string | null };

export async function bulkSetPromoActive(active: boolean, formData: FormData) {
  const session = await requirePermission("promotions");
  if (!isDatabaseConfigured) return;
  const ids = formData.getAll("ids").map(String);
  if (ids.length === 0) return;

  await db.update(promoCodes).set({ active: active ? 1 : 0 }).where(inArray(promoCodes.id, ids));
  await logActivity(session, active ? "promo.activate" : "promo.deactivate", `${ids.length} code(s)`);
  revalidatePath("/admin/codes-promo");
}

export async function bulkDeletePromoCodes(formData: FormData) {
  const session = await requirePermission("promotions");
  if (!isDatabaseConfigured) return;
  const ids = formData.getAll("ids").map(String);
  if (ids.length === 0) return;

  await db.delete(promoCodes).where(inArray(promoCodes.id, ids));
  await logActivity(session, "promo.delete", `${ids.length} code(s)`);
  revalidatePath("/admin/codes-promo");
}

export async function createPromoCode(
  _prevState: PromoFormState,
  formData: FormData
): Promise<PromoFormState> {
  await requirePermission("promotions");
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
