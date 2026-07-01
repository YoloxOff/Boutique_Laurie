import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "./section-heading";
import { getAllServices } from "@/lib/content/services";

export async function PrestationsHighlight() {
  const services = await getAllServices();
  const featured = services.slice(0, 6);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Nos savoir-faire" title="Les prestations" />
      <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
        {featured.map((service) => (
          <Link
            key={service.slug}
            href={`/prestations/${service.slug}`}
            className="group relative aspect-square overflow-hidden rounded-xl"
          >
            <Image
              src={service.image}
              alt={service.name}
              fill
              sizes="(min-width: 1024px) 33vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute bottom-4 left-4 font-heading text-lg text-white">
              {service.name}
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link href="/prestations" className="text-sm font-medium underline underline-offset-4">
          Voir toutes les prestations
        </Link>
      </div>
    </section>
  );
}
