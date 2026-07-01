"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/admin/permissions";
import { db, isDatabaseConfigured } from "@/db";
import { products, productVariants } from "@/db/schema";

export type ProductFormState = { error: string | null };

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requirePermission("products");

  if (!isDatabaseConfigured) {
    return { error: "Mode démo : la gestion des produits nécessite Neon (DATABASE_URL)." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const sku = String(formData.get("sku") ?? "").trim();
  const basePrice = String(formData.get("basePrice") ?? "0");
  const description = String(formData.get("description") ?? "");

  if (!name || !sku) {
    return { error: "Le nom et la référence (SKU) sont obligatoires." };
  }

  const [product] = await db
    .insert(products)
    .values({ name, sku, slug: slugify(name), basePrice, description })
    .returning();

  await db.insert(productVariants).values({
    productId: product.id,
    label: "Standard",
    sku: `${sku}-STD`,
    stockQuantity: Number(formData.get("stockQuantity") ?? 0),
  });

  revalidatePath("/admin/produits");
  redirect(`/admin/produits/${product.id}`);
}

export async function updateStock(variantId: string, stockQuantity: number) {
  await requirePermission("products");
  if (!isDatabaseConfigured) return;

  await db.update(productVariants).set({ stockQuantity }).where(eq(productVariants.id, variantId));
  revalidatePath("/admin/produits");
}

export async function deleteProduct(productId: string) {
  await requirePermission("products");
  if (!isDatabaseConfigured) return;

  await db.delete(products).where(eq(products.id, productId));
  revalidatePath("/admin/produits");
  redirect("/admin/produits");
}
