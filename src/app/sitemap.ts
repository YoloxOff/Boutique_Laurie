import type { MetadataRoute } from "next";
import { env } from "@/env";
import { getAllProducts } from "@/lib/data/products";
import { getAllCategories } from "@/lib/data/catalog-meta";

const STATIC_ROUTES = [
  "",
  "/boutique",
  "/cgv",
  "/mentions-legales",
  "/confidentialite",
  "/cookies",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([getAllProducts(), getAllCategories()]);

  const staticEntries = STATIC_ROUTES.map((path) => ({
    url: `${env.NEXT_PUBLIC_SITE_URL}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const productEntries = products.map((p) => ({
    url: `${env.NEXT_PUBLIC_SITE_URL}/boutique/produit/${p.slug}`,
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  const categoryEntries = categories.map((c) => ({
    url: `${env.NEXT_PUBLIC_SITE_URL}/boutique/${c.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticEntries, ...productEntries, ...categoryEntries];
}
