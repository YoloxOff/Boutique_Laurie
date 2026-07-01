import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "@/sanity/env";

export { isSanityConfigured };

export const sanityClient = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published",
});

export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
  if (!isSanityConfigured) return null;
  try {
    return await sanityClient.fetch<T>(query, params);
  } catch {
    return null;
  }
}
