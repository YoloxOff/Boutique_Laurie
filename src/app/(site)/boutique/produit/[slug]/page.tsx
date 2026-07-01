import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
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

  const totalStock = product.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
  const avgRating = product.reviews.length
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0;

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
              inStock: totalStock > 0,
              ratingValue: avgRating || undefined,
              reviewCount: product.reviews.length || undefined,
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

          {product.reviews.length > 0 && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <div className="flex gap-0.5 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4" fill={i < Math.round(avgRating) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-muted-foreground">({product.reviews.length} avis)</span>
            </div>
          )}

          <p className="mt-4 text-muted-foreground">{product.shortDescription}</p>

          <div className="mt-6">
            <AddToCartForm
              productSlug={product.slug}
              variants={product.variants}
              basePrice={product.basePrice}
              stockStatus={totalStock > 0}
            />
          </div>
        </div>
      </div>

      <div className="mt-16">
        <Tabs defaultValue="description">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="conseils">Conseils d&apos;utilisation</TabsTrigger>
            <TabsTrigger value="ingredients">Ingrédients</TabsTrigger>
            <TabsTrigger value="avis">Avis ({product.reviews.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6 max-w-3xl text-muted-foreground">
            {product.description}
          </TabsContent>
          <TabsContent value="conseils" className="mt-6 max-w-3xl text-muted-foreground">
            {product.usageAdvice || "Aucun conseil spécifique renseigné pour ce produit."}
          </TabsContent>
          <TabsContent value="ingredients" className="mt-6 max-w-3xl text-muted-foreground">
            {product.ingredients || "Liste des ingrédients disponible sur l'emballage du produit."}
          </TabsContent>
          <TabsContent value="avis" className="mt-6 max-w-3xl space-y-4">
            {product.reviews.length === 0 && (
              <p className="text-muted-foreground">Aucun avis pour ce produit pour le moment.</p>
            )}
            {product.reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{review.title || review.authorName}</p>
                    <div className="flex gap-0.5 text-accent">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="size-3.5" fill={i < review.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{review.authorName}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
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
