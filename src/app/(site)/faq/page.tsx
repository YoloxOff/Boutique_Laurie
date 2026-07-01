import type { Metadata } from "next";
import { SectionHeading } from "@/components/sections/section-heading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { jsonLdFaqPage } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Questions fréquentes sur les prestations, la boutique, la livraison et les rendez-vous chez Laurie Coiffure.",
};

const FAQ = [
  {
    question: "Comment prendre rendez-vous ?",
    answer: "Cliquez sur le bouton « Prendre rendez-vous » présent sur chaque page du site, vous serez redirigé vers notre plateforme de réservation Planity.",
  },
  {
    question: "Proposez-vous le Click & Collect ?",
    answer: "Oui, vous pouvez retirer gratuitement votre commande directement au salon sous 24 à 48h.",
  },
  {
    question: "Quels sont les délais de livraison ?",
    answer: "Comptez 2 à 4 jours ouvrés pour une livraison à domicile (Colissimo) ou en point relais (Mondial Relay).",
  },
  {
    question: "Puis-je retourner un produit ?",
    answer: "Oui, sous 14 jours à compter de la réception, produit non ouvert. Consultez nos CGV pour le détail de la procédure.",
  },
  {
    question: "Les cartes cadeaux sont-elles valables sur les prestations et la boutique ?",
    answer: "Oui, nos cartes cadeaux sont utilisables aussi bien sur les prestations en salon que sur la boutique en ligne.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaqPage(FAQ)) }}
      />
      <SectionHeading eyebrow="Besoin d'aide ?" title="Questions fréquentes" />
      <Accordion className="mt-10">
        {FAQ.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
