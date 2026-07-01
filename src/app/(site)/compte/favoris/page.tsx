import type { Metadata } from "next";
import { ProductCard } from "@/components/commerce/product-card";
import { getWishlistSlugs } from "@/lib/wishlist";
import { getAllProducts } from "@/lib/data/products";

export const metadata: Metadata = { title: "Mes favoris" };

export default async function FavorisPage() {
  const [slugs, products] = await Promise.all([getWishlistSlugs(), getAllProducts()]);
  const favorites = products.filter((p) => slugs.includes(p.slug));

  return (
    <div>
      <h1 className="font-heading text-2xl">Mes favoris</h1>

      {favorites.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Vous n&apos;avez pas encore ajouté de produit à vos favoris.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3">
          {favorites.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
