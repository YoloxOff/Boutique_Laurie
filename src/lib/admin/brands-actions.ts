"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/admin/permissions";
import { logActivity } from "@/lib/admin/activity-log";
import { db, isDatabaseConfigured } from "@/db";
import { brands } from "@/db/schema";

export type BrandFormState = { error: string | null };

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createBrand(
  _prevState: BrandFormState,
  formData: FormData
): Promise<BrandFormState> {
  const session = await requirePermission("products");
  if (!isDatabaseConfigured) return { error: "Neon non configuré." };

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Le nom de la marque est obligatoire." };

  const slug = slugify(name);
  const existing = await db.query.brands.findFirst({ where: eq(brands.slug, slug) });
  if (existing) return { error: "Une marque avec ce nom existe déjà." };

  await db.insert(brands).values({ name, slug });
  await logActivity(session, "brand.create", name);

  revalidatePath("/admin/marques");
  revalidatePath("/admin/produits/nouveau");
  revalidatePath("/boutique");
  return { error: null };
}

export async function deleteBrand(id: string) {
  const session = await requirePermission("products");
  if (!isDatabaseConfigured) return;

  await db.delete(brands).where(eq(brands.id, id));
  await logActivity(session, "brand.delete", id);

  revalidatePath("/admin/marques");
  revalidatePath("/admin/produits/nouveau");
  revalidatePath("/boutique");
}
