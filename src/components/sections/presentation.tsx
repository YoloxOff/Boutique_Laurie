import Image from "next/image";
import { SectionHeading } from "./section-heading";

export function Presentation() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
          <Image
            src="https://picsum.photos/seed/presentation-salon/900/1100"
            alt="Laurie, fondatrice du salon"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <SectionHeading
            eyebrow="Notre savoir-faire"
            title="Un salon à taille humaine, une exigence de grande maison"
            align="left"
          />
          <p className="mt-6 text-muted-foreground">
            Depuis plus de 10 ans, Laurie et son équipe conjuguent expertise technique et écoute
            attentive pour révéler la beauté naturelle de chaque chevelure. Coloration, balayage,
            soins signature : chaque prestation est pensée sur-mesure, avec des produits
            professionnels sélectionnés parmi les plus grandes marques.
          </p>
        </div>
      </div>
    </section>
  );
}
