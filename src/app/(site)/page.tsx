import type { Metadata } from "next";
import { HomeHero } from "@/components/sections/home-hero";
import { PricingSection } from "@/components/sections/pricing-section";
import { MarriageSection } from "@/components/sections/marriage-section";
import { RealisationsSection } from "@/components/sections/realisations-section";
import { ContactSection } from "@/components/sections/contact-section";
import { SectionReveal } from "@/components/sections/section-reveal";
import { jsonLdLocalBusiness } from "@/lib/seo/jsonld";
import { getSiteSettings } from "@/lib/content/site-settings";

const DEFAULT_DESCRIPTION =
  "Laurie Coiffure : coiffure à domicile à Toulouse nord et alentours, spécialiste couleur, balayage et coiffures de mariée.";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.metaTitle || undefined,
    description: settings.metaDescription || DEFAULT_DESCRIPTION,
  };
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdLocalBusiness()) }}
      />
      <SectionReveal>
        <HomeHero />
      </SectionReveal>
      <SectionReveal>
        <PricingSection />
      </SectionReveal>
      <SectionReveal>
        <MarriageSection />
      </SectionReveal>
      <SectionReveal>
        <RealisationsSection />
      </SectionReveal>
      <SectionReveal>
        <ContactSection />
      </SectionReveal>
    </>
  );
}
