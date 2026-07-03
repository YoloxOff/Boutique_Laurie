export type MockService = {
  slug: string;
  name: string;
  category: "femme" | "homme" | "enfant" | "mariage";
  subCategory?: "forfaits" | "a-la-carte";
  description: string;
  benefits: string[];
  duration: string;
  price: string;
  image: string;
  faq: { question: string; answer: string }[];
};

const femmeImage = "/laurie/forfaits-femmes-coupes-couleurs-meches-ombres-brushings.jpg";
const hommeImage = "/laurie/coupes-hommes.jpg";
const enfantImage = "/laurie/coupes-bebes-enfants-adolescents.jpg";
const mariageImage = "/laurie/la-mariee.jpg";
const demoisellesImage = "/laurie/demoiselles-dhonneurs-.jpg";

export const mockServices: MockService[] = [
  // --- Femme : forfaits (shampooing offert) ---
  {
    slug: "brushing",
    name: "Brushing",
    category: "femme",
    subCategory: "forfaits",
    description: "Brushing shampooing offert. Tarif cheveux courts : 20 €, cheveux longs : 25 €.",
    benefits: ["Shampooing offert", "Cheveux courts : 20 €", "Cheveux longs : 25 €"],
    duration: "Sur rendez-vous",
    price: "20 € / 25 €",
    image: femmeImage,
    faq: [],
  },
  {
    slug: "coupe-brushing",
    name: "Coupe, brushing",
    category: "femme",
    subCategory: "forfaits",
    description: "Coupe et brushing, shampooing offert. Tarif cheveux courts : 28 €, cheveux longs : 38 €.",
    benefits: ["Shampooing offert", "Cheveux courts : 28 €", "Cheveux longs : 38 €"],
    duration: "Sur rendez-vous",
    price: "28 € / 38 €",
    image: femmeImage,
    faq: [],
  },
  {
    slug: "couleur-coupe-brushing",
    name: "Couleur, coupe, brushing",
    category: "femme",
    subCategory: "forfaits",
    description: "Couleur racine, coupe et brushing, shampooing offert. Tarif cheveux courts : 55 €, cheveux longs : 65 €.",
    benefits: ["Shampooing offert", "Cheveux courts : 55 €", "Cheveux longs : 65 €"],
    duration: "Sur rendez-vous",
    price: "55 € / 65 €",
    image: femmeImage,
    faq: [],
  },
  {
    slug: "balayage-coupe-brushing",
    name: "Balayage, coupe, brushing",
    category: "femme",
    subCategory: "forfaits",
    description: "Balayage, coupe et brushing, shampooing offert. Tarif cheveux courts : 60 €, cheveux longs : 70 €.",
    benefits: ["Shampooing offert", "Cheveux courts : 60 €", "Cheveux longs : 70 €"],
    duration: "Sur rendez-vous",
    price: "60 € / 70 €",
    image: femmeImage,
    faq: [],
  },
  {
    slug: "meches-coupe-brushing",
    name: "Mèches, coupe, brushing",
    category: "femme",
    subCategory: "forfaits",
    description: "Mèches, coupe et brushing, shampooing offert. Tarif cheveux courts : 70 €, cheveux longs : 82 €.",
    benefits: ["Shampooing offert", "Cheveux courts : 70 €", "Cheveux longs : 82 €"],
    duration: "Sur rendez-vous",
    price: "70 € / 82 €",
    image: femmeImage,
    faq: [],
  },
  {
    slug: "lissage-bresilien",
    name: "Lissage brésilien",
    category: "femme",
    subCategory: "forfaits",
    description: "Lissage brésilien, racine 2 cm. Tarif selon longueur : 150 €, 190 € ou 250 €.",
    benefits: ["Racine 2 cm", "Selon longueur des cheveux"],
    duration: "Sur rendez-vous",
    price: "150 € / 190 € / 250 €",
    image: femmeImage,
    faq: [],
  },
  // --- Femme : à la carte ---
  {
    slug: "shampooing",
    name: "Shampooing",
    category: "femme",
    subCategory: "a-la-carte",
    description: "Shampooing seul, à la carte.",
    benefits: [],
    duration: "Sur rendez-vous",
    price: "4 €",
    image: femmeImage,
    faq: [],
  },
  {
    slug: "soin",
    name: "Soin",
    category: "femme",
    subCategory: "a-la-carte",
    description: "Soin capillaire, à la carte.",
    benefits: [],
    duration: "Sur rendez-vous",
    price: "7 €",
    image: femmeImage,
    faq: [],
  },
  {
    slug: "coupe-femme",
    name: "Coupe femme",
    category: "femme",
    subCategory: "a-la-carte",
    description: "Coupe femme seule, à la carte.",
    benefits: [],
    duration: "Sur rendez-vous",
    price: "20 €",
    image: femmeImage,
    faq: [],
  },
  {
    slug: "couleur-racine",
    name: "Couleur (racine)",
    category: "femme",
    subCategory: "a-la-carte",
    description: "Couleur racine, à la carte.",
    benefits: [],
    duration: "Sur rendez-vous",
    price: "30 €",
    image: femmeImage,
    faq: [],
  },
  {
    slug: "balayage",
    name: "Balayage",
    category: "femme",
    subCategory: "a-la-carte",
    description: "Balayage seul, à la carte.",
    benefits: [],
    duration: "Sur rendez-vous",
    price: "35 €",
    image: femmeImage,
    faq: [],
  },
  {
    slug: "ombre",
    name: "Ombré",
    category: "femme",
    subCategory: "a-la-carte",
    description: "Ombré hair, à la carte.",
    benefits: [],
    duration: "Sur rendez-vous",
    price: "À partir de 50 €",
    image: femmeImage,
    faq: [],
  },
  {
    slug: "meches",
    name: "Mèches",
    category: "femme",
    subCategory: "a-la-carte",
    description: "Mèches seules, à la carte.",
    benefits: [],
    duration: "Sur rendez-vous",
    price: "40 €",
    image: femmeImage,
    faq: [],
  },
  {
    slug: "patine",
    name: "Patine",
    category: "femme",
    subCategory: "a-la-carte",
    description: "Patine, à la carte.",
    benefits: [],
    duration: "Sur rendez-vous",
    price: "12 €",
    image: femmeImage,
    faq: [],
  },
  {
    slug: "supplement-technique",
    name: "Supplément technique",
    category: "femme",
    subCategory: "a-la-carte",
    description: "Supplément technique selon la prestation.",
    benefits: [],
    duration: "Sur rendez-vous",
    price: "À partir de 10 €",
    image: femmeImage,
    faq: [],
  },
  {
    slug: "coiffure-de-soiree",
    name: "Coiffure de soirée, attaché…",
    category: "femme",
    subCategory: "a-la-carte",
    description: "Coiffure de soirée, chignon attaché ou coiffure événementielle.",
    benefits: [],
    duration: "Sur rendez-vous",
    price: "À partir de 40 €",
    image: femmeImage,
    faq: [],
  },
  // --- Homme ---
  {
    slug: "coupe-coiffage",
    name: "Coupe coiffage",
    category: "homme",
    description: "Coupe et coiffage homme.",
    benefits: [],
    duration: "Sur rendez-vous",
    price: "20 €",
    image: hommeImage,
    faq: [],
  },
  {
    slug: "coupe-coiffage-pause",
    name: "Coupe coiffage pendant un temps de pause",
    category: "homme",
    description: "Coupe et coiffage homme, formule rapide pendant un temps de pause.",
    benefits: [],
    duration: "Sur rendez-vous",
    price: "15 €",
    image: hommeImage,
    faq: [],
  },
  {
    slug: "taille-de-barbe",
    name: "Taille de barbe",
    category: "homme",
    description: "Taille de barbe soignée.",
    benefits: [],
    duration: "Sur rendez-vous",
    price: "5 €",
    image: hommeImage,
    faq: [],
  },
  // --- Enfant ---
  {
    slug: "coupe-bebe",
    name: "Coupe bébé jusqu'à 3 ans",
    category: "enfant",
    description: "Coupe adaptée aux bébés jusqu'à 3 ans, dans un cadre rassurant.",
    benefits: [],
    duration: "Sur rendez-vous",
    price: "8 €",
    image: enfantImage,
    faq: [],
  },
  {
    slug: "coupe-enfant",
    name: "Coupe enfant fille/garçon jusqu'à 10 ans",
    category: "enfant",
    description: "Coupe enfant fille ou garçon jusqu'à 10 ans.",
    benefits: [],
    duration: "Sur rendez-vous",
    price: "15 €",
    image: enfantImage,
    faq: [],
  },
  {
    slug: "coupe-adolescent-garcon",
    name: "Coupe adolescent garçon",
    category: "enfant",
    description: "Coupe adaptée aux adolescents garçons.",
    benefits: [],
    duration: "Sur rendez-vous",
    price: "17 €",
    image: enfantImage,
    faq: [],
  },
  {
    slug: "coupe-adolescent-fille",
    name: "Coupe adolescent fille",
    category: "enfant",
    description: "Coupe adaptée aux adolescentes.",
    benefits: [],
    duration: "Sur rendez-vous",
    price: "19 €",
    image: enfantImage,
    faq: [],
  },
  // --- Mariage ---
  {
    slug: "formule-mariee",
    name: "Formule mariée",
    category: "mariage",
    description:
      "Un premier rendez-vous pour faire connaissance et discuter de vos envies, un essai coiffure, puis le jour J la coiffure sublimée avec toutes les finitions nécessaires (brillance, tenue, élégance) et la pose du voile si besoin. Formule à partir de 180 €, en fonction du lieu de la prestation.",
    benefits: [
      "Premier rendez-vous inclus",
      "Essai coiffure inclus (2ᵉ essai possible à partir de 30 €)",
      "Pose du voile et technique d'accroche pour les témoins",
      "Devis selon le lieu de la prestation",
    ],
    duration: "Sur rendez-vous",
    price: "À partir de 180 €",
    image: mariageImage,
    faq: [],
  },
  {
    slug: "invites-mariage",
    name: "Demoiselles d'honneur et invités",
    category: "mariage",
    description:
      "Coiffures harmonieuses et assorties au thème du mariage pour les témoins, demoiselles d'honneur et invités — y compris les enfants (coiffure de princesse ou de prince). Un devis global est automatiquement proposé selon le nombre de personnes à coiffer.",
    benefits: ["Cheveux courts : 40 €", "Cheveux longs : 50 €", "Devis global sur demande"],
    duration: "Sur rendez-vous",
    price: "40 € / 50 €",
    image: demoisellesImage,
    faq: [],
  },
];

export type MockGalleryItem = { id: string; type: "photo" | "avant-apres" | "video"; category: string; image: string; imageAfter?: string; title: string };

const marriageGalleryCount = 28;
const quotidienGalleryCount = 11;
const marriageExtensions: Record<number, string> = { 8: "jpeg", 11: "jpeg", 12: "jpeg", 13: "jpeg", 15: "jpeg", 16: "jpeg", 17: "jpeg", 18: "jpeg", 19: "jpeg", 20: "jpeg", 21: "jpeg", 22: "jpeg", 25: "jpeg", 26: "jpeg", 27: "jpeg", 28: "png" };

export const mockGallery: MockGalleryItem[] = [
  ...Array.from({ length: marriageGalleryCount }, (_, i) => {
    const n = i + 1;
    const ext = marriageExtensions[n] ?? "jpg";
    return {
      id: `mariage-${n}`,
      type: "photo" as const,
      category: "Mariage",
      image: `/laurie/marriage/marriage${n}.${ext}`,
      title: `Réalisation ${n}`,
    };
  }),
  ...Array.from({ length: quotidienGalleryCount }, (_, i) => {
    const n = i + 1;
    return {
      id: `quotidien-${n}`,
      type: "photo" as const,
      category: "Quotidien",
      image: `/laurie/quotidien/${n}.jpeg`,
      title: `Réalisation ${n}`,
    };
  }),
];

export const mockSiteSettings = {
  planityUrl: "http://fleeky.fr/laurie",
  phone: "06 84 97 21 77",
  email: "laurie.guiraud@orange.fr",
  address: "Saint-Jean (Toulouse) — coiffure à domicile, secteur L'Union, Castelmaurou, Rouffiac-Tolosan, Beaupuy, Montrabé",
  hours: [{ day: "Tous les jours", hours: "Sur rendez-vous" }],
  instagram: "https://www.instagram.com/laurie.coiffeusedomicile",
  facebook: "https://www.facebook.com/laurieCoiffeuse31",
};

