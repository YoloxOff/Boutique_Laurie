import { sanityFetch } from "@/lib/sanity/client";
import { mockBrandStories, type MockBrandStory } from "@/lib/mock/content";

const ALL_QUERY = `*[_type == "brandStory"]{ "slug": slug.current, name, story, "heroImage": heroImage.asset->url }`;
const BY_SLUG_QUERY = `*[_type == "brandStory" && slug.current == $slug][0]{ "slug": slug.current, name, story, "heroImage": heroImage.asset->url }`;

export async function getAllBrandStories(): Promise<MockBrandStory[]> {
  const remote = await sanityFetch<MockBrandStory[]>(ALL_QUERY);
  return remote && remote.length ? remote : mockBrandStories;
}

export async function getBrandStoryBySlug(slug: string): Promise<MockBrandStory | null> {
  const remote = await sanityFetch<MockBrandStory>(BY_SLUG_QUERY, { slug });
  if (remote) return remote;
  return mockBrandStories.find((b) => b.slug === slug) ?? null;
}
