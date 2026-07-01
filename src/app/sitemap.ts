import type { MetadataRoute } from "next";
import { env } from "@/env";
import { getAllProducts } from "@/lib/data/products";
import { getAllServices } from "@/lib/content/services";
import { getAllBrandStories } from "@/lib/content/brands";
import { getAllPosts } from "@/lib/content/posts";
import { getAllCategories } from "@/lib/data/catalog-meta";

const STATIC_ROUTES = [
  "",
  "/le-salon",
  "/prestations",
  "/boutique",
  "/marques",
  "/blog",
  "/galerie",
  "/avis",
  "/contact",
  "/faq",
  "/cgv",
  "/mentions-legales",
  "/confidentialite",
  "/cookies",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, services, brands, posts, categories] = await Promise.all([
    getAllProducts(),
    getAllServices(),
    getAllBrandStories(),
    getAllPosts(),
    getAllCategories(),
  ]);

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

  const serviceEntries = services.map((s) => ({
    url: `${env.NEXT_PUBLIC_SITE_URL}/prestations/${s.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const brandEntries = brands.map((b) => ({
    url: `${env.NEXT_PUBLIC_SITE_URL}/marques/${b.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const postEntries = posts.map((p) => ({
    url: `${env.NEXT_PUBLIC_SITE_URL}/blog/${p.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [
    ...staticEntries,
    ...productEntries,
    ...categoryEntries,
    ...serviceEntries,
    ...brandEntries,
    ...postEntries,
  ];
}
