import type { Metadata } from "next";
import { assertPagePermission } from "@/lib/admin/permissions";
import { db, isDatabaseConfigured } from "@/db";
import { GalleryItemCreateForm } from "@/components/forms/gallery-item-create-form";
import { GalleryItemCard } from "@/components/forms/gallery-item-card";

export const metadata: Metadata = { title: "Admin — Réalisations" };

export default async function AdminRealisationsPage() {
  await assertPagePermission("media");

  const items = isDatabaseConfigured
    ? await db.query.galleryItems.findMany({
        orderBy: (g, { asc }) => [asc(g.position)],
      })
    : [];

  return (
    <div>
      <h1 className="font-heading text-2xl">Réalisations</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Gérez les photos affichées dans la section Réalisations du site (Mariage / Quotidien).
      </p>

      <div className="mt-6">
        <GalleryItemCreateForm />
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((item) => (
          <GalleryItemCard key={item.id} item={item} />
        ))}
        {items.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground">
            {isDatabaseConfigured ? "Aucune réalisation." : "Mode démo : Neon non configuré."}
          </p>
        )}
      </div>
    </div>
  );
}
