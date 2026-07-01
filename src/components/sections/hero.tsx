import Image from "next/image";
import Link from "next/link";
import { BoutonRdv } from "@/components/layout/bouton-rdv";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex h-[85vh] min-h-[560px] items-end overflow-hidden">
      <Image
        src="https://picsum.photos/seed/hero-salon/1920/1200"
        alt="Salon Laurie Coiffure — intérieur"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/80">Laurie Coiffure</p>
        <h1 className="mt-4 max-w-2xl font-heading text-4xl italic leading-tight text-white sm:text-5xl lg:text-6xl">
          Votre salon expert couleur, balayage et soins capillaires.
        </h1>
        <div className="mt-8 flex flex-wrap gap-4">
          <BoutonRdv className="bg-white text-primary hover:bg-white/90" />
          <Button
            variant="outline"
            className="border-white/60 bg-transparent text-white hover:bg-white/10"
            render={<Link href="/boutique" />}
          >
            Découvrir la boutique
          </Button>
        </div>
      </div>
    </section>
  );
}
