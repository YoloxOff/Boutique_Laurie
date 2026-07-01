import { eq } from "drizzle-orm";
import { sanityFetch } from "@/lib/sanity/client";
import { mockSiteSettings } from "@/lib/mock/content";
import { db, isDatabaseConfigured } from "@/db";
import { siteSettingsRow, legalPagesRow } from "@/db/schema";

const QUERY = `*[_type == "siteSettings"][0]{ planityUrl, phone, email, address, hours, instagram, facebook, announcementBar }`;

export type SiteSettings = typeof mockSiteSettings & {
  announcementBar?: string;
  metaTitle?: string;
  metaDescription?: string;
};

export async function getSiteSettings(): Promise<SiteSettings> {
  if (isDatabaseConfigured) {
    const row = await db.query.siteSettingsRow.findFirst({ where: eq(siteSettingsRow.id, "singleton") });
    if (row) {
      return {
        planityUrl: row.bookingUrl || mockSiteSettings.planityUrl,
        phone: row.phone || mockSiteSettings.phone,
        email: row.email || mockSiteSettings.email,
        address: row.address || mockSiteSettings.address,
        hours: row.hours.length ? row.hours : mockSiteSettings.hours,
        instagram: row.instagram || mockSiteSettings.instagram,
        facebook: row.facebook || mockSiteSettings.facebook,
        announcementBar: row.announcementBar ?? undefined,
        metaTitle: row.metaTitle ?? undefined,
        metaDescription: row.metaDescription ?? undefined,
      };
    }
  }

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
  if (isDatabaseConfigured) {
    const row = await db.query.legalPagesRow.findFirst({ where: eq(legalPagesRow.key, key) });
    if (row && row.content) return { title: row.title, content: row.content };
  }

  const remote = await sanityFetch<LegalPageContent>(LEGAL_QUERY, { key });
  return remote ?? mockLegalPages[key];
}
