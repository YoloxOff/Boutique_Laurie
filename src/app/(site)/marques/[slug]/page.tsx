import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/commerce/product-card";
import { getAllBrandStories, getBrandStoryBySlug } from "@/lib/content/brands";
import { getAllProducts } from "@/lib/data/products";

export async function generateStaticParams() {
  const brands = await getAllBrandStories();
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandStoryBySlug(slug);
  if (!brand) return {};
  return { title: brand.name, description: brand.story };
}

export default async function MarquePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = await getBrandStoryBySlug(slug);
  if (!brand) notFound();

  const allProducts = await getAllProducts();
  const products = allProducts.filter((p) => p.brandSlug === slug);

  return (
    <div>
      <div className="relative flex h-80 items-end">
        <Image src={brand.heroImage} alt={brand.name} fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <h1 className="relative mx-auto max-w-7xl px-4 pb-8 font-heading text-4xl text-white sm:px-6 lg:px-8">
          {brand.name}
        </h1>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-muted-foreground">{brand.story}</p>
      </div>

      {products.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl">Produits {brand.name}</h2>
          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
