import type { Metadata } from "next";
import { getLegalPage } from "@/lib/content/site-settings";

export const metadata: Metadata = { title: "Conditions Générales de Vente" };

export default async function CgvPage() {
  const page = await getLegalPage("cgv");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl">{page.title}</h1>
      <div className="prose prose-neutral mt-8 max-w-none text-sm text-muted-foreground">
        <p>
          Les présentes conditions générales de vente régissent les ventes de produits réalisées
          sur le site {"laurie-coiffure.fr"}. Contenu à finaliser avec l&apos;équipe juridique du
          salon avant mise en production (moyens de paiement, délais de rétractation, garanties,
          litiges).
        </p>
        <h2>Produits et prix</h2>
        <p>Les prix sont indiqués en euros toutes taxes comprises.</p>
        <h2>Livraison</h2>
        <p>Click &amp; Collect, Mondial Relay et Colissimo selon le mode choisi à la commande.</p>
        <h2>Droit de rétractation</h2>
        <p>Délai légal de 14 jours à compter de la réception, produit non ouvert.</p>
      </div>
    </div>
  );
}
