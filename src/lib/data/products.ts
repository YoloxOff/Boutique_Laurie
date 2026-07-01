import { eq } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/db";
import { productImages, productReviews, products, productVariants } from "@/db/schema";
import {
  getMockProductBySlug,
  getMockProductsByCategory,
  mockProducts,
  type MockProduct,
} from "@/lib/mock/catalog";

export type ProductSummary = Pick<
  MockProduct,
  | "slug"
  | "name"
  | "brandSlug"
  | "categorySlug"
  | "shortDescription"
  | "basePrice"
  | "compareAtPrice"
  | "hairTypes"
  | "objectives"
> & { image: { url: string; alt: string } };

function toSummary(p: MockProduct): ProductSummary {
  return {
    slug: p.slug,
    name: p.name,
    brandSlug: p.brandSlug,
    categorySlug: p.categorySlug,
    shortDescription: p.shortDescription,
    basePrice: p.basePrice,
    compareAtPrice: p.compareAtPrice,
    hairTypes: p.hairTypes,
    objectives: p.objectives,
    image: p.images[0],
  };
}

export async function getAllProducts(): Promise<ProductSummary[]> {
  if (!isDatabaseConfigured) {
    return mockProducts.map(toSummary);
  }
  try {
    const rows = await db.query.products.findMany({
      with: { images: true, brand: true, category: true },
    });
    return rows.map((r) => ({
      slug: r.slug,
      name: r.name,
      brandSlug: r.brand?.slug ?? "",
      categorySlug: r.category?.slug ?? "",
      shortDescription: r.shortDescription ?? "",
      basePrice: Number(r.basePrice),
      compareAtPrice: r.compareAtPrice ? Number(r.compareAtPrice) : null,
      hairTypes: r.hairTypes,
      objectives: r.objectives,
      image: r.images[0]
        ? { url: r.images[0].url, alt: r.images[0].alt }
        : { url: "", alt: r.name },
    }));
  } catch {
    return mockProducts.map(toSummary);
  }
}

export async function getProductsByCategory(categorySlug: string): Promise<ProductSummary[]> {
  if (!isDatabaseConfigured) {
    return getMockProductsByCategory(categorySlug).map(toSummary);
  }
  const all = await getAllProducts();
  return all.filter((p) => p.categorySlug === categorySlug);
}

export async function getProductBySlug(slug: string): Promise<MockProduct | null> {
  if (!isDatabaseConfigured) {
    return getMockProductBySlug(slug);
  }
  try {
    const row = await db.query.products.findFirst({
      where: eq(products.slug, slug),
      with: { images: true, brand: true, category: true, variants: true, reviews: true },
    });
    if (!row) return getMockProductBySlug(slug);
    return {
      id: row.id,
      sku: row.sku,
      slug: row.slug,
      name: row.name,
      brandSlug: row.brand?.slug ?? "",
      categorySlug: row.category?.slug ?? "",
      shortDescription: row.shortDescription ?? "",
      description: row.description,
      usageAdvice: row.usageAdvice ?? "",
      ingredients: row.ingredients ?? "",
      hairTypes: row.hairTypes,
      objectives: row.objectives,
      basePrice: Number(row.basePrice),
      compareAtPrice: row.compareAtPrice ? Number(row.compareAtPrice) : null,
      images: row.images.map((i) => ({ url: i.url, alt: i.alt })),
      variants: row.variants.map((v) => ({
        id: v.id,
        label: v.label,
        sku: v.sku,
        priceOverride: v.priceOverride ? Number(v.priceOverride) : null,
        stockQuantity: v.stockQuantity,
      })),
      reviews: row.reviews.map((r) => ({
        id: r.id,
        authorName: r.authorName,
        rating: r.rating,
        title: r.title ?? "",
        comment: r.comment,
        createdAt: r.createdAt.toISOString(),
      })),
      complementSlugs: [],
      seoTitle: row.seoTitle,
      seoDescription: row.seoDescription,
    };
  } catch {
    return getMockProductBySlug(slug);
  }
}

// Re-exports utiles pour le seed/back-office
export { products, productVariants, productImages, productReviews };
