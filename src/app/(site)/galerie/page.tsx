import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/sections/section-heading";
import { getGallery } from "@/lib/content/gallery";
import { getSiteSettings } from "@/lib/content/site-settings";

export const metadata: Metadata = {
  title: "Galerie",
  description: "Photos du salon, réalisations avant/après et vidéos de Laurie Coiffure.",
};

export default async function GaleriePage() {
  const [items, settings] = await Promise.all([getGallery(), getSiteSettings()]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Nos réalisations" title="Galerie" />

      <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
        {items.map((item) => (
          <div key={item.id} className="mb-4 break-inside-avoid overflow-hidden rounded-xl">
            {item.type === "avant-apres" && item.imageAfter ? (
              <div className="grid grid-cols-2 gap-1">
                <div className="relative aspect-[3/4]">
                  <Image src={item.image} alt={`${item.title} — avant`} fill sizes="20vw" className="object-cover" />
                </div>
                <div className="relative aspect-[3/4]">
                  <Image src={item.imageAfter} alt={`${item.title} — après`} fill sizes="20vw" className="object-cover" />
                </div>
              </div>
            ) : (
              <div className="relative aspect-[4/5]">
                <Image src={item.image} alt={item.title} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover" />
              </div>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              {item.category} — {item.title}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-sm font-medium underline underline-offset-4">
          Voir plus de photos sur Instagram
        </a>
      </div>
    </div>
  );
}
