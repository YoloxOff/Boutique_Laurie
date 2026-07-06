import { db, isDatabaseConfigured } from "@/db";
import { mockGallery, type MockGalleryItem } from "@/lib/mock/content";

export async function getGallery(): Promise<MockGalleryItem[]> {
  if (!isDatabaseConfigured) return mockGallery;

  const rows = await db.query.galleryItems.findMany({
    orderBy: (g, { asc }) => [asc(g.position)],
  });
  if (!rows.length) return mockGallery;

  return rows.map((row) => ({
    id: row.id,
    type: row.type,
    category: row.category,
    image: row.imageUrl,
    imageAfter: row.imageAfterUrl ?? undefined,
    title: row.title,
  }));
}
