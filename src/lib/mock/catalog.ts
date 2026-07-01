export type MockBrand = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string;
  tagline: string;
};

export type MockCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
};

export type MockVariant = {
  id: string;
  label: string;
  sku: string;
  priceOverride: number | null;
  stockQuantity: number;
};

export type MockReview = {
  id: string;
  authorName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
};

export type MockProduct = {
  id: string;
  sku: string;
  slug: string;
  name: string;
  brandSlug: string;
  categorySlug: string;
  shortDescription: string;
  description: string;
  usageAdvice: string;
  ingredients: string;
  hairTypes: string[];
  objectives: string[];
  basePrice: number;
  compareAtPrice: number | null;
  images: { url: string; alt: string }[];
  variants: MockVariant[];
  reviews: MockReview[];
  complementSlugs: string[];
};

export const mockBrands: MockBrand[] = [
  {
    id: "brand-loreal",
    slug: "loreal-professionnel",
    name: "L'Oréal Professionnel",
    logoUrl: "/images/brands/loreal.svg",
    tagline: "L'expertise coloration et soin des plus grands salons.",
  },
  {
    id: "brand-kerastase",
    slug: "kerastase",
    name: "Kérastase",
    logoUrl: "/images/brands/kerastase.svg",
    tagline: "Le soin de luxe sur-mesure pour chaque type de cheveux.",
  },
  {
    id: "brand-ghd",
    slug: "ghd",
    name: "GHD",
    logoUrl: "/images/brands/ghd.svg",
    tagline: "La référence du coiffage professionnel haute performance.",
  },
  {
    id: "brand-redken",
    slug: "redken",
    name: "Redken",
    logoUrl: "/images/brands/redken.svg",
    tagline: "Science capillaire et résultats visibles dès la 1ère utilisation.",
  },
];

export const mockCategories: MockCategory[] = [
  { id: "cat-shampoings", slug: "shampoings", name: "Shampoings", description: "Nettoient et préparent la fibre capillaire en douceur." },
  { id: "cat-apres-shampoings", slug: "apres-shampoings", name: "Après-shampoings", description: "Démêlent, nourrissent et subliment la brillance." },
  { id: "cat-masques", slug: "masques", name: "Masques", description: "Soins intensifs pour une réparation en profondeur." },
  { id: "cat-soins", slug: "soins", name: "Soins", description: "Rituels ciblés pour chaque besoin capillaire." },
  { id: "cat-huiles", slug: "huiles", name: "Huiles", description: "Nutrition et brillance sublimées." },
  { id: "cat-protecteurs-chaleur", slug: "protecteurs-chaleur", name: "Protecteurs chaleur", description: "Protection thermique avant coiffage." },
  { id: "cat-produits-coiffants", slug: "produits-coiffants", name: "Produits coiffants", description: "Tenue, texture et finition professionnelle." },
  { id: "cat-accessoires", slug: "accessoires", name: "Accessoires", description: "Brosses, peignes et outils de coiffage premium." },
  { id: "cat-cartes-cadeaux", slug: "cartes-cadeaux", name: "Cartes cadeaux", description: "Offrez une expérience signature Laurie Coiffure." },
];

const image = (seed: string, alt: string) => ({
  url: `https://picsum.photos/seed/${seed}/900/1100`,
  alt,
});

export const mockProducts: MockProduct[] = [
  {
    id: "prod-shampoing-chroma",
    sku: "LC-SH-001",
    slug: "shampoing-chroma-riche-loreal",
    name: "Shampoing Chroma Riche",
    brandSlug: "loreal-professionnel",
    categorySlug: "shampoings",
    shortDescription: "Shampoing sublimateur de couleur pour cheveux colorés.",
    description:
      "Le Shampoing Chroma Riche nettoie en douceur tout en préservant l'intensité et la brillance de votre couleur. Sa formule enrichie en pigments neutralisants respecte la fibre capillaire colorée.",
    usageAdvice:
      "Appliquer sur cheveux mouillés, faire mousser, laisser poser 2 minutes puis rincer abondamment. Utiliser 2 à 3 fois par semaine.",
    ingredients: "Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Glycerin, Parfum.",
    hairTypes: ["Colorés", "Sensibilisés"],
    objectives: ["Éclat couleur", "Douceur"],
    basePrice: 19.9,
    compareAtPrice: null,
    images: [image("chroma1", "Shampoing Chroma Riche L'Oréal Professionnel"), image("chroma2", "Texture du Shampoing Chroma Riche")],
    variants: [
      { id: "var-chroma-250", label: "250 ml", sku: "LC-SH-001-250", priceOverride: null, stockQuantity: 34 },
      { id: "var-chroma-500", label: "500 ml", sku: "LC-SH-001-500", priceOverride: 32.9, stockQuantity: 18 },
    ],
    reviews: [
      { id: "rev-1", authorName: "Camille D.", rating: 5, title: "Couleur préservée", comment: "Ma couleur tient beaucoup plus longtemps depuis que je l'utilise.", createdAt: "2026-05-12" },
    ],
    complementSlugs: ["masque-chroma-riche-loreal", "huile-magique-kerastase"],
  },
  {
    id: "prod-masque-chroma",
    sku: "LC-MA-002",
    slug: "masque-chroma-riche-loreal",
    name: "Masque Chroma Riche",
    brandSlug: "loreal-professionnel",
    categorySlug: "masques",
    shortDescription: "Masque nourrissant sublimateur de couleur.",
    description:
      "Un soin concentré qui nourrit intensément les cheveux colorés tout en ravivant leur éclat. Texture riche et fondante pour un résultat immédiat.",
    usageAdvice: "Appliquer sur cheveux essorés, longueurs et pointes, laisser poser 5 minutes puis rincer.",
    ingredients: "Aqua, Cetearyl Alcohol, Behentrimonium Chloride, Parfum.",
    hairTypes: ["Colorés", "Secs"],
    objectives: ["Nutrition", "Éclat couleur"],
    basePrice: 24.5,
    compareAtPrice: 28,
    images: [image("masque1", "Masque Chroma Riche L'Oréal Professionnel")],
    variants: [{ id: "var-masque-250", label: "250 ml", sku: "LC-MA-002-250", priceOverride: null, stockQuantity: 22 }],
    reviews: [],
    complementSlugs: ["shampoing-chroma-riche-loreal"],
  },
  {
    id: "prod-huile-kerastase",
    sku: "LC-HU-003",
    slug: "huile-magique-kerastase",
    name: "Huile Magique Elixir Ultime",
    brandSlug: "kerastase",
    categorySlug: "huiles",
    shortDescription: "Huile sublimatrice universelle, 8 huiles précieuses.",
    description:
      "L'Elixir Ultime révèle la beauté naturelle de chaque type de cheveux grâce à un mélange de 8 huiles précieuses. Nourrit, discipline et sublime la brillance sans effet gras.",
    usageAdvice: "Appliquer 1 à 3 pressions sur cheveux secs ou humides, sur longueurs et pointes.",
    ingredients: "Cyclopentasiloxane, Argania Spinosa Kernel Oil, Camellia Oleifera Seed Oil.",
    hairTypes: ["Tous types"],
    objectives: ["Brillance", "Discipline"],
    basePrice: 39,
    compareAtPrice: null,
    images: [image("huile1", "Huile Magique Elixir Ultime Kérastase")],
    variants: [
      { id: "var-huile-30", label: "30 ml", sku: "LC-HU-003-30", priceOverride: null, stockQuantity: 45 },
      { id: "var-huile-100", label: "100 ml", sku: "LC-HU-003-100", priceOverride: 79, stockQuantity: 12 },
    ],
    reviews: [
      { id: "rev-2", authorName: "Sophie M.", rating: 5, title: "Sublime", comment: "Un parfum incroyable et des cheveux brillants immédiatement.", createdAt: "2026-06-02" },
    ],
    complementSlugs: ["shampoing-chroma-riche-loreal"],
  },
  {
    id: "prod-fer-ghd",
    sku: "LC-AC-004",
    slug: "lisseur-platinum-plus-ghd",
    name: "Lisseur Platinum+ ",
    brandSlug: "ghd",
    categorySlug: "accessoires",
    shortDescription: "Lisseur intelligent à prédiction de température.",
    description:
      "Le GHD Platinum+ ajuste automatiquement sa température jusqu'à 250 fois par seconde pour un résultat professionnel avec un minimum de passages, réduisant la casse.",
    usageAdvice: "Utiliser sur cheveux secs, mèches fines, en un seul passage lent.",
    ingredients: "-",
    hairTypes: ["Tous types"],
    objectives: ["Lissage", "Protection thermique"],
    basePrice: 219,
    compareAtPrice: 249,
    images: [image("ghd1", "Lisseur Platinum+ GHD")],
    variants: [{ id: "var-ghd-1", label: "Unique", sku: "LC-AC-004-U", priceOverride: null, stockQuantity: 9 }],
    reviews: [],
    complementSlugs: [],
  },
  {
    id: "prod-spray-redken",
    sku: "LC-PC-005",
    slug: "spray-protecteur-thermique-redken",
    name: "Spray Protecteur Thermique",
    brandSlug: "redken",
    categorySlug: "protecteurs-chaleur",
    shortDescription: "Protection thermique jusqu'à 230°C.",
    description:
      "Ce spray léger protège la fibre capillaire de la chaleur des appareils de coiffage tout en apportant brillance et douceur, sans effet lourd.",
    usageAdvice: "Vaporiser sur cheveux humides ou secs avant tout coiffage à chaud.",
    ingredients: "Aqua, Dimethicone, Panthenol, Parfum.",
    hairTypes: ["Tous types"],
    objectives: ["Protection thermique", "Brillance"],
    basePrice: 21,
    compareAtPrice: null,
    images: [image("redken1", "Spray Protecteur Thermique Redken")],
    variants: [{ id: "var-redken-200", label: "200 ml", sku: "LC-PC-005-200", priceOverride: null, stockQuantity: 27 }],
    reviews: [],
    complementSlugs: ["lisseur-platinum-plus-ghd"],
  },
  {
    id: "prod-carte-cadeau-50",
    sku: "LC-CG-006",
    slug: "carte-cadeau-50",
    name: "Carte cadeau — 50€",
    brandSlug: "loreal-professionnel",
    categorySlug: "cartes-cadeaux",
    shortDescription: "À offrir pour une prestation ou un shopping boutique.",
    description:
      "Une carte cadeau Laurie Coiffure d'une valeur de 50€, utilisable sur l'ensemble des prestations en salon et des produits de la boutique en ligne.",
    usageAdvice: "Envoyée par email, valable 1 an à compter de la date d'achat.",
    ingredients: "-",
    hairTypes: [],
    objectives: [],
    basePrice: 50,
    compareAtPrice: null,
    images: [image("carte1", "Carte cadeau Laurie Coiffure")],
    variants: [{ id: "var-carte-50", label: "50€", sku: "LC-CG-006-50", priceOverride: null, stockQuantity: 999 }],
    reviews: [],
    complementSlugs: [],
  },
];

export function getMockProductBySlug(slug: string) {
  return mockProducts.find((p) => p.slug === slug) ?? null;
}

export function getMockProductsByCategory(categorySlug: string) {
  return mockProducts.filter((p) => p.categorySlug === categorySlug);
}

export function getMockBrandBySlug(slug: string) {
  return mockBrands.find((b) => b.slug === slug) ?? null;
}

export function getMockCategoryBySlug(slug: string) {
  return mockCategories.find((c) => c.slug === slug) ?? null;
}
