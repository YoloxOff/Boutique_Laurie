"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/admin/permissions";
import { logActivity } from "@/lib/admin/activity-log";
import { db, isDatabaseConfigured } from "@/db";
import { siteSettingsRow, legalPagesRow } from "@/db/schema";

export type SettingsFormState = { error: string | null; success?: boolean };

function parseHours(raw: string): { day: string; hours: string }[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [day, ...rest] = line.split(":");
      return { day: (day ?? "").trim(), hours: rest.join(":").trim() };
    });
}

export async function updateSiteSettings(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await requirePermission("settings");
  if (!isDatabaseConfigured) return { error: "Neon non configuré." };

  const hoursRaw = String(formData.get("hours") ?? "");
  const paymentMethods = String(formData.get("paymentMethods") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const shippingMethods = String(formData.get("shippingMethods") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const values = {
    id: "singleton" as const,
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    address: String(formData.get("address") ?? ""),
    instagram: String(formData.get("instagram") ?? ""),
    facebook: String(formData.get("facebook") ?? ""),
    bookingUrl: String(formData.get("bookingUrl") ?? ""),
    vatNumber: String(formData.get("vatNumber") ?? ""),
    paymentMethods,
    shippingMethods,
    announcementBar: String(formData.get("announcementBar") ?? ""),
    hours: parseHours(hoursRaw),
    metaTitle: String(formData.get("metaTitle") ?? ""),
    metaDescription: String(formData.get("metaDescription") ?? ""),
    updatedAt: new Date(),
  };

  await db
    .insert(siteSettingsRow)
    .values(values)
    .onConflictDoUpdate({ target: siteSettingsRow.id, set: values });

  await logActivity(session, "settings.update");
  revalidatePath("/");
  revalidatePath("/admin/parametres");
  return { error: null, success: true };
}

export async function updateLegalPage(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await requirePermission("settings");
  if (!isDatabaseConfigured) return { error: "Neon non configuré." };

  const key = String(formData.get("key") ?? "");
  const title = String(formData.get("title") ?? "");
  const content = String(formData.get("content") ?? "");
  if (!key || !title) return { error: "Titre requis." };

  await db
    .insert(legalPagesRow)
    .values({ key, title, content, updatedAt: new Date() })
    .onConflictDoUpdate({ target: legalPagesRow.key, set: { title, content, updatedAt: new Date() } });

  await logActivity(session, "settings.update_legal_page", key);
  revalidatePath(`/${key}`);
  revalidatePath("/admin/parametres");
  return { error: null, success: true };
}
