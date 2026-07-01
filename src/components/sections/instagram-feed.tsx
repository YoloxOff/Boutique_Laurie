import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "./section-heading";
import { getSiteSettings } from "@/lib/content/site-settings";

export async function InstagramFeed() {
  const settings = await getSiteSettings();
  const posts = Array.from({ length: 6 }, (_, i) => `https://picsum.photos/seed/insta-${i}/600/600`);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="@lauriecoiffure" title="Suivez-nous sur Instagram" />
      <div className="mt-12 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {posts.map((src, i) => (
          <Link
            key={i}
            href={settings.instagram}
            target="_blank"
            className="relative aspect-square overflow-hidden rounded-md"
          >
            <Image src={src} alt="Publication Instagram Laurie Coiffure" fill sizes="16vw" className="object-cover transition-transform hover:scale-105" />
          </Link>
        ))}
      </div>
    </section>
  );
}
