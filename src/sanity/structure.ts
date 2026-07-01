import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenu Laurie Coiffure")
    .items([
      S.listItem().title("Réglages du site").child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem().title("Le Salon").child(S.document().schemaType("salonPage").documentId("salonPage")),
      S.divider(),
      S.documentTypeListItem("service").title("Prestations"),
      S.documentTypeListItem("teamMember").title("Équipe"),
      S.documentTypeListItem("brandStory").title("Marques partenaires"),
      S.divider(),
      S.documentTypeListItem("post").title("Articles de blog"),
      S.documentTypeListItem("postCategory").title("Catégories de blog"),
      S.documentTypeListItem("author").title("Auteurs"),
      S.divider(),
      S.documentTypeListItem("galleryItem").title("Galerie"),
      S.documentTypeListItem("testimonial").title("Témoignages"),
      S.divider(),
      S.documentTypeListItem("legalPage").title("Pages légales"),
    ]);
