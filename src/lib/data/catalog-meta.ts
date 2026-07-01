import { isDatabaseConfigured, db } from "@/db";
import { mockBrands, mockCategories } from "@/lib/mock/catalog";

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

export async function getAllCategories() {
  if (!isDatabaseConfigured) return mockCategories;
  try {
    const rows = await db.query.categories.findMany();
    if (!rows.length) return mockCategories;
    return rows.map((c) => ({ id: c.id, slug: c.slug, name: c.name, description: "" }));
  } catch {
    return mockCategories;
  }
}
