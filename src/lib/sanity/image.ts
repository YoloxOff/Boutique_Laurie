import createImageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";
import { dataset, projectId } from "@/sanity/env";

const builder = createImageUrlBuilder({ projectId: projectId || "placeholder", dataset });

export function urlForImage(source: Image) {
  return builder.image(source);
}
