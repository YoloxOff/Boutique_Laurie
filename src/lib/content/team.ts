import { sanityFetch } from "@/lib/sanity/client";
import { mockTeam, type MockTeamMember } from "@/lib/mock/content";

const QUERY = `*[_type == "teamMember"] | order(position asc){ name, role, bio, "photo": photo.asset->url }`;

export async function getTeam(): Promise<MockTeamMember[]> {
  const remote = await sanityFetch<MockTeamMember[]>(QUERY);
  return remote && remote.length ? remote : mockTeam;
}

const SALON_QUERY = `*[_type == "salonPage"][0]{ history, values, "photos": photos[].asset->url, virtualTourUrl }`;

export type SalonPageContent = {
  history: string;
  values: string[];
  photos: string[];
  virtualTourUrl?: string;
};

const mockSalonPage: SalonPageContent = {
  history:
    "Fondé par Laurie il y a plus de 10 ans, le salon Laurie Coiffure est né d'une passion pour la coloration et le conseil personnalisé. Aujourd'hui, une équipe de spécialistes vous accueille dans un cadre pensé pour votre bien-être.",
  values: ["Excellence technique", "Écoute et conseil personnalisé", "Produits professionnels haut de gamme", "Bien-être et convivialité"],
  photos: [
    "https://picsum.photos/seed/salon-int1/1200/900",
    "https://picsum.photos/seed/salon-int2/1200/900",
    "https://picsum.photos/seed/salon-int3/1200/900",
  ],
};

export async function getSalonPage(): Promise<SalonPageContent> {
  const remote = await sanityFetch<SalonPageContent>(SALON_QUERY);
  return remote ?? mockSalonPage;
}
