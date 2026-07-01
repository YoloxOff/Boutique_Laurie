import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/sections/section-heading";
import { getAllBrandStories } from "@/lib/content/brands";

export const metadata: Metadata = {
  title: "Marques partenaires",
  description: "Découvrez les marques professionnelles partenaires de Laurie Coiffure : L'Oréal Professionnel, Kérastase, GHD, Redken.",
};

export default async function MarquesPage() {
  const brands = await getAllBrandStories();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Excellence & savoir-faire" title="Nos marques partenaires" />
      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        {brands.map((brand) => (
          <Link key={brand.slug} href={`/marques/${brand.slug}`} className="group overflow-hidden rounded-2xl border border-border">
            <div className="relative aspect-[16/9]">
              <Image src={brand.heroImage} alt={brand.name} fill sizes="50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="p-6">
              <h2 className="font-heading text-xl">{brand.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{brand.story}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
