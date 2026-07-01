import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { getSiteSettings } from "@/lib/content/site-settings";

export async function ContactSection() {
  const settings = await getSiteSettings();
  const whatsappHref = `https://wa.me/${settings.phone.replace(/\s/g, "").replace(/^0/, "+33")}`;

  return (
    <section id="contact" className="relative w-full bg-stone-50">
      <div className="px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-3xl font-bold text-[#c39c51] sm:text-4xl lg:text-5xl">Contact</h2>

          <div className="mb-8 max-w-3xl space-y-1 text-base text-stone-700 sm:text-lg">
            <p>
              Vous souhaitez prendre rendez-vous, poser une question ou simplement vous renseigner ?
              Je suis à votre écoute : remplissez le formulaire ci-dessous ou envoyez-moi un sms.
            </p>
            <p>Je vous répondrai dans les meilleurs délais.</p>
          </div>

          <div className="mb-8 rounded-2xl border border-[#e6d5a3] bg-[#fff8ea] p-5">
            <h3 className="mb-2 font-serif text-xl text-[#c39c51] sm:text-2xl">Secteur d&apos;intervention</h3>
            <p className="text-sm text-stone-800 sm:text-base">{settings.address}.</p>
            <p className="mt-2 text-sm text-stone-800 sm:text-base">
              Pour les mariages et prestations événementielles, je me déplace également dans un rayon
              plus large en fonction du lieu choisi.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#e6d5a3] bg-white p-6 shadow-sm sm:p-8">
              <div className="space-y-6">
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="flex items-center gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#c39c51]">
                    <Phone className="size-6 text-white" />
                  </span>
                  <span className="text-lg font-semibold text-stone-900">{settings.phone}</span>
                </a>
                <a href={`mailto:${settings.email}`} className="flex items-center gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#c39c51]">
                    <Mail className="size-6 text-white" />
                  </span>
                  <span className="text-lg font-semibold text-stone-900">{settings.email}</span>
                </a>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#c39c51]">
                    <MessageCircle className="size-6 text-white" />
                  </span>
                  <span className="text-lg font-semibold text-stone-900">WhatsApp</span>
                </a>
                <Link
                  href={settings.planityUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md bg-[#c39c51] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#b8923a]"
                >
                  Réserver sur Fleeky
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-[#e6d5a3] bg-white p-6 shadow-sm sm:p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
