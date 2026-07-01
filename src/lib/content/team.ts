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
    "Je m'appelle Laurie. Passionnée par la coiffure depuis mes 16 ans, je suis basée à Saint-Jean et je propose mes services de coiffure à domicile à Toulouse et dans sa périphérie. J'ai d'abord travaillé dans plusieurs grands salons de coiffure avant de me lancer dans la belle aventure de l'entrepreneuriat. Diplômée du Brevet Professionnel depuis 2012, je mets mon expertise à votre service pour vous conseiller et vous sublimer, tout en restant à l'écoute de vos envies.",
  values: ["Écoute et conseil personnalisé", "Visagisme et colorimétrie", "Formation continue aux nouvelles tendances", "Service à domicile ponctuel et soigné"],
  photos: [
    "/laurie/la-mariee.jpg",
    "/laurie/deplome.jpg",
    "/laurie/demoiselles-dhonneurs-.jpg",
  ],
};

export async function getSalonPage(): Promise<SalonPageContent> {
  const remote = await sanityFetch<SalonPageContent>(SALON_QUERY);
  return remote ?? mockSalonPage;
}
