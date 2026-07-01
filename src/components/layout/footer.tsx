import Link from "next/link";
import { AtSign, Globe, Mail, MapPin, Phone } from "lucide-react";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { getSiteSettings } from "@/lib/content/site-settings";
import { env } from "@/env";

const COLONNES = [
  {
    title: "Découvrir",
    links: [
      { href: "/le-salon", label: "Le Salon" },
      { href: "/prestations", label: "Prestations" },
      { href: "/marques", label: "Marques" },
      { href: "/blog", label: "Blog & Conseils" },
      { href: "/galerie", label: "Galerie" },
      { href: "/avis", label: "Avis clients" },
    ],
  },
  {
    title: "Boutique",
    links: [
      { href: "/boutique", label: "Tous les produits" },
      { href: "/boutique/cartes-cadeaux", label: "Cartes cadeaux" },
      { href: "/compte/commandes", label: "Suivi de commande" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Informations",
    links: [
      { href: "/cgv", label: "CGV" },
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/confidentialite", label: "Politique de confidentialité" },
      { href: "/cookies", label: "Politique de cookies" },
    ],
  },
];

export async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="font-heading text-2xl tracking-wide">
              Laurie <span className="italic">Coiffure</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Votre salon expert couleur, balayage et soins capillaires. Une équipe passionnée,
              des produits professionnels haut de gamme, une expérience sur-mesure.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0" /> {settings.address}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" /> {settings.phone}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" /> {settings.email}
              </li>
            </ul>
            <div className="mt-6 flex gap-3">
              {settings.instagram && (
                <Link href={settings.instagram} target="_blank" aria-label="Instagram" className="rounded-full border border-border p-2 hover:bg-background">
                  <AtSign className="size-4" />
                </Link>
              )}
              {settings.facebook && (
                <Link href={settings.facebook} target="_blank" aria-label="Facebook" className="rounded-full border border-border p-2 hover:bg-background">
                  <Globe className="size-4" />
                </Link>
              )}
            </div>
          </div>

          {COLONNES.map((col) => (
            <div key={col.title}>
              <h3 className="font-heading text-sm tracking-wide text-foreground">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-border/60 pt-8 sm:flex sm:items-center sm:justify-between">
          <div>
            <h3 className="font-heading text-sm tracking-wide">Newsletter</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              -10% sur votre première commande en vous inscrivant.
            </p>
          </div>
          <NewsletterForm className="mt-4 sm:mt-0 sm:w-80" />
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {env.NEXT_PUBLIC_SITE_NAME}. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
