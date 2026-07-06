import type { Metadata } from "next";
import { ProductForm } from "@/components/forms/product-form";
import { db, isDatabaseConfigured } from "@/db";
import { assertPagePermission } from "@/lib/admin/permissions";

export const metadata: Metadata = { title: "Admin — Nouveau produit" };

export default async function NouveauProduitPage() {
  await assertPagePermission("products");
  const brands = isDatabaseConfigured ? await db.query.brands.findMany() : [];

  return (
    <div>
      <h1 className="font-heading text-2xl">Ajouter un produit</h1>
      {!isDatabaseConfigured && (
        <p className="mt-2 text-sm text-muted-foreground">
          Mode démo : configurez Neon (DATABASE_URL) pour créer réellement des produits.
        </p>
      )}
      <div className="mt-6">
        <ProductForm brands={brands} />
      </div>
    </div>
  );
}
