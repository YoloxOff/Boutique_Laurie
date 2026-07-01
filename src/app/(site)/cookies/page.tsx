import type { Metadata } from "next";
import { getLegalPage } from "@/lib/content/site-settings";

export const metadata: Metadata = { title: "Politique de cookies" };

export default async function CookiesPage() {
  const page = await getLegalPage("cookies");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl">{page.title}</h1>
      <div className="prose prose-neutral mt-8 max-w-none text-sm text-muted-foreground">
        {typeof page.content === "string" && page.content ? (
          <div className="whitespace-pre-wrap">{page.content}</div>
        ) : (
          <>
            <p>Ce site utilise trois catégories de cookies, configurables via le bandeau de consentement :</p>
            <ul>
              <li><strong>Nécessaires</strong> — panier, session, authentification (toujours actifs).</li>
              <li><strong>Mesure d&apos;audience</strong> — Google Analytics, Google Tag Manager.</li>
              <li><strong>Marketing</strong> — Meta Pixel.</li>
            </ul>
            <p>Vous pouvez modifier vos préférences à tout moment en effaçant vos cookies de navigation.</p>
          </>
        )}
      </div>
    </div>
  );
}
