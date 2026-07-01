import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Réglages du site",
  type: "document",
  fields: [
    defineField({ name: "planityUrl", title: "URL de réservation (Fleeky)", type: "url" }),
    defineField({ name: "phone", title: "Téléphone", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "address", title: "Adresse", type: "string" }),
    defineField({
      name: "hours",
      title: "Horaires",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "day", type: "string", title: "Jour(s)" },
            { name: "hours", type: "string", title: "Horaires" },
          ],
        },
      ],
    }),
    defineField({ name: "instagram", title: "Lien Instagram", type: "url" }),
    defineField({ name: "facebook", title: "Lien Facebook", type: "url" }),
    defineField({ name: "announcementBar", title: "Bandeau d'annonce", type: "string" }),
  ],
});

// Documents CGU/CGV/mentions légales/cookies édités sans redéploiement
export const legalPage = defineType({
  name: "legalPage",
  title: "Page légale",
  type: "document",
  fields: [
    defineField({
      name: "key",
      title: "Identifiant",
      type: "string",
      options: { list: ["cgv", "mentions-legales", "confidentialite", "cookies"] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "title", title: "Titre", type: "string" }),
    defineField({ name: "content", title: "Contenu", type: "array", of: [{ type: "block" }] }),
  ],
});
