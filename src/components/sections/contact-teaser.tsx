import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { BoutonRdv } from "@/components/layout/bouton-rdv";
import { getSiteSettings } from "@/lib/content/site-settings";

export async function ContactTeaser() {
  const settings = await getSiteSettings();

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-primary px-8 py-16 text-center text-primary-foreground">
        <h2 className="font-heading text-3xl italic sm:text-4xl">Venez nous rencontrer</h2>
        <div className="mt-6 flex flex-col items-center gap-2 text-sm text-primary-foreground/80 sm:flex-row sm:justify-center sm:gap-6">
          <span className="flex items-center gap-2">
            <MapPin className="size-4" /> {settings.address}
          </span>
          <span className="flex items-center gap-2">
            <Phone className="size-4" /> {settings.phone}
          </span>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <BoutonRdv className="bg-white text-primary hover:bg-white/90" />
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-2.5 text-sm font-medium hover:bg-white/10"
          >
            Nous contacter
          </Link>
        </div>
      </div>
    </section>
  );
}
