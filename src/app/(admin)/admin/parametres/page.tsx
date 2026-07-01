import type { Metadata } from "next";
import { SiteSettingsForm } from "@/components/forms/site-settings-form";
import { LegalPageForm } from "@/components/forms/legal-page-form";
import { getSiteSettings, getLegalPage } from "@/lib/content/site-settings";
import { assertPagePermission } from "@/lib/admin/permissions";

export const metadata: Metadata = { title: "Admin — Paramètres" };

const LEGAL_PAGES = [
  { key: "cgv" as const, label: "CGV" },
  { key: "mentions-legales" as const, label: "Mentions légales" },
  { key: "confidentialite" as const, label: "Politique de confidentialité" },
  { key: "cookies" as const, label: "Politique de cookies" },
];

export default async function AdminParametresPage() {
  await assertPagePermission("settings");

  const [settings, ...legalPages] = await Promise.all([
    getSiteSettings(),
    ...LEGAL_PAGES.map((p) => getLegalPage(p.key)),
  ]);

  return (
    <div>
      <h1 className="font-heading text-2xl">Paramètres du site</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Coordonnées, réseaux sociaux, horaires et pages légales — modifiables ici sans toucher au
        code.
      </p>

      <div className="mt-8">
        <SiteSettingsForm settings={settings} />
      </div>

      <div className="mt-12">
        <h2 className="font-heading text-lg">Pages légales</h2>
        <div className="mt-4 space-y-8">
          {LEGAL_PAGES.map((p, i) => (
            <div key={p.key} className="rounded-xl border border-border p-4">
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">{p.label}</h3>
              <LegalPageForm
                pageKey={p.key}
                title={legalPages[i].title}
                content={typeof legalPages[i].content === "string" ? (legalPages[i].content as string) : ""}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
