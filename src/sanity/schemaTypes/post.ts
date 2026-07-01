import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Article de blog",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Titre", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "excerpt", title: "Extrait", type: "text", rows: 2 }),
    defineField({ name: "coverImage", title: "Image de couverture", type: "image", options: { hotspot: true } }),
    defineField({ name: "category", title: "Catégorie", type: "reference", to: [{ type: "postCategory" }] }),
    defineField({ name: "author", title: "Auteur", type: "reference", to: [{ type: "author" }] }),
    defineField({ name: "content", title: "Contenu", type: "array", of: [{ type: "block" }, { type: "image" }] }),
    defineField({ name: "seoTitle", title: "SEO — Title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO — Meta description", type: "text", rows: 2 }),
    defineField({ name: "publishedAt", title: "Date de publication", type: "datetime" }),
  ],
});

export const postCategory = defineType({
  name: "postCategory",
  title: "Catégorie de blog",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nom", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" } }),
  ],
});

export const author = defineType({
  name: "author",
  title: "Auteur",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nom", type: "string" }),
    defineField({ name: "photo", title: "Photo", type: "image" }),
  ],
});
