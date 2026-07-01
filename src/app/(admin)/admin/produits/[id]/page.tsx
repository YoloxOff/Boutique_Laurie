import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { StockInput } from "@/components/forms/stock-input";
import { ProductEditForm } from "@/components/forms/product-edit-form";
import { db, isDatabaseConfigured } from "@/db";
import { products } from "@/db/schema";
import { deleteProduct } from "@/lib/admin/products-actions";
import { getMockProductBySlug } from "@/lib/mock/catalog";
import { formatPrice } from "@/lib/format";
import { assertPagePermission } from "@/lib/admin/permissions";

export const metadata: Metadata = { title: "Admin — Gérer le produit" };

export default async function AdminProduitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await assertPagePermission("products");
  const { id } = await params;

  if (!isDatabaseConfigured) {
    const product = getMockProductBySlug(id);
    if (!product) notFound();
    return (
      <div>
        <h1 className="font-heading text-2xl">{product.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Mode démo : lecture seule. Configurez Neon (DATABASE_URL) pour modifier ce produit.
        </p>
        <div className="mt-6 space-y-2 text-sm">
          <p>SKU : {product.sku}</p>
          <p>Prix : {formatPrice(product.basePrice)}</p>
          <p>Variantes :</p>
          <ul className="ml-4 list-disc">
            {product.variants.map((v) => (
              <li key={v.id}>
                {v.label} — stock : {v.stockQuantity}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: { variants: true },
  });
  if (!product) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl">{product.name}</h1>
        <form action={deleteProduct.bind(null, product.id)}>
          <Button variant="destructive" type="submit">
            Supprimer
          </Button>
        </form>
      </div>

      <p className="mt-2 text-sm text-muted-foreground">
        SKU {product.sku} — {formatPrice(Number(product.basePrice))}
      </p>

      <div className="mt-8 rounded-xl border border-border p-6">
        <h2 className="font-heading text-lg">Informations &amp; SEO</h2>
        <div className="mt-4">
          <ProductEditForm
            id={product.id}
            name={product.name}
            description={product.description}
            basePrice={Number(product.basePrice)}
            slug={product.slug}
            seoTitle={product.seoTitle}
            seoDescription={product.seoDescription}
          />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-heading text-lg">Variantes &amp; stock</h2>
        <div className="mt-4 space-y-3">
          {product.variants.map((variant) => (
            <div key={variant.id} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="font-medium">{variant.label}</p>
                <p className="text-xs text-muted-foreground">{variant.sku}</p>
              </div>
              <StockInput variantId={variant.id} initialStock={variant.stockQuantity} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
