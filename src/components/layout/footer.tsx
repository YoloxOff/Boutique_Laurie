import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/icons/social-icons";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { getSiteSettings } from "@/lib/content/site-settings";
import { env } from "@/env";

const COLONNES = [
  {
    title: "Découvrir",
    links: [
      { href: "/#pricing", label: "Tarifs" },
      { href: "/#marriage", label: "Mariage" },
      { href: "/#products", label: "Réalisations" },
    ],
  },
  {
    title: "Boutique",
    links: [
      { href: "/boutique", label: "Tous les produits" },
      { href: "/compte/commandes", label: "Suivi de commande" },
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
    <footer className="mt-24 border-t border-[#e6d5a3] bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" aria-label="Laurie Coiffure — Accueil">
              <Image src="/laurie/logo.png" alt="Laurie Coiffure" width={395} height={351} className="h-16 w-auto" />
            </Link>
            <p className="mt-4 max-w-sm text-sm text-stone-600">
              Coiffure à domicile à Toulouse nord et alentours. Diplômée du Brevet Professionnel,
              spécialiste des coiffures de mariée, à votre écoute pour révéler votre style.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-stone-600">
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
                <Link href={settings.instagram} target="_blank" aria-label="Instagram" className="rounded-full border border-[#e6d5a3] p-2 hover:bg-[#c39c5112]">
                  <InstagramIcon className="size-4" />
                </Link>
              )}
              {settings.facebook && (
                <Link href={settings.facebook} target="_blank" aria-label="Facebook" className="rounded-full border border-[#e6d5a3] p-2 hover:bg-[#c39c5112]">
                  <FacebookIcon className="size-4" />
                </Link>
              )}
            </div>
          </div>

          {COLONNES.map((col) => (
            <div key={col.title}>
              <h3 className="font-heading text-sm tracking-wide text-stone-900">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-stone-600 hover:text-[#c39c51]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-[#e6d5a3] pt-8 sm:flex sm:items-center sm:justify-between">
          <div>
            <h3 className="font-heading text-sm tracking-wide">Newsletter</h3>
            <p className="mt-1 text-sm text-stone-600">
              -10% sur votre première commande en vous inscrivant.
            </p>
          </div>
          <NewsletterForm className="mt-4 sm:mt-0 sm:w-80" />
        </div>

        <p className="mt-10 text-center text-xs text-stone-600">
          © {new Date().getFullYear()} {env.NEXT_PUBLIC_SITE_NAME}. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
