import type { Metadata } from "next";
import { HomeHero } from "@/components/sections/home-hero";
import { PricingSection } from "@/components/sections/pricing-section";
import { MarriageSection } from "@/components/sections/marriage-section";
import { RealisationsSection } from "@/components/sections/realisations-section";
import { ContactSection } from "@/components/sections/contact-section";
import { jsonLdLocalBusiness } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  description:
    "Laurie Coiffure : coiffure à domicile à Toulouse nord et alentours, spécialiste couleur, balayage et coiffures de mariée.",
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdLocalBusiness()) }}
      />
      <HomeHero />
      <PricingSection />
      <MarriageSection />
      <RealisationsSection />
      <ContactSection />
    </>
  );
}
