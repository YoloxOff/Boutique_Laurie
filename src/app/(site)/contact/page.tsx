import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { SectionHeading } from "@/components/sections/section-heading";
import { ContactForm } from "@/components/forms/contact-form";
import { BoutonRdv } from "@/components/layout/bouton-rdv";
import { getSiteSettings } from "@/lib/content/site-settings";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez Laurie Coiffure : adresse, téléphone, email, horaires et formulaire de contact.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="À votre écoute" title="Contactez-nous" />

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <div>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <MapPin className="size-5 text-accent-foreground/70" /> {settings.address}
            </li>
            <li className="flex items-center gap-3">
              <Phone className="size-5 text-accent-foreground/70" /> {settings.phone}
            </li>
            <li className="flex items-center gap-3">
              <Mail className="size-5 text-accent-foreground/70" /> {settings.email}
            </li>
          </ul>

          <div className="mt-8">
            <h2 className="font-heading text-lg">Horaires</h2>
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              {settings.hours.map((h) => (
                <li key={h.day} className="flex justify-between border-b border-border/60 pb-1.5">
                  <span>{h.day}</span>
                  <span>{h.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          <BoutonRdv className="mt-8" />

          <div className="mt-8 aspect-video overflow-hidden rounded-xl border border-border">
            <iframe
              title="Google Maps — Laurie Coiffure"
              src={`https://www.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`}
              className="size-full"
              loading="lazy"
            />
          </div>
        </div>

        <div>
          <h2 className="font-heading text-lg">Envoyez-nous un message</h2>
          <div className="mt-4">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
