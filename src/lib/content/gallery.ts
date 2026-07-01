import { sanityFetch } from "@/lib/sanity/client";
import { mockGallery, type MockGalleryItem } from "@/lib/mock/content";

const GALLERY_QUERY = `*[_type == "galleryItem"]{ "id": _id, title, type, category, "image": image.asset->url, "imageAfter": imageAfter.asset->url, videoUrl }`;

export async function getGallery(): Promise<MockGalleryItem[]> {
  const remote = await sanityFetch<MockGalleryItem[]>(GALLERY_QUERY);
  return remote && remote.length ? remote : mockGallery;
}
