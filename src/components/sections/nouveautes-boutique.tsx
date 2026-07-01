import Link from "next/link";
import { SectionHeading } from "./section-heading";
import { ProductCard } from "@/components/commerce/product-card";
import { getAllProducts } from "@/lib/data/products";

export async function NouveautesBoutique() {
  const products = await getAllProducts();
  const featured = products.slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Boutique en ligne" title="Les nouveautés" />
      <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {featured.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link href="/boutique" className="text-sm font-medium underline underline-offset-4">
          Découvrir toute la boutique
        </Link>
      </div>
    </section>
  );
}
