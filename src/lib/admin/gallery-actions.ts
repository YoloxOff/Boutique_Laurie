"use server";

import { put, del } from "@vercel/blob";
import sharp from "sharp";
import { eq, sql as dsql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/admin/permissions";
import { logActivity } from "@/lib/admin/activity-log";
import { db, isDatabaseConfigured } from "@/db";
import { galleryItems } from "@/db/schema";
import { env } from "@/env";

export type GalleryItemFormState = { error: string | null };

const MAX_DIMENSION = 2000;
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 Mo avant compression

async function compressAndUpload(file: File, prefix: string) {
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

  return put(`realisations/${prefix}-${Date.now()}.webp`, processed, {
    access: "public",
    contentType: "image/webp",
  });
}

export async function addGalleryItem(
  _prevState: GalleryItemFormState,
  formData: FormData
): Promise<GalleryItemFormState> {
  const session = await requirePermission("media");
  if (!isDatabaseConfigured) return { error: "Neon non configuré." };
  if (!env.BLOB_READ_WRITE_TOKEN) {
    return { error: "Vercel Blob non configuré (BLOB_READ_WRITE_TOKEN manquant)." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const type = String(formData.get("type") ?? "photo");
  const videoUrl = String(formData.get("videoUrl") ?? "").trim();
  const file = formData.get("file") as File | null;
  const fileAfter = formData.get("fileAfter") as File | null;

  if (!category) return { error: "La catégorie est requise." };
  if (type !== "photo" && type !== "avant-apres" && type !== "video") {
    return { error: "Type invalide." };
  }
  if (!file || file.size === 0) return { error: "Une image est requise." };
  if (file.size > MAX_UPLOAD_BYTES) return { error: "Fichier trop volumineux (15 Mo max)." };
  if (!file.type.startsWith("image/")) return { error: "Seules les images sont acceptées." };

  try {
    const blob = await compressAndUpload(file, "photo");

    let imageAfterUrl: string | null = null;
    if (type === "avant-apres" && fileAfter && fileAfter.size > 0) {
      if (!fileAfter.type.startsWith("image/")) return { error: "Seules les images sont acceptées." };
      const blobAfter = await compressAndUpload(fileAfter, "apres");
      imageAfterUrl = blobAfter.url;
    }

    const [row] = await db
      .select({ maxPosition: dsql<number>`coalesce(max(${galleryItems.position}), -1)` })
      .from(galleryItems);

    await db.insert(galleryItems).values({
      title,
      category,
      type,
      imageUrl: blob.url,
      imageAfterUrl,
      videoUrl: videoUrl || null,
      position: (row?.maxPosition ?? -1) + 1,
    });

    await logActivity(session, "gallery.add", category);
  } catch (e) {
    console.error("addGalleryItem failed:", e);
    return { error: "Une erreur est survenue lors de l'ajout de l'image." };
  }

  revalidatePath("/admin/realisations");
  revalidatePath("/");
  return { error: null };
}

export async function updateGalleryItem(formData: FormData) {
  const session = await requirePermission("media");
  if (!isDatabaseConfigured) return;

  const id = String(formData.get("id"));
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const type = String(formData.get("type") ?? "photo");
  const videoUrl = String(formData.get("videoUrl") ?? "").trim();
  if (!category) return;
  if (type !== "photo" && type !== "avant-apres" && type !== "video") return;

  await db
    .update(galleryItems)
    .set({ title, category, type, videoUrl: videoUrl || null })
    .where(eq(galleryItems.id, id));
  await logActivity(session, "gallery.update", id);
  revalidatePath("/admin/realisations");
  revalidatePath("/");
}

export async function replaceGalleryItemImage(
  id: string,
  oldImageUrl: string,
  _prevState: GalleryItemFormState,
  formData: FormData
): Promise<GalleryItemFormState> {
  const session = await requirePermission("media");
  if (!isDatabaseConfigured) return { error: "Neon non configuré." };
  if (!env.BLOB_READ_WRITE_TOKEN) {
    return { error: "Vercel Blob non configuré (BLOB_READ_WRITE_TOKEN manquant)." };
  }

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { error: "Recadrage manquant." };

  try {
    const blob = await compressAndUpload(file, "recadre");
    await db.update(galleryItems).set({ imageUrl: blob.url }).where(eq(galleryItems.id, id));

    if (oldImageUrl.includes("blob.vercel-storage.com")) {
      await del(oldImageUrl).catch(() => {});
    }

    await logActivity(session, "gallery.recrop", id);
  } catch (e) {
    console.error("replaceGalleryItemImage failed:", e);
    return { error: "Une erreur est survenue lors du recadrage." };
  }

  revalidatePath("/admin/realisations");
  revalidatePath("/");
  return { error: null };
}

export async function deleteGalleryItem(id: string, imageUrl: string, imageAfterUrl: string | null) {
  const session = await requirePermission("media");
  if (!isDatabaseConfigured) return;

  if (env.BLOB_READ_WRITE_TOKEN) {
    if (imageUrl.includes("blob.vercel-storage.com")) await del(imageUrl).catch(() => {});
    if (imageAfterUrl?.includes("blob.vercel-storage.com")) await del(imageAfterUrl).catch(() => {});
  }
  await db.delete(galleryItems).where(eq(galleryItems.id, id));
  await logActivity(session, "gallery.delete", id);
  revalidatePath("/admin/realisations");
  revalidatePath("/");
}
