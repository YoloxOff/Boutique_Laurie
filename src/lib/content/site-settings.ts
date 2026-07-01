import { sanityFetch } from "@/lib/sanity/client";
import { mockSiteSettings } from "@/lib/mock/content";

const QUERY = `*[_type == "siteSettings"][0]{ planityUrl, phone, email, address, hours, instagram, facebook, announcementBar }`;

export type SiteSettings = typeof mockSiteSettings & { announcementBar?: string };

export async function getSiteSettings(): Promise<SiteSettings> {
  const remote = await sanityFetch<SiteSettings>(QUERY);
  return remote ?? mockSiteSettings;
}

const LEGAL_QUERY = `*[_type == "legalPage" && key == $key][0]{ title, content }`;

export type LegalPageContent = { title: string; content: unknown };

const mockLegalPages: Record<string, LegalPageContent> = {
  cgv: { title: "Conditions Générales de Vente", content: null },
  "mentions-legales": { title: "Mentions légales", content: null },
  confidentialite: { title: "Politique de confidentialité", content: null },
  cookies: { title: "Politique de cookies", content: null },
};

export async function getLegalPage(key: keyof typeof mockLegalPages): Promise<LegalPageContent> {
  const remote = await sanityFetch<LegalPageContent>(LEGAL_QUERY, { key });
  return remote ?? mockLegalPages[key];
}
