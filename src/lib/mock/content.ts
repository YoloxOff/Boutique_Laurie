const img = (seed: string, w = 1200, h = 1500) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export type MockService = {
  slug: string;
  name: string;
  category: "femme" | "homme" | "enfant" | "technique";
  description: string;
  benefits: string[];
  duration: string;
  price: string;
  image: string;
  faq: { question: string; answer: string }[];
};

export const mockServices: MockService[] = [
  {
    slug: "balayage",
    name: "Balayage",
    category: "technique",
    description:
      "Une technique de coloration à main levée qui sublime la chevelure d'un effet naturel ensoleillé, sans démarcation à la repousse.",
    benefits: ["Effet naturel et lumineux", "Entretien espacé", "Personnalisé à votre carnation"],
    duration: "2h30 - 3h",
    price: "À partir de 95€",
    image: img("balayage"),
    faq: [
      { question: "Le balayage abîme-t-il les cheveux ?", answer: "Nos formulières professionnelles et soins associés préservent la fibre capillaire." },
      { question: "À quelle fréquence faut-il le refaire ?", answer: "Comptez 3 à 5 mois selon la repousse et l'effet recherché." },
    ],
  },
  {
    slug: "coloration",
    name: "Coloration",
    category: "technique",
    description: "Coloration sur-mesure pour une couvrance parfaite ou un changement de teinte réfléchi avec notre coloriste experte.",
    benefits: ["Couvrance longue durée", "Diagnostic personnalisé", "Produits professionnels L'Oréal"],
    duration: "1h30 - 2h",
    price: "À partir de 65€",
    image: img("coloration"),
    faq: [{ question: "Puis-je apporter une photo d'inspiration ?", answer: "Bien sûr, c'est même recommandé pour affiner le diagnostic." }],
  },
  {
    slug: "ombre-hair",
    name: "Ombré Hair",
    category: "technique",
    description: "Un dégradé subtil du plus foncé aux pointes plus claires, pour une transition élégante et sur-mesure.",
    benefits: ["Dégradé harmonieux", "Faible entretien racine", "Adapté aux cheveux longs et mi-longs"],
    duration: "2h30",
    price: "À partir de 110€",
    image: img("ombrehair"),
    faq: [],
  },
  {
    slug: "meches",
    name: "Mèches",
    category: "technique",
    description: "Mèches traditionnelles au papier ou au bonnet pour un éclaircissement précis et localisé.",
    benefits: ["Précision du geste", "Résultat lumineux", "Adaptable à toutes longueurs"],
    duration: "2h",
    price: "À partir de 85€",
    image: img("meches"),
    faq: [],
  },
  {
    slug: "gloss",
    name: "Gloss",
    category: "technique",
    description: "Soin colorant sans ammoniaque qui ravive l'éclat et la brillance entre deux colorations.",
    benefits: ["Brillance immédiate", "Sans ammoniaque", "Ravive la couleur"],
    duration: "45 min",
    price: "À partir de 35€",
    image: img("gloss"),
    faq: [],
  },
  {
    slug: "lissage",
    name: "Lissage",
    category: "technique",
    description: "Lissage professionnel pour discipliner et lisser durablement les cheveux frisés ou indisciplinés.",
    benefits: ["Résultat longue durée", "Cheveux disciplinés", "Gain de temps au quotidien"],
    duration: "2h - 3h",
    price: "À partir de 150€",
    image: img("lissage"),
    faq: [],
  },
  {
    slug: "soins-profonds",
    name: "Soins profonds",
    category: "technique",
    description: "Rituel de soin intensif Kérastase adapté à votre diagnostic capillaire pour une fibre réparée en profondeur.",
    benefits: ["Diagnostic personnalisé", "Produits Kérastase", "Résultat visible dès la 1ère séance"],
    duration: "30 - 45 min",
    price: "À partir de 25€",
    image: img("soinsprofonds"),
    faq: [],
  },
  {
    slug: "chignons",
    name: "Chignons",
    category: "femme",
    description: "Chignons sur-mesure pour vos événements, du plus romantique au plus glamour.",
    benefits: ["Sur-mesure selon l'événement", "Tenue longue durée", "Essai possible en amont"],
    duration: "45 min - 1h",
    price: "À partir de 55€",
    image: img("chignons"),
    faq: [],
  },
  {
    slug: "mariage",
    name: "Mariage",
    category: "femme",
    description: "Prestations dédiées aux mariées : essai coiffure, jour J à domicile ou en salon, mise en beauté complète.",
    benefits: ["Essai coiffure inclus", "Déplacement possible", "Accompagnement personnalisé"],
    duration: "Sur devis",
    price: "Sur devis",
    image: img("mariage"),
    faq: [],
  },
  {
    slug: "femme",
    name: "Coupe Femme",
    category: "femme",
    description: "Coupe personnalisée selon la morphologie du visage et la nature du cheveu, coiffage inclus.",
    benefits: ["Diagnostic personnalisé", "Coiffage inclus", "Conseils d'entretien"],
    duration: "45 min - 1h",
    price: "À partir de 45€",
    image: img("femme"),
    faq: [],
  },
  {
    slug: "homme",
    name: "Coupe Homme",
    category: "homme",
    description: "Coupe homme précise, dégradés et finitions à la tondeuse, taille de barbe sur demande.",
    benefits: ["Précision des finitions", "Taille de barbe possible", "Conseils coiffants"],
    duration: "30 - 45 min",
    price: "À partir de 30€",
    image: img("homme"),
    faq: [],
  },
  {
    slug: "enfant",
    name: "Coupe Enfant",
    category: "enfant",
    description: "Coupe adaptée aux enfants dans un cadre bienveillant et rassurant.",
    benefits: ["Cadre rassurant", "Rapide et adapté", "Tarif dédié"],
    duration: "20 - 30 min",
    price: "À partir de 20€",
    image: img("enfant"),
    faq: [],
  },
];

export type MockTeamMember = { name: string; role: string; bio: string; photo: string };
export const mockTeam: MockTeamMember[] = [
  { name: "Laurie", role: "Fondatrice & Coloriste experte", bio: "Plus de 15 ans d'expérience, spécialiste des techniques de coloration et du balayage sur-mesure.", photo: img("laurie", 800, 1000) },
  { name: "Manon", role: "Styliste coupe & coiffage", bio: "Passionnée par les coupes tendances et les chignons événementiels.", photo: img("manon", 800, 1000) },
  { name: "Julien", role: "Barbier & coupe homme", bio: "Expert des dégradés précis et des tailles de barbe sur-mesure.", photo: img("julien", 800, 1000) },
];

export type MockPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  category: string;
};
export const mockPosts: MockPost[] = [
  {
    slug: "comment-entretenir-son-balayage",
    title: "Comment entretenir son balayage ?",
    excerpt: "Nos conseils d'experte pour préserver l'éclat de votre balayage entre deux rendez-vous.",
    content:
      "Un balayage bien entretenu passe par un shampoing sans sulfate, un soin hebdomadaire nourrissant et une protection solaire pour préserver les reflets. Découvrez notre routine complète recommandée par Laurie.",
    coverImage: img("blog-balayage"),
    publishedAt: "2026-05-20",
    category: "Coloration",
  },
  {
    slug: "quel-shampoing-choisir",
    title: "Quel shampoing choisir selon votre type de cheveux ?",
    excerpt: "Cheveux colorés, secs, fins ou bouclés : notre guide pour choisir le shampoing adapté.",
    content:
      "Chaque type de cheveu a des besoins spécifiques. Nous vous guidons à travers notre sélection de shampoings professionnels L'Oréal et Kérastase pour trouver la formule adaptée à votre nature de cheveu.",
    coverImage: img("blog-shampoing"),
    publishedAt: "2026-06-02",
    category: "Conseils",
  },
  {
    slug: "proteger-cheveux-ete",
    title: "Comment protéger ses cheveux en été ?",
    excerpt: "Soleil, chlore, sel : les bons réflexes pour préserver la santé de vos cheveux cet été.",
    content:
      "L'été met à rude épreuve la fibre capillaire. Découvrez nos conseils et produits recommandés pour protéger vos cheveux du soleil, du sel et du chlore tout en gardant brillance et souplesse.",
    coverImage: img("blog-ete"),
    publishedAt: "2026-06-15",
    category: "Conseils",
  },
  {
    slug: "tendances-coiffure-2026",
    title: "Les tendances coiffure de la saison",
    excerpt: "Coupe, couleur, coiffage : ce qui fait tendance cette saison selon notre équipe.",
    content:
      "De l'ombré hair au carré structuré, découvrez les tendances repérées par notre équipe pour la saison, entre inspirations défilé et adaptation à la vie quotidienne.",
    coverImage: img("blog-tendances"),
    publishedAt: "2026-06-25",
    category: "Tendances",
  },
];

export type MockGalleryItem = { id: string; type: "photo" | "avant-apres" | "video"; category: string; image: string; imageAfter?: string; title: string };
export const mockGallery: MockGalleryItem[] = [
  { id: "g1", type: "avant-apres", category: "Balayage", image: img("avant1"), imageAfter: img("apres1"), title: "Balayage miel sur cheveux mi-longs" },
  { id: "g2", type: "avant-apres", category: "Coloration", image: img("avant2"), imageAfter: img("apres2"), title: "Couverture racine + reflets cuivrés" },
  { id: "g3", type: "photo", category: "Salon", image: img("salon1"), title: "L'espace coloration" },
  { id: "g4", type: "photo", category: "Salon", image: img("salon2"), title: "L'espace shampoing" },
  { id: "g5", type: "avant-apres", category: "Lissage", image: img("avant3"), imageAfter: img("apres3"), title: "Lissage brésilien" },
  { id: "g6", type: "photo", category: "Mariage", image: img("mariagegal"), title: "Chignon de mariée" },
];

export type MockTestimonial = { author: string; rating: number; comment: string; photo?: string };
export const mockTestimonials: MockTestimonial[] = [
  { author: "Émilie R.", rating: 5, comment: "Un accueil chaleureux et un résultat toujours à la hauteur de mes attentes. Je recommande vivement !" },
  { author: "Nadia B.", rating: 5, comment: "Laurie a su comprendre exactement ce que je voulais pour mon balayage. Un vrai savoir-faire." },
  { author: "Camille T.", rating: 4, comment: "Très bon salon, produits de qualité utilisés en boutique également." },
];

export const mockSiteSettings = {
  planityUrl: "https://www.planity.com/",
  phone: "01 23 45 67 89",
  email: "contact@laurie-coiffure.fr",
  address: "12 rue de la Beauté, 75000 Paris",
  hours: [
    { day: "Mardi - Vendredi", hours: "9h30 - 19h00" },
    { day: "Samedi", hours: "9h00 - 18h00" },
    { day: "Dimanche - Lundi", hours: "Fermé" },
  ],
  instagram: "https://instagram.com/lauriecoiffure",
  facebook: "https://facebook.com/lauriecoiffure",
};

export type MockBrandStory = { slug: string; name: string; story: string; heroImage: string };
export const mockBrandStories: MockBrandStory[] = [
  { slug: "loreal-professionnel", name: "L'Oréal Professionnel", story: "Depuis plus d'un siècle, L'Oréal Professionnel accompagne les plus grands salons avec une expertise inégalée en coloration et soin.", heroImage: img("brand-loreal") },
  { slug: "kerastase", name: "Kérastase", story: "Née dans les laboratoires L'Oréal, Kérastase élève le soin capillaire au rang de rituel de luxe sur-mesure.", heroImage: img("brand-kerastase") },
  { slug: "ghd", name: "GHD", story: "GHD révolutionne le coiffage professionnel avec des outils intelligents pensés pour préserver la santé du cheveu.", heroImage: img("brand-ghd") },
  { slug: "redken", name: "Redken", story: "Fondée par un chimiste et une actrice, Redken allie science capillaire de pointe et résultats concrets.", heroImage: img("brand-redken") },
];
