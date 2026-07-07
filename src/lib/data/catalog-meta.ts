import { isDatabaseConfigured, db } from "@/db";
import { mockBrands } from "@/lib/mock/catalog";

export async function getAllBrands() {
  if (!isDatabaseConfigured) return mockBrands;
  try {
    const rows = await db.query.brands.findMany();
    if (!rows.length) return mockBrands;
    return rows.map((b) => ({
      id: b.id,
      slug: b.slug,
      name: b.name,
      logoUrl: b.logoUrl ?? "",
      tagline: "",
    }));
  } catch {
    return mockBrands;
  }
}
