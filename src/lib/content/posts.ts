import { sanityFetch } from "@/lib/sanity/client";
import { mockPosts, type MockPost } from "@/lib/mock/content";

const ALL_QUERY = `*[_type == "post"] | order(publishedAt desc){ "slug": slug.current, title, excerpt, "coverImage": coverImage.asset->url, publishedAt, "category": category->name }`;
const BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0]{ "slug": slug.current, title, excerpt, "coverImage": coverImage.asset->url, publishedAt, "category": category->name, content }`;

export async function getAllPosts(): Promise<MockPost[]> {
  const remote = await sanityFetch<MockPost[]>(ALL_QUERY);
  return remote && remote.length ? remote : mockPosts;
}

export async function getPostBySlug(slug: string): Promise<MockPost | null> {
  const remote = await sanityFetch<MockPost>(BY_SLUG_QUERY, { slug });
  if (remote) return remote;
  return mockPosts.find((p) => p.slug === slug) ?? null;
}
