import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionHeading } from "@/components/sections/section-heading";
import { ProductCard } from "@/components/commerce/product-card";
import { getProductsByCategory } from "@/lib/data/products";
import { getAllCategories, getAllBrands } from "@/lib/data/catalog-meta";

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((c) => ({ categorie: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorie: string }>;
}): Promise<Metadata> {
  const { categorie } = await params;
  const categories = await getAllCategories();
  const category = categories.find((c) => c.slug === categorie);
  if (!category) return {};
  return { title: category.name, description: category.description };
}

export default async function BoutiqueCategoriePage({
  params,
}: {
  params: Promise<{ categorie: string }>;
}) {
  const { categorie } = await params;
  const categories = await getAllCategories();
  const category = categories.find((c) => c.slug === categorie);
  if (!category) notFound();

  const [products, brands] = await Promise.all([getProductsByCategory(categorie), getAllBrands()]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Boutique" title={category.name} description={category.description} />
      <p className="mt-8 text-sm text-muted-foreground">{products.length} produit(s)</p>
      <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
      {products.length === 0 && (
        <p className="mt-6 text-muted-foreground">
          Aucun produit dans cette catégorie pour le moment. Découvrez{" "}
          {brands.length ? `nos marques partenaires ${brands.map((b) => b.name).join(", ")}.` : "notre boutique."}
        </p>
      )}
    </div>
  );
}
