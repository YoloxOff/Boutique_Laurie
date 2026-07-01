import Image from "next/image";
import { SectionHeading } from "./section-heading";
import { getGallery } from "@/lib/content/gallery";

export async function AvantApres() {
  const gallery = await getGallery();
  const items = gallery.filter((g) => g.type === "avant-apres").slice(0, 3);
  if (!items.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Nos réalisations" title="Avant / Après" />
      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.id}>
            <div className="grid grid-cols-2 gap-1 overflow-hidden rounded-xl">
              <div className="relative aspect-[3/4]">
                <Image src={item.image} alt={`${item.title} — avant`} fill sizes="20vw" className="object-cover" />
                <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[10px] uppercase text-white">Avant</span>
              </div>
              <div className="relative aspect-[3/4]">
                {item.imageAfter && (
                  <Image src={item.imageAfter} alt={`${item.title} — après`} fill sizes="20vw" className="object-cover" />
                )}
                <span className="absolute bottom-2 left-2 rounded bg-accent px-2 py-0.5 text-[10px] uppercase text-accent-foreground">Après</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
