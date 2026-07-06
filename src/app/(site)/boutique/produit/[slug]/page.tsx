import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProductGallery } from "@/components/commerce/product-gallery";
import { AddToCartForm } from "@/components/commerce/add-to-cart-form";
import { ProductCard } from "@/components/commerce/product-card";
import { getAllProducts, getProductBySlug } from "@/lib/data/products";
import { jsonLdBreadcrumb, jsonLdProduct } from "@/lib/seo/jsonld";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.shortDescription,
  };
}

export default async function ProduitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const allProducts = await getAllProducts();
  const complements = allProducts.filter((p) => product.complementSlugs.includes(p.slug));

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            jsonLdProduct({
              name: product.name,
              description: product.description,
              slug: product.slug,
              brandName: product.brandSlug,
              sku: product.sku,
              basePrice: product.basePrice,
              imageUrl: product.images[0]?.url,
              inStock: true,
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            jsonLdBreadcrumb([
              { name: "Accueil", url: "/" },
              { name: "Boutique", url: "/boutique" },
              { name: product.name, url: `/boutique/produit/${product.slug}` },
            ])
          ),
        }}
      />

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/boutique">Boutique</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} />

        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{product.brandSlug.replace(/-/g, " ")}</p>
          <h1 className="mt-1 font-heading text-3xl">{product.name}</h1>

          <p className="mt-4 text-muted-foreground">{product.shortDescription}</p>

          <div className="mt-6">
            <AddToCartForm
              productSlug={product.slug}
              variants={product.variants}
              basePrice={product.basePrice}
            />
          </div>
        </div>
      </div>

      <div className="mt-16 max-w-3xl">
        <h2 className="font-heading text-xl">Description</h2>
        <p className="mt-4 text-muted-foreground">{product.description}</p>
      </div>

      {complements.length > 0 && (
        <div className="mt-16">
          <h2 className="font-heading text-2xl">Vous aimerez aussi</h2>
          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {complements.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
