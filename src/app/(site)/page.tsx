import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { Presentation } from "@/components/sections/presentation";
import { PrestationsHighlight } from "@/components/sections/prestations-highlight";
import { MarquesStrip } from "@/components/sections/marques-strip";
import { NouveautesBoutique } from "@/components/sections/nouveautes-boutique";
import { AvantApres } from "@/components/sections/avant-apres";
import { AvisClients } from "@/components/sections/avis-clients";
import { InstagramFeed } from "@/components/sections/instagram-feed";
import { ContactTeaser } from "@/components/sections/contact-teaser";
import { jsonLdLocalBusiness } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  description:
    "Laurie Coiffure : salon expert couleur, balayage et soins capillaires. Prenez rendez-vous et découvrez notre boutique de produits professionnels en ligne.",
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdLocalBusiness()) }}
      />
      <Hero />
      <Presentation />
      <PrestationsHighlight />
      <MarquesStrip />
      <NouveautesBoutique />
      <AvantApres />
      <AvisClients />
      <InstagramFeed />
      <ContactTeaser />
    </>
  );
}
