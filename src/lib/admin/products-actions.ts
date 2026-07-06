"use server";

import { eq, inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/admin/permissions";
import { logActivity } from "@/lib/admin/activity-log";
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

function parseObjectives(value: string) {
  return value
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
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
  const shortDescription = String(formData.get("shortDescription") ?? "").trim();
  const description = String(formData.get("description") ?? "");
  const brandId = String(formData.get("brandId") ?? "").trim();
  const objectives = parseObjectives(String(formData.get("objectives") ?? ""));

  if (!name || !sku) {
    return { error: "Le nom et la référence (SKU) sont obligatoires." };
  }

  const [product] = await db
    .insert(products)
    .values({
      name,
      sku,
      slug: slugify(name),
      basePrice,
      shortDescription: shortDescription || null,
      description,
      brandId: brandId || null,
      objectives,
    })
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

export async function updateProductDetails(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const session = await requirePermission("products");
  if (!isDatabaseConfigured) return { error: "Neon non configuré." };

  const id = String(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  const shortDescription = String(formData.get("shortDescription") ?? "").trim();
  const description = String(formData.get("description") ?? "");
  const basePrice = String(formData.get("basePrice") ?? "0");
  const seoTitle = String(formData.get("seoTitle") ?? "").trim();
  const seoDescription = String(formData.get("seoDescription") ?? "").trim();
  const customSlug = String(formData.get("slug") ?? "").trim();
  const brandId = String(formData.get("brandId") ?? "").trim();
  const objectives = parseObjectives(String(formData.get("objectives") ?? ""));

  if (!name) return { error: "Le nom est obligatoire." };

  await db
    .update(products)
    .set({
      name,
      shortDescription: shortDescription || null,
      description,
      basePrice,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      brandId: brandId || null,
      objectives,
      ...(customSlug ? { slug: slugify(customSlug) } : {}),
    })
    .where(eq(products.id, id));

  await logActivity(session, "product.update", id);
  revalidatePath("/admin/produits");
  revalidatePath(`/admin/produits/${id}`);
  return { error: null };
}

export async function updateStock(variantId: string, stockQuantity: number) {
  await requirePermission("products");
  if (!isDatabaseConfigured) return;

  await db.update(productVariants).set({ stockQuantity }).where(eq(productVariants.id, variantId));
  revalidatePath("/admin/produits");
}

export async function addProductVariant(productId: string, formData: FormData) {
  const session = await requirePermission("products");
  if (!isDatabaseConfigured) return;

  const label = String(formData.get("label") ?? "").trim();
  const sku = String(formData.get("sku") ?? "").trim();
  const stockQuantity = Number(formData.get("stockQuantity") ?? 0);
  const priceOverride = String(formData.get("priceOverride") ?? "").trim();

  if (!label || !sku) return;

  await db.insert(productVariants).values({
    productId,
    label,
    sku,
    stockQuantity,
    priceOverride: priceOverride || null,
  });

  await logActivity(session, "product.variant_add", `${productId} -> ${label}`);
  revalidatePath(`/admin/produits/${productId}`);
}

export async function updateProductVariant(variantId: string, productId: string, formData: FormData) {
  const session = await requirePermission("products");
  if (!isDatabaseConfigured) return;

  const label = String(formData.get("label") ?? "").trim();
  const sku = String(formData.get("sku") ?? "").trim();
  const priceOverride = String(formData.get("priceOverride") ?? "").trim();

  if (!label || !sku) return;

  await db
    .update(productVariants)
    .set({ label, sku, priceOverride: priceOverride || null })
    .where(eq(productVariants.id, variantId));

  await logActivity(session, "product.variant_update", variantId);
  revalidatePath(`/admin/produits/${productId}`);
}

export async function deleteProductVariant(variantId: string, productId: string) {
  const session = await requirePermission("products");
  if (!isDatabaseConfigured) return;

  await db.delete(productVariants).where(eq(productVariants.id, variantId));
  await logActivity(session, "product.variant_delete", variantId);
  revalidatePath(`/admin/produits/${productId}`);
}

export async function deleteProduct(productId: string) {
  await requirePermission("products");
  if (!isDatabaseConfigured) return;

  await db.delete(products).where(eq(products.id, productId));
  revalidatePath("/admin/produits");
  redirect("/admin/produits");
}

export async function bulkSetProductStatus(status: "active" | "draft", formData: FormData) {
  const session = await requirePermission("products");
  if (!isDatabaseConfigured) return;
  const ids = formData.getAll("ids").map(String);
  if (ids.length === 0) return;

  await db.update(products).set({ status }).where(inArray(products.id, ids));
  await logActivity(session, `product.bulk_${status}`, `${ids.length} produit(s)`);
  revalidatePath("/admin/produits");
}

export async function bulkDeleteProducts(formData: FormData) {
  const session = await requirePermission("products");
  if (!isDatabaseConfigured) return;
  const ids = formData.getAll("ids").map(String);
  if (ids.length === 0) return;

  await db.delete(products).where(inArray(products.id, ids));
  await logActivity(session, "product.bulk_delete", `${ids.length} produit(s)`);
  revalidatePath("/admin/produits");
}
