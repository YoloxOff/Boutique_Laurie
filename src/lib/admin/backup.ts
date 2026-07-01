import "server-only";
import crypto from "node:crypto";
import { put, list, del } from "@vercel/blob";
import { db, isDatabaseConfigured } from "@/db";
import {
  users,
  brands,
  categories,
  products,
  productVariants,
  productImages,
  productReviews,
  orders,
  orderItems,
  addresses,
  promoCodes,
  newsletterSubscribers,
  siteSettingsRow,
  legalPagesRow,
} from "@/db/schema";
import { env } from "@/env";

const BACKUP_PREFIX = "backups/";
const ALGO = "aes-256-gcm";

function getKey() {
  const secret = env.AUTH_SECRET ?? "dev-only-insecure-secret-change-me";
  return crypto.createHash("sha256").update(secret).digest();
}

function encrypt(json: string): Buffer {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(json, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]);
}

function decrypt(buffer: Buffer): string {
  const iv = buffer.subarray(0, 12);
  const authTag = buffer.subarray(12, 28);
  const encrypted = buffer.subarray(28);
  const decipher = crypto.createDecipheriv(ALGO, getKey(), iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}

// Tables sauvegardées : cœur métier (catalogue, commandes, clients, contenu éditable).
// Exclues volontairement : sessions/accounts (régénérées par Auth.js), paniers (éphémères),
// journal d'activité et stripe_events (historique technique, pas critique à restaurer).
async function snapshotTables() {
  const [
    usersRows,
    brandsRows,
    categoriesRows,
    productsRows,
    variantsRows,
    imagesRows,
    reviewsRows,
    ordersRows,
    orderItemsRows,
    addressesRows,
    promoCodesRows,
    newsletterRows,
    settingsRows,
    legalRows,
  ] = await Promise.all([
    db.select().from(users),
    db.select().from(brands),
    db.select().from(categories),
    db.select().from(products),
    db.select().from(productVariants),
    db.select().from(productImages),
    db.select().from(productReviews),
    db.select().from(orders),
    db.select().from(orderItems),
    db.select().from(addresses),
    db.select().from(promoCodes),
    db.select().from(newsletterSubscribers),
    db.select().from(siteSettingsRow),
    db.select().from(legalPagesRow),
  ]);

  return {
    version: 1,
    createdAt: new Date().toISOString(),
    tables: {
      users: usersRows,
      brands: brandsRows,
      categories: categoriesRows,
      products: productsRows,
      productVariants: variantsRows,
      productImages: imagesRows,
      productReviews: reviewsRows,
      orders: ordersRows,
      orderItems: orderItemsRows,
      addresses: addressesRows,
      promoCodes: promoCodesRows,
      newsletterSubscribers: newsletterRows,
      siteSettings: settingsRows,
      legalPages: legalRows,
    },
  };
}

export type BackupSummary = { pathname: string; size: number; uploadedAt: Date };

export async function runBackup(): Promise<BackupSummary> {
  if (!isDatabaseConfigured) throw new Error("Neon non configuré.");
  if (!env.BLOB_READ_WRITE_TOKEN) throw new Error("Vercel Blob non configuré.");

  const snapshot = await snapshotTables();
  const json = JSON.stringify(snapshot);
  const encrypted = encrypt(json);

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const pathname = `${BACKUP_PREFIX}${timestamp}.enc`;

  const blob = await put(pathname, encrypted, {
    access: "public",
    contentType: "application/octet-stream",
  });

  return { pathname: blob.pathname, size: encrypted.byteLength, uploadedAt: new Date() };
}

export async function listBackups(): Promise<BackupSummary[]> {
  if (!env.BLOB_READ_WRITE_TOKEN) return [];
  const { blobs } = await list({ prefix: BACKUP_PREFIX });
  return blobs
    .map((b) => ({ pathname: b.pathname, size: b.size, uploadedAt: b.uploadedAt }))
    .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
}

export async function deleteBackup(pathname: string) {
  await del(pathname);
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

// JSON.stringify sérialise les Date en chaînes ISO ; ce reviver les reconstitue en objets
// Date pour que Drizzle (colonnes timestamp) les accepte à la réinsertion.
function reviveDates(_key: string, value: unknown) {
  return typeof value === "string" && ISO_DATE_RE.test(value) ? new Date(value) : value;
}

async function fetchAndDecrypt(pathname: string) {
  const { blobs } = await list({ prefix: pathname });
  const target = blobs.find((b) => b.pathname === pathname);
  if (!target) throw new Error("Sauvegarde introuvable.");

  const res = await fetch(target.url);
  const buffer = Buffer.from(await res.arrayBuffer());
  return JSON.parse(decrypt(buffer), reviveDates) as Awaited<ReturnType<typeof snapshotTables>>;
}

/**
 * Restauration additive (upsert) : réinjecte les lignes de la sauvegarde sans supprimer
 * les données créées depuis, pour rester une opération sûre même sur une base en production.
 */
export async function restoreBackup(pathname: string) {
  const snapshot = await fetchAndDecrypt(pathname);
  const t = snapshot.tables;

  const upsert = async <T extends Record<string, unknown>>(
    table: Parameters<typeof db.insert>[0],
    rows: T[],
    conflictTarget: unknown
  ) => {
    for (const row of rows) {
      await db
        .insert(table)
        .values(row as never)
        // @ts-expect-error -- cible de conflit dynamique par table, cf. appels ci-dessous
        .onConflictDoUpdate({ target: conflictTarget, set: row });
    }
  };

  await upsert(users, t.users, users.id);
  await upsert(brands, t.brands, brands.id);
  await upsert(categories, t.categories, categories.id);
  await upsert(products, t.products, products.id);
  await upsert(productVariants, t.productVariants, productVariants.id);
  await upsert(productImages, t.productImages, productImages.id);
  await upsert(productReviews, t.productReviews, productReviews.id);
  await upsert(addresses, t.addresses, addresses.id);
  await upsert(orders, t.orders, orders.id);
  await upsert(orderItems, t.orderItems, orderItems.id);
  await upsert(promoCodes, t.promoCodes, promoCodes.id);
  await upsert(newsletterSubscribers, t.newsletterSubscribers, newsletterSubscribers.id);
  await upsert(siteSettingsRow, t.siteSettings, siteSettingsRow.id);
  await upsert(legalPagesRow, t.legalPages, legalPagesRow.key);

  return { restoredAt: new Date(), tables: Object.keys(t) };
}
