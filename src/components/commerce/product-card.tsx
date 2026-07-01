import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { WishlistButton } from "@/components/commerce/wishlist-button";
import { formatPrice } from "@/lib/format";
import { isInWishlist } from "@/lib/wishlist";
import type { ProductSummary } from "@/lib/data/products";

export async function ProductCard({ product }: { product: ProductSummary }) {
  const onSale = product.compareAtPrice && product.compareAtPrice > product.basePrice;
  const wishlisted = await isInWishlist(product.slug);

  return (
    <Link href={`/boutique/produit/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-secondary">
        {product.image?.url && (
          <Image
            src={product.image.url}
            alt={product.image.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {onSale && (
          <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground">Promo</Badge>
        )}
        <WishlistButton
          productSlug={product.slug}
          initialActive={wishlisted}
          className="absolute right-3 top-3"
        />
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{product.brandSlug.replace(/-/g, " ")}</p>
        <h3 className="font-medium text-foreground">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="font-heading text-base">{formatPrice(product.basePrice)}</span>
          {onSale && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice as number)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
