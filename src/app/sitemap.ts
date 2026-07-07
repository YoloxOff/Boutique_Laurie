import type { MetadataRoute } from "next";
import { env } from "@/env";
import { getAllProducts } from "@/lib/data/products";

const STATIC_ROUTES = [
  "",
  "/boutique",
  "/cgv",
  "/mentions-legales",
  "/confidentialite",
  "/cookies",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts();

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

  return [...staticEntries, ...productEntries];
}
