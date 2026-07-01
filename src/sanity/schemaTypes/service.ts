import { defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Prestation",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nom", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({
      name: "category",
      title: "Catégorie",
      type: "string",
      options: { list: ["femme", "homme", "enfant", "technique"] },
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
    defineField({ name: "benefits", title: "Bénéfices", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "duration", title: "Durée", type: "string" }),
    defineField({ name: "price", title: "Prix (indicatif)", type: "string" }),
    defineField({ name: "image", title: "Photo", type: "image", options: { hotspot: true } }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", type: "string", title: "Question" },
            { name: "answer", type: "text", title: "Réponse", rows: 3 },
          ],
        },
      ],
    }),
  ],
});
