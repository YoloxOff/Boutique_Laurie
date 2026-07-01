import { defineField, defineType } from "sanity";

export const brandStory = defineType({
  name: "brandStory",
  title: "Marque partenaire",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nom de la marque", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      description: "Doit correspondre au slug de la marque côté catalogue produit.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "story", title: "Présentation de la marque", type: "text", rows: 5 }),
    defineField({ name: "heroImage", title: "Image d'illustration", type: "image", options: { hotspot: true } }),
    defineField({ name: "logo", title: "Logo", type: "image" }),
  ],
});
