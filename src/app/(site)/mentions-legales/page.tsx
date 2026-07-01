import type { Metadata } from "next";
import { getLegalPage, getSiteSettings } from "@/lib/content/site-settings";

export const metadata: Metadata = { title: "Mentions légales" };

export default async function MentionsLegalesPage() {
  const [page, settings] = await Promise.all([getLegalPage("mentions-legales"), getSiteSettings()]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl">{page.title}</h1>
      <div className="prose prose-neutral mt-8 max-w-none text-sm text-muted-foreground">
        {typeof page.content === "string" && page.content ? (
          <div className="whitespace-pre-wrap">{page.content}</div>
        ) : (
          <>
            <p>Éditeur du site : Laurie Coiffure — {settings.address}</p>
            <p>Contact : {settings.email} — {settings.phone}</p>
            <p>
              Contenu à compléter avec les informations légales définitives (SIRET, forme
              juridique, capital social, hébergeur, directeur de publication) — modifiable depuis
              l&apos;admin (Paramètres).
            </p>
          </>
        )}
      </div>
    </div>
  );
}
