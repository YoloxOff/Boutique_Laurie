import { sanityFetch } from "@/lib/sanity/client";
import { mockServices, type MockService } from "@/lib/mock/content";

const ALL_QUERY = `*[_type == "service"]{ "slug": slug.current, name, category, subCategory, description, benefits, duration, price, "image": image.asset->url, faq }`;

export async function getAllServices(): Promise<MockService[]> {
  const remote = await sanityFetch<MockService[]>(ALL_QUERY);
  return remote && remote.length ? remote : mockServices;
}
