import { sanityFetch } from "@/lib/sanity/client";
import { mockGallery, mockTestimonials, type MockGalleryItem, type MockTestimonial } from "@/lib/mock/content";

const GALLERY_QUERY = `*[_type == "galleryItem"]{ "id": _id, title, type, category, "image": image.asset->url, "imageAfter": imageAfter.asset->url, videoUrl }`;
const TESTIMONIALS_QUERY = `*[_type == "testimonial"]{ author, rating, comment, "photo": photo.asset->url }`;

export async function getGallery(): Promise<MockGalleryItem[]> {
  const remote = await sanityFetch<MockGalleryItem[]>(GALLERY_QUERY);
  return remote && remote.length ? remote : mockGallery;
}

export async function getTestimonials(): Promise<MockTestimonial[]> {
  const remote = await sanityFetch<MockTestimonial[]>(TESTIMONIALS_QUERY);
  return remote && remote.length ? remote : mockTestimonials;
}
