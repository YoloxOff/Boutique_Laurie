"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { SimpleCarousel } from "./simple-carousel";

const HERO_IMAGES = [
  { src: "/laurie/la-mariee.jpg", alt: "Laurie Coiffure — coiffure de mariée" },
  { src: "/laurie/voir-plus.jpg", alt: "Laurie Coiffure — coiffure de mariée en préparation" },
  { src: "/laurie/forfaits-femmes-coupes-couleurs-meches-ombres-brushings.jpg", alt: "Laurie Coiffure — coupe et brushing" },
];

export function HomeHero() {
  const [open, setOpen] = useState(false);

  return (
    <section
      id="home"
      className="relative w-full scroll-mt-20 bg-gradient-to-b from-stone-50 via-stone-100 to-stone-200 px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#c39c51] via-[#e6d5a3] to-[#c39c51]" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div className="space-y-5">
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-[#b8923a] via-[#c39c51] to-[#e6d5a3] bg-clip-text text-transparent">
              Laurie
            </span>
          </h1>
          <div className="h-1 w-24 rounded-full bg-gradient-to-r from-[#c39c51] to-[#e6d5a3]" />
          <p className="text-lg font-semibold tracking-wide text-[#c39c51] sm:text-xl">
            Coiffure à domicile Toulouse nord et alentours
          </p>
          <p className="max-w-2xl text-lg text-stone-700 sm:text-xl">
            Coiffeuse étant passionnée par les coiffures de mariées. Diplômée du Brevet Professionnel
            en 2012, grâce à ma créativité et mon amour pour la coiffure je vous conseille et vous
            sublime. Je suis visagiste, coloriste pour votre quotidien à l&apos;écoute de vos envies et
            vous accompagne dans le choix de votre coiffure.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="flex cursor-pointer items-center gap-2 rounded-md bg-[#c39c51] px-6 py-3 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#b8923a]"
            >
              En savoir plus
              <ChevronRight className={`size-4 transition-transform duration-300 ${open ? "rotate-90" : "rotate-0"}`} />
            </button>
          </div>
        </div>

        <SimpleCarousel images={HERO_IMAGES} />
      </div>

      {open && (
        <div className="mx-auto mt-10 max-w-7xl animate-in fade-in-0 slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative overflow-hidden rounded-2xl shadow-sm ring-1 ring-[#e6d5a3]">
              <Image
                src="/laurie/demoiselles-dhonneurs-.jpg"
                alt="Laurie Coiffure — témoins"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="rounded-2xl border border-[#e6d5a3] bg-white p-6 shadow-sm sm:p-8">
              <h3 className="mb-4 font-serif text-2xl text-[#c39c51] sm:text-3xl">Une passion</h3>
              <div className="space-y-4 text-stone-800">
                <p>
                  Je m&apos;appelle Laurie. Passionnée par la coiffure depuis mes 16 ans, je suis basée à
                  Saint-Jean et je propose mes services de coiffure à domicile à Toulouse et dans sa
                  périphérie.
                </p>
                <p>
                  J&apos;ai d&apos;abord travaillé dans plusieurs grands salons de coiffure avant de me lancer
                  dans la belle aventure de l&apos;entrepreneuriat.
                </p>
                <p>
                  Diplômée du BP depuis 2012, je mets mon expertise à votre service pour vous conseiller
                  et vous sublimer, tout en restant à l&apos;écoute de vos envies. Formée au visagisme et à
                  la colorimétrie, je vous accompagne dans le choix de la coiffure la mieux adaptée à
                  votre style et à votre morphologie.
                </p>
                <p>
                  Passionnée par l&apos;univers de la mode et de la beauté, j&apos;allie créativité et
                  savoir-faire pour vous proposer des prestations personnalisées. J&apos;aime
                  particulièrement réaliser des coiffures pour les événements : mariages, fêtes,
                  cérémonies… C&apos;est dans ces moments privilégiés que je m&apos;épanouis le plus.
                </p>
                <p>
                  Toujours attentive aux tendances, je me forme régulièrement pour vous proposer les
                  dernières nouveautés et vous offrir un service moderne, soigné et professionnel.
                </p>
              </div>
            </div>
          </div>
          <div className="my-8 h-px bg-gradient-to-r from-[#e6d5a3] via-[#c39c51] to-[#e6d5a3]" />
          <div>
            <h4 className="mb-4 text-center text-lg font-semibold text-[#c39c51] sm:text-xl">Diplômes</h4>
            <div className="w-full overflow-hidden rounded-2xl shadow-sm ring-1 ring-[#e6d5a3]">
              <Image
                src="/laurie/deplome.jpg"
                alt="Diplôme du Brevet Professionnel"
                width={1200}
                height={850}
                className="block h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#c39c51] via-[#e6d5a3] to-[#c39c51]" />
    </section>
  );
}
