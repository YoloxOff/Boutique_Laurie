import { sanityFetch } from "@/lib/sanity/client";
import { mockServices, type MockService } from "@/lib/mock/content";

const ALL_QUERY = `*[_type == "service"]{ "slug": slug.current, name, category, description, benefits, duration, price, "image": image.asset->url, faq }`;
const BY_SLUG_QUERY = `*[_type == "service" && slug.current == $slug][0]{ "slug": slug.current, name, category, description, benefits, duration, price, "image": image.asset->url, faq }`;

export async function getAllServices(): Promise<MockService[]> {
  const remote = await sanityFetch<MockService[]>(ALL_QUERY);
  return remote && remote.length ? remote : mockServices;
}

export async function getServiceBySlug(slug: string): Promise<MockService | null> {
  const remote = await sanityFetch<MockService>(BY_SLUG_QUERY, { slug });
  if (remote) return remote;
  return mockServices.find((s) => s.slug === slug) ?? null;
}

export async function getServicesByCategory(category: MockService["category"]): Promise<MockService[]> {
  const all = await getAllServices();
  return all.filter((s) => s.category === category);
}
