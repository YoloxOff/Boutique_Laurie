import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/sections/section-heading";
import { getAllServices } from "@/lib/content/services";

export const metadata: Metadata = {
  title: "Prestations",
  description:
    "Découvrez les prestations de coiffure à domicile de Laurie : coupe, couleur, balayage, mèches, lissage brésilien pour femmes, hommes, enfants, et formules mariage.",
};

const GROUPES: { key: "femme" | "homme" | "enfant" | "mariage"; label: string }[] = [
  { key: "femme", label: "Femme" },
  { key: "homme", label: "Homme" },
  { key: "enfant", label: "Enfant" },
  { key: "mariage", label: "Mariage" },
];

export default async function PrestationsPage() {
  const services = await getAllServices();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Nos savoir-faire" title="Toutes nos prestations" />

      {GROUPES.map((groupe) => {
        const items = services.filter((s) => s.category === groupe.key);
        if (!items.length) return null;
        return (
          <div key={groupe.key} className="mt-16">
            <h2 className="font-heading text-2xl">{groupe.label}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((service) => (
                <Link
                  key={service.slug}
                  href={`/prestations/${service.slug}`}
                  className="group overflow-hidden rounded-xl border border-border transition-colors hover:border-accent"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading text-lg">{service.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span>{service.duration}</span>
                      <span className="font-medium">{service.price}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
