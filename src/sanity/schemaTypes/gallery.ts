import { defineField, defineType } from "sanity";

export const galleryItem = defineType({
  name: "galleryItem",
  title: "Élément de galerie",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Titre", type: "string" }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: { list: ["photo", "avant-apres", "video"] },
    }),
    defineField({ name: "category", title: "Catégorie", type: "string" }),
    defineField({ name: "image", title: "Photo (ou avant)", type: "image", options: { hotspot: true } }),
    defineField({ name: "imageAfter", title: "Photo après (si avant/après)", type: "image", options: { hotspot: true } }),
    defineField({ name: "videoUrl", title: "URL vidéo (si type=video)", type: "url" }),
  ],
});
