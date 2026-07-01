import "dotenv/config";
import bcrypt from "bcryptjs";
import { db, isDatabaseConfigured } from "./index";
import { brands, categories, productImages, products, productVariants, users } from "./schema";
import { mockBrands, mockCategories, mockProducts } from "@/lib/mock/catalog";

async function seed() {
  if (!isDatabaseConfigured) {
    console.error(
      "DATABASE_URL absent : configurez Neon (.env) avant de lancer le seed. Voir .env.example."
    );
    process.exit(1);
  }

  console.log("Seed : compte admin de test...");
  const passwordHash = await bcrypt.hash("admin1234", 10);
  await db
    .insert(users)
    .values({
      email: "admin@laurie-coiffure.fr",
      name: "Admin Laurie Coiffure",
      role: "super_admin",
      passwordHash,
    })
    .onConflictDoNothing({ target: users.email });

  console.log("Seed : marques...");
  for (const b of mockBrands) {
    await db
      .insert(brands)
      .values({ slug: b.slug, name: b.name, logoUrl: b.logoUrl })
      .onConflictDoNothing({ target: brands.slug });
  }

  console.log("Seed : catégories...");
  for (const c of mockCategories) {
    await db
      .insert(categories)
      .values({ slug: c.slug, name: c.name, type: "product" })
      .onConflictDoNothing({ target: categories.slug });
  }

  const dbBrands = await db.query.brands.findMany();
  const dbCategories = await db.query.categories.findMany();
  const brandBySlug = new Map(dbBrands.map((b) => [b.slug, b.id]));
  const categoryBySlug = new Map(dbCategories.map((c) => [c.slug, c.id]));

  console.log("Seed : produits...");
  for (const p of mockProducts) {
    const [inserted] = await db
      .insert(products)
      .values({
        sku: p.sku,
        slug: p.slug,
        name: p.name,
        brandId: brandBySlug.get(p.brandSlug),
        categoryId: categoryBySlug.get(p.categorySlug),
        shortDescription: p.shortDescription,
        description: p.description,
        usageAdvice: p.usageAdvice,
        ingredients: p.ingredients,
        hairTypes: p.hairTypes,
        objectives: p.objectives,
        basePrice: p.basePrice.toString(),
        compareAtPrice: p.compareAtPrice?.toString(),
      })
      .onConflictDoNothing({ target: products.sku })
      .returning();

    const productId = inserted?.id;
    if (!productId) continue;

    for (const v of p.variants) {
      await db
        .insert(productVariants)
        .values({
          productId,
          label: v.label,
          sku: v.sku,
          priceOverride: v.priceOverride?.toString(),
          stockQuantity: v.stockQuantity,
        })
        .onConflictDoNothing({ target: productVariants.sku });
    }

    for (const [i, img] of p.images.entries()) {
      await db.insert(productImages).values({
        productId,
        url: img.url,
        alt: img.alt,
        position: i,
      });
    }
  }

  console.log("Seed terminé.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
