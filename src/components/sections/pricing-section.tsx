import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BoutonRdv } from "@/components/layout/bouton-rdv";
import { getAllServices } from "@/lib/content/services";

const CATEGORIES = [
  { key: "femme", label: "Femmes", image: "/laurie/forfaits-femmes-coupes-couleurs-meches-ombres-brushings.jpg", tagline: "Coupe, brushing, couleur, balayage, mèches, ombré, patine, lissage brésilien" },
  { key: "homme", label: "Hommes", image: "/laurie/coupes-hommes.jpg", tagline: "Coupe, coiffage, taille de barbe" },
  { key: "enfant", label: "Enfants", image: "/laurie/coupes-bebes-enfants-adolescents.jpg", tagline: "Pour bébés, enfants ou adolescents : coupe, coiffage" },
] as const;

export async function PricingSection() {
  const services = await getAllServices();

  return (
    <section id="pricing" className="relative w-full bg-stone-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-10 text-3xl font-bold text-[#c39c51] sm:text-4xl lg:text-5xl">Prestation et Tarif</h2>

        <Tabs defaultValue="femme" className="w-full items-stretch">
          <TabsList className="mb-8 h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0 sm:justify-center">
            {CATEGORIES.map((cat) => (
              <TabsTrigger
                key={cat.key}
                value={cat.key}
                className="h-auto rounded-md border border-[#e6d5a3] px-4 py-2 text-sm font-semibold data-active:border-[#c39c51] data-active:bg-[#c39c51] data-active:text-white"
              >
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {CATEGORIES.map((cat) => {
            const items = services.filter((s) => s.category === cat.key);
            return (
              <TabsContent key={cat.key} value={cat.key}>
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
                    <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-3 text-sm">
                      {items.map((service) => (
                        <div key={service.slug} className="contents">
                          <div>{service.name}</div>
                          <div className="text-right font-medium">{service.price}</div>
                        </div>
                      ))}
                    </div>
                    <BoutonRdv className="mt-6" />
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#c39c51] via-[#e6d5a3] to-[#c39c51]" />
    </section>
  );
}
