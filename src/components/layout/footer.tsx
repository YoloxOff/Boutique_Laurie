import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Mail, Phone } from "lucide-react";
import { BoutonRdv } from "./bouton-rdv";
import { FacebookIcon, InstagramIcon, WhatsappIcon } from "@/components/icons/social-icons";
import { getSiteSettings } from "@/lib/content/site-settings";
import { toWhatsAppUrl } from "@/lib/utils";
import { env } from "@/env";

const MENU_LINKS = [
  { href: "/#home", label: "Accueil" },
  { href: "/#pricing", label: "Tarifs" },
  { href: "/#marriage", label: "Mariage" },
  { href: "/#products", label: "Réalisations" },
  { href: "/boutique", label: "Boutique" },
  { href: "/#contact", label: "Contact" },
];

export async function Footer() {
  const settings = await getSiteSettings();
  const whatsappUrl = toWhatsAppUrl(settings.phone);

  return (
    <footer className="relative w-full border-t border-[#e6d5a3] bg-stone-50 text-stone-800">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <Link href="/#home" aria-label="Laurie Coiffure — Accueil">
              <Image src="/laurie/logo.png" alt="Laurie Coiffure" width={395} height={351} className="h-16 w-auto" />
            </Link>
            <p className="text-sm">Coiffure à domicile – Toulouse nord et alentours</p>
            <div className="flex flex-wrap items-center gap-1">
              <Link
                href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                aria-label="Téléphone"
                className="rounded-md p-2 transition-colors hover:bg-[#c39c5112]"
              >
                <Phone className="size-5 text-[#c39c51]" />
              </Link>
              <Link
                href={`mailto:${settings.email}`}
                aria-label="Email"
                className="rounded-md p-2 transition-colors hover:bg-[#c39c5112]"
              >
                <Mail className="size-5 text-[#c39c51]" />
              </Link>
              {settings.instagram && (
                <Link
                  href={settings.instagram}
                  target="_blank"
                  aria-label="Instagram"
                  className="rounded-md p-2 transition-colors hover:bg-[#c39c5112]"
                >
                  <InstagramIcon className="size-5 text-[#c39c51]" />
                </Link>
              )}
              {settings.facebook && (
                <Link
                  href={settings.facebook}
                  target="_blank"
                  aria-label="Facebook"
                  className="rounded-md p-2 transition-colors hover:bg-[#c39c5112]"
                >
                  <FacebookIcon className="size-5 text-[#c39c51]" />
                </Link>
              )}
              {whatsappUrl && (
                <Link
                  href={whatsappUrl}
                  target="_blank"
                  aria-label="WhatsApp"
                  className="rounded-md p-2 transition-colors hover:bg-[#c39c5112]"
                >
                  <WhatsappIcon className="size-5 text-[#c39c51]" />
                </Link>
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#c39c51]">Menu</h3>
            <nav className="space-y-2">
              {MENU_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center text-sm text-stone-700 transition-all hover:pl-2 hover:text-[#c39c51]"
                >
                  <ChevronRight className="mr-2 size-3" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#c39c51]">Rendez-vous</h3>
            <p className="mb-4 text-sm text-stone-600">
              Envie d&apos;une nouvelle coupe ou d&apos;un chignon mariage ? Parlons-en.
            </p>
            <div className="flex flex-wrap gap-3">
              <BoutonRdv />
              <Link
                href="/#pricing"
                className="inline-flex items-center justify-center rounded-md border border-[#e6d5a3] px-6 py-2.5 text-sm font-semibold text-stone-800 shadow-sm transition-all hover:bg-[#c39c5112]"
              >
                Voir les tarifs
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#e6d5a3] py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <p className="text-center text-xs text-stone-600">
            © {new Date().getFullYear()} {env.NEXT_PUBLIC_SITE_NAME}. Tous droits réservés.
          </p>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#c39c51] via-[#e6d5a3] to-[#c39c51]" />
    </footer>
  );
}
