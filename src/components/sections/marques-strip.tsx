import Link from "next/link";
import { SectionHeading } from "./section-heading";
import { getAllBrands } from "@/lib/data/catalog-meta";

export async function MarquesStrip() {
  const brands = await getAllBrands();

  return (
    <section className="border-y border-border/60 bg-secondary/40 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Ils nous font confiance" title="Les marques partenaires" />
        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/marques/${brand.slug}`}
              className="flex aspect-[3/2] items-center justify-center rounded-lg border border-border bg-background px-4 text-center font-heading text-sm transition-colors hover:border-accent"
            >
              {brand.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
