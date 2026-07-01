import type { Metadata } from "next";
import { getLegalPage } from "@/lib/content/site-settings";

export const metadata: Metadata = { title: "Politique de confidentialité" };

export default async function ConfidentialitePage() {
  const page = await getLegalPage("confidentialite");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl">{page.title}</h1>
      <div className="prose prose-neutral mt-8 max-w-none text-sm text-muted-foreground">
        {typeof page.content === "string" && page.content ? (
          <div className="whitespace-pre-wrap">{page.content}</div>
        ) : (
          <>
            <p>
              Laurie Coiffure collecte et traite des données personnelles (identité, contact,
              historique de commande) dans le cadre de la gestion de la relation client et des
              ventes en ligne, conformément au RGPD.
            </p>
            <h2>Données collectées</h2>
            <p>Nom, email, adresse de livraison/facturation, historique de commandes, préférences.</p>
            <h2>Vos droits</h2>
            <p>
              Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement et de
              portabilité de vos données. Pour exercer ces droits, contactez-nous via la page{" "}
              <a href="/#contact" className="underline">
                Contact
              </a>
              .
            </p>
          </>
        )}
      </div>
    </div>
  );
}
