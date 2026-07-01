export const PERMISSIONS = [
  { key: "products", label: "Produits" },
  { key: "orders", label: "Commandes" },
  { key: "stock", label: "Stocks" },
  { key: "customers", label: "Clients" },
  { key: "promotions", label: "Codes promo" },
  { key: "reviews", label: "Avis" },
  { key: "newsletter", label: "Newsletter" },
  { key: "messages", label: "Messages" },
  { key: "media", label: "Photos" },
  { key: "settings", label: "Paramètres" },
  { key: "seo", label: "SEO" },
] as const;

export type PermissionKey = (typeof PERMISSIONS)[number]["key"];
