"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BoutonRdv } from "@/components/layout/bouton-rdv";
import { cn } from "@/lib/utils";
import type { MockService } from "@/lib/mock/content";

const CATEGORIES = [
  { key: "femme", label: "Femmes", image: "/laurie/forfaits-femmes-coupes-couleurs-meches-ombres-brushings.jpg", tagline: "Coupe, brushing, couleur, balayage, mèches, ombré, patine, lissage brésilien" },
  { key: "homme", label: "Hommes", image: "/laurie/coupes-hommes.jpg", tagline: "Coupe, coiffage, taille de barbe" },
  { key: "enfant", label: "Enfants", image: "/laurie/coupes-bebes-enfants-adolescents.jpg", tagline: "Pour bébés, enfants ou adolescents : coupe, coiffage" },
] as const;

export function PricingTabsClient({ services }: { services: MockService[] }) {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]["key"]>("femme");
  const direction = useRef(0);

  const activeIndex = CATEGORIES.findIndex((c) => c.key === active);
  const select = (key: (typeof CATEGORIES)[number]["key"]) => {
    const nextIndex = CATEGORIES.findIndex((c) => c.key === key);
    direction.current = nextIndex > activeIndex ? 1 : -1;
    setActive(key);
  };

  const cat = CATEGORIES[activeIndex];
  const items = services.filter((s) => s.category === cat.key);

  return (
    <div>
      <div className="mb-8 flex flex-wrap justify-start gap-2 sm:justify-center">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => select(c.key)}
            aria-pressed={active === c.key}
            className={cn(
              "rounded-md border px-4 py-2 text-sm font-semibold transition-colors",
              active === c.key
                ? "border-[#c39c51] bg-[#c39c51] text-white"
                : "border-[#e6d5a3] text-stone-700 hover:bg-[#c39c5112]"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction.current} initial={false}>
          <motion.div
            key={cat.key}
            custom={direction.current}
            initial={{ x: direction.current >= 0 ? 48 : -48, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction.current >= 0 ? -48 : 48, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-[#e6d5a3]">
                <div className="relative aspect-[4/3]">
                  <Image src={cat.image} alt={cat.label} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                </div>
                <div className="bg-white p-5">
                  <p className="text-xl font-semibold text-stone-900">{cat.label}</p>
                  <p className="mt-1 text-sm text-stone-600">{cat.tagline}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-[#e6d5a3] bg-white p-6 shadow-sm sm:p-8">
                {cat.key === "femme" ? (
                  <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-x-3 gap-y-3 text-sm">
                    <div />
                    <div className="border-b border-[#e6d5a3] pb-2 text-center text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Cheveux courts
                    </div>
                    <div className="border-b border-[#e6d5a3] pb-2 text-center text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Cheveux longs
                    </div>
                    {items.map((service) => {
                      const [courts, longs, ...rest] = service.price.split(" / ").map((p) => p.trim());
                      const hasTwoPrices = longs !== undefined && rest.length === 0;
                      return (
                        <div key={service.slug} className="contents">
                          <div className="self-center">{service.name}</div>
                          {hasTwoPrices ? (
                            <>
                              <div className="text-center font-medium">{courts}</div>
                              <div className="text-center font-medium">{longs}</div>
                            </>
                          ) : (
                            <div className="col-span-2 text-center font-medium">{service.price}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-3 text-sm">
                    {items.map((service) => (
                      <div key={service.slug} className="contents">
                        <div>{service.name}</div>
                        <div className="text-right font-medium">{service.price}</div>
                      </div>
                    ))}
                  </div>
                )}
                <BoutonRdv className="mt-6" />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
