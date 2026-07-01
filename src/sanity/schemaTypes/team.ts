import { defineField, defineType } from "sanity";

export const teamMember = defineType({
  name: "teamMember",
  title: "Membre de l'équipe",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nom", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", title: "Rôle", type: "string" }),
    defineField({ name: "bio", title: "Bio", type: "text", rows: 3 }),
    defineField({ name: "photo", title: "Photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "position", title: "Ordre d'affichage", type: "number" }),
  ],
});

export const salonPage = defineType({
  name: "salonPage",
  title: "Le Salon (page)",
  type: "document",
  fields: [
    defineField({ name: "history", title: "Histoire", type: "text", rows: 5 }),
    defineField({ name: "values", title: "Valeurs", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "photos", title: "Photos du salon", type: "array", of: [{ type: "image", options: { hotspot: true } }] }),
    defineField({ name: "virtualTourUrl", title: "URL visite virtuelle (optionnel)", type: "url" }),
  ],
});
