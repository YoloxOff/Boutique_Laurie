import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/sections/section-heading";
import { ProductCard } from "@/components/commerce/product-card";
import { ProductFilters } from "@/components/commerce/product-filters";
import { getAllProducts } from "@/lib/data/products";
import { getAllBrands, getAllCategories } from "@/lib/data/catalog-meta";
import { loadBoutiqueSearchParams } from "@/lib/search-params";
import type { SearchParams } from "nuqs/server";

export const metadata: Metadata = {
  title: "Boutique",
  description: "Découvrez notre sélection de produits professionnels : shampoings, soins, huiles, produits coiffants et accessoires.",
};

export default async function BoutiquePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { recherche, marque, objectif, tri } = await loadBoutiqueSearchParams(searchParams);
  const [products, brands, categories] = await Promise.all([
    getAllProducts(),
    getAllBrands(),
    getAllCategories(),
  ]);

  const objectives = Array.from(new Set(products.flatMap((p) => p.objectives)));

  let filtered = products.filter((p) => {
    if (recherche && !p.name.toLowerCase().includes(recherche.toLowerCase())) return false;
    if (marque.length && !marque.includes(p.brandSlug)) return false;
    if (objectif.length && !objectif.some((o) => p.objectives.includes(o))) return false;
    return true;
  });

  if (tri === "prix-asc") filtered = [...filtered].sort((a, b) => a.basePrice - b.basePrice);
  if (tri === "prix-desc") filtered = [...filtered].sort((a, b) => b.basePrice - a.basePrice);
  if (tri === "nom") filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Produits professionnels" title="La boutique" />

      <div className="mt-10 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/boutique/${cat.slug}`}
            className="rounded-full border border-border px-4 py-1.5 text-sm hover:border-accent"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <ProductFilters brands={brands} objectives={objectives} />
        </aside>
        <div>
          <p className="mb-6 text-sm text-muted-foreground">{filtered.length} produit(s)</p>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-muted-foreground">Aucun produit ne correspond à votre recherche.</p>
          )}
        </div>
      </div>
    </div>
  );
}
