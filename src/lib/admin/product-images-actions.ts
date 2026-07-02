"use server";

import { put, del } from "@vercel/blob";
import sharp from "sharp";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/admin/permissions";
import { logActivity } from "@/lib/admin/activity-log";
import { db, isDatabaseConfigured } from "@/db";
import { productImages } from "@/db/schema";
import { env } from "@/env";

export type ProductImageFormState = { error: string | null };

const MAX_DIMENSION = 2000;
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 Mo avant compression

export async function addProductImage(
  productId: string,
  _prevState: ProductImageFormState,
  formData: FormData
): Promise<ProductImageFormState> {
  const session = await requirePermission("products");
  if (!isDatabaseConfigured) return { error: "Mode démo : la gestion des images nécessite Neon (DATABASE_URL)." };
  if (!env.BLOB_READ_WRITE_TOKEN) {
    return { error: "Vercel Blob non configuré (BLOB_READ_WRITE_TOKEN manquant)." };
  }

  const file = formData.get("file") as File | null;
  const alt = String(formData.get("alt") ?? "").trim();

  if (!file || file.size === 0) return { error: "Aucun fichier sélectionné." };
  if (file.size > MAX_UPLOAD_BYTES) return { error: "Fichier trop volumineux (15 Mo max)." };
  if (!file.type.startsWith("image/")) return { error: "Seules les images sont acceptées." };

  const inputBuffer = Buffer.from(await file.arrayBuffer());

  const image = sharp(inputBuffer).rotate();
  const metadata = await image.metadata();
  const needsResize = (metadata.width ?? 0) > MAX_DIMENSION || (metadata.height ?? 0) > MAX_DIMENSION;
  const processed = await (needsResize
    ? image.resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
    : image
  )
    .webp({ quality: 82 })
    .toBuffer();

  const blob = await put(`produits/${productId}-${Date.now()}.webp`, processed, {
    access: "public",
    contentType: "image/webp",
  });

  const [row] = await db
    .select({ maxPosition: sql<number>`coalesce(max(${productImages.position}), -1)` })
    .from(productImages)
    .where(eq(productImages.productId, productId));

  await db.insert(productImages).values({
    productId,
    url: blob.url,
    alt: alt || "Image produit",
    position: (row?.maxPosition ?? -1) + 1,
  });

  await logActivity(session, "product.image_add", productId);
  revalidatePath(`/admin/produits/${productId}`);
  revalidatePath("/admin/produits");
  return { error: null };
}

export async function deleteProductImage(imageId: string, productId: string, url: string) {
  const session = await requirePermission("products");
  if (!isDatabaseConfigured) return;

  if (env.BLOB_READ_WRITE_TOKEN && url.includes("blob.vercel-storage.com")) {
    await del(url).catch(() => {});
  }
  await db.delete(productImages).where(eq(productImages.id, imageId));
  await logActivity(session, "product.image_delete", imageId);
  revalidatePath(`/admin/produits/${productId}`);
  revalidatePath("/admin/produits");
}
