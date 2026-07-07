import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductOrderManager } from "@/components/forms/product-order-manager";
import { db, isDatabaseConfigured } from "@/db";
import { assertPagePermission } from "@/lib/admin/permissions";

export const metadata: Metadata = { title: "Admin — Ordre d'affichage des produits" };

export default async function AdminProduitsOrdrePage() {
  await assertPagePermission("products");

  const products = isDatabaseConfigured
    ? await db.query.products.findMany({
        orderBy: (p, { asc }) => [asc(p.position)],
        with: { brand: true, images: { orderBy: (i, { asc }) => [asc(i.position)], limit: 1 } },
      })
    : [];

  const items = products.map((p) => ({
    id: p.id,
    name: p.name,
    brandName: p.brand?.name ?? null,
    imageUrl: p.images[0]?.url ?? null,
  }));

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl">Ordre d&apos;affichage des produits</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Glissez-déposez les produits ou utilisez les flèches pour définir l&apos;ordre par défaut
            (« Pertinence ») dans la boutique. Les changements sont enregistrés immédiatement.
          </p>
        </div>
        <Button variant="secondary" render={<Link href="/admin/produits" />}>
          Retour aux produits
        </Button>
      </div>

      <div className="mt-8">
        {isDatabaseConfigured ? (
          <ProductOrderManager items={items} />
        ) : (
          <p className="text-muted-foreground">Mode démo : Neon non configuré.</p>
        )}
      </div>
    </div>
  );
}
