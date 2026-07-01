"use server";

import { put, del } from "@vercel/blob";
import sharp from "sharp";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/admin/permissions";
import { logActivity } from "@/lib/admin/activity-log";
import { db, isDatabaseConfigured } from "@/db";
import { media } from "@/db/schema";
import { env } from "@/env";

export type MediaFormState = { error: string | null; success?: boolean };

const MAX_DIMENSION = 2000;
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 Mo avant compression

export async function uploadMedia(
  _prevState: MediaFormState,
  formData: FormData
): Promise<MediaFormState> {
  const session = await requirePermission("media");
  if (!isDatabaseConfigured) return { error: "Neon non configuré." };
  if (!env.BLOB_READ_WRITE_TOKEN) {
    return { error: "Vercel Blob non configuré (BLOB_READ_WRITE_TOKEN manquant)." };
  }

  const file = formData.get("file") as File | null;
  const folder = String(formData.get("folder") ?? "").trim().replace(/^\/+|\/+$/g, "");
  const alt = String(formData.get("alt") ?? "").trim();
  const customName = String(formData.get("name") ?? "").trim();

  if (!file || file.size === 0) return { error: "Aucun fichier sélectionné." };
  if (file.size > MAX_UPLOAD_BYTES) return { error: "Fichier trop volumineux (15 Mo max)." };
  if (!file.type.startsWith("image/")) return { error: "Seules les images sont acceptées." };

  const inputBuffer = Buffer.from(await file.arrayBuffer());

  // Compression automatique + conversion WebP + redimensionnement max 2000px.
  const image = sharp(inputBuffer).rotate();
  const metadata = await image.metadata();
  const needsResize = (metadata.width ?? 0) > MAX_DIMENSION || (metadata.height ?? 0) > MAX_DIMENSION;
  const processed = await (needsResize
    ? image.resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
    : image
  )
    .webp({ quality: 82 })
    .toBuffer({ resolveWithObject: true });

  const baseName = (customName || file.name.replace(/\.[^.]+$/, ""))
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const pathname = `${folder ? `${folder}/` : ""}${baseName || "image"}-${Date.now()}.webp`;

  const blob = await put(pathname, processed.data, {
    access: "public",
    contentType: "image/webp",
  });

  await db.insert(media).values({
    url: blob.url,
    pathname: blob.pathname,
    name: customName || file.name,
    folder,
    alt,
    width: processed.info.width,
    height: processed.info.height,
    sizeBytes: processed.info.size,
    uploadedBy: session.user?.id,
  });

  await logActivity(session, "media.upload", pathname);
  revalidatePath("/admin/medias");
  return { error: null, success: true };
}

export async function updateMediaDetails(formData: FormData) {
  const session = await requirePermission("media");
  if (!isDatabaseConfigured) return;

  const id = String(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  const alt = String(formData.get("alt") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim();
  const folder = String(formData.get("folder") ?? "").trim().replace(/^\/+|\/+$/g, "");

  await db.update(media).set({ name, alt, caption, folder }).where(eq(media.id, id));
  await logActivity(session, "media.update", id);
  revalidatePath("/admin/medias");
}

export async function deleteMedia(id: string, pathname: string) {
  const session = await requirePermission("media");
  if (!isDatabaseConfigured) return;

  if (env.BLOB_READ_WRITE_TOKEN) {
    await del(pathname).catch(() => {});
  }
  await db.delete(media).where(eq(media.id, id));
  await logActivity(session, "media.delete", pathname);
  revalidatePath("/admin/medias");
}
