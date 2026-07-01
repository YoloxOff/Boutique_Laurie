"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BoutonRdv } from "@/components/layout/bouton-rdv";

const SLIDES = [
  {
    title: "La mariée",
    image: "/laurie/la-mariee.jpg",
    paragraphs: [
      "Future mariée : vous cherchez LA coiffure et LA coiffeuse pour le plus beau jour de votre vie ?",
      "Pour commencer : nous organiserons un premier rendez-vous pour faire connaissance, discuter de vos envies, attentes, répondre à toutes vos questions. Lors de cette entrevue, nous pouvons nuancer vos cheveux pour apporter de la lumière et du relief à votre coiffure lors du grand jour. Nous pouvons également échanger sur votre mise en beauté.",
      "Le jour J, je vous sublime avec la coiffure que nous aurons définie ensemble. J'ajouterai les finitions nécessaires pour apporter brillance, tenue et élégance tout au long de la journée.",
      "Je peux également fixer votre voile et montrer à vos témoins la technique d'accroche.",
    ],
    price: "Formule mariée à partir de 180 €, en fonction du lieu de la prestation.",
    extra: "Le jour de l'essai, nous créerons la coiffure dans le style souhaité. Un deuxième essai peut être réalisé à partir de 30 €.",
  },
  {
    title: "Demoiselles d'honneur et invités",
    image: "/laurie/demoiselles-dhonneurs-.jpg",
    paragraphs: [
      "Tout le monde doit être parfait !",
      "Vous souhaitez que vos témoins, demoiselles d'honneur et invitées soient coiffées avec harmonie et élégance ? Je vous propose des coiffures adaptées à chacune, afin d'obtenir un ensemble cohérent et parfaitement assorti à votre thème.",
      "Si un membre de la famille a besoin d'aide — pour un coup de peigne, un brushing, un attaché ou encore un chignon — je peux également m'en occuper.",
      "S'il y a des enfants et qu'ils souhaitent une coiffure de princesse ou de prince pour compléter leurs tenues, je serai ravie de réaliser leurs envies.",
    ],
    price: "Cheveux courts : 40 € — Cheveux longs : 50 €",
    extra: "Un devis global vous sera automatiquement proposé selon le nombre de personnes à coiffer.",
  },
];

export function MarriageSection() {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const prev = () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setIndex((i) => (i + 1) % SLIDES.length);

  return (
    <section id="marriage" className="relative w-full scroll-mt-20 bg-gradient-to-r from-stone-100 to-stone-200 px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-10 text-3xl font-bold text-[#c39c51] sm:text-4xl lg:text-5xl">Mariage</h2>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-sm ring-1 ring-[#e6d5a3]">
            <Image src={slide.image} alt={slide.title} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </div>
          <div className="rounded-2xl border border-[#e6d5a3] bg-white p-6 shadow-sm sm:p-8">
            <h3 className="mb-4 font-serif text-2xl text-[#c39c51] sm:text-3xl">{slide.title}</h3>
            <div className="space-y-3 text-sm text-stone-800 sm:text-base">
              {slide.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <p className="mt-4 font-semibold text-stone-900">{slide.price}</p>
            <p className="mt-2 text-sm text-stone-600">{slide.extra}</p>
            <BoutonRdv className="mt-6" />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={prev}
            aria-label="Précédent"
            className="rounded-full border border-[#e6d5a3] bg-white p-2 shadow-sm transition-all hover:scale-105 hover:border-[#c39c51]"
          >
            <ChevronLeft className="size-5 text-stone-700" />
          </button>
          <div className="flex gap-1.5">
            {SLIDES.map((s, i) => (
              <button
                key={s.title}
                type="button"
                aria-label={`Voir ${s.title}`}
                onClick={() => setIndex(i)}
                className={`size-1.5 rounded-full transition-all ${i === index ? "w-4 bg-[#c39c51]" : "bg-stone-300"}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            aria-label="Suivant"
            className="rounded-full border border-[#e6d5a3] bg-white p-2 shadow-sm transition-all hover:scale-105 hover:border-[#c39c51]"
          >
            <ChevronRight className="size-5 text-stone-700" />
          </button>
        </div>
      </div>
    </section>
  );
}
