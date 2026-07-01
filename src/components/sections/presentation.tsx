import Image from "next/image";
import { SectionHeading } from "./section-heading";

export function Presentation() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
          <Image
            src="/laurie/voir-plus.jpg"
            alt="Laurie, coiffeuse à domicile"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <SectionHeading
            eyebrow="Notre savoir-faire"
            title="Une coiffeuse à domicile, une exigence de grande maison"
            align="left"
          />
          <p className="mt-6 text-muted-foreground">
            Diplômée du Brevet Professionnel depuis 2012, Laurie conjugue expertise technique et
            écoute attentive pour révéler la beauté naturelle de chaque chevelure, directement chez
            vous. Coupe, couleur, balayage, lissage brésilien : chaque prestation est pensée
            sur-mesure, avec des produits professionnels de qualité.
          </p>
        </div>
      </div>
    </section>
  );
}
