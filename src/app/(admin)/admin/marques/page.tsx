import type { Metadata } from "next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BrandCreateForm } from "@/components/forms/brand-create-form";
import { BrandRow } from "@/components/forms/brand-row";
import { assertPagePermission } from "@/lib/admin/permissions";
import { db, isDatabaseConfigured } from "@/db";

export const metadata: Metadata = { title: "Admin — Marques" };

export default async function AdminMarquesPage() {
  await assertPagePermission("products");

  const brands = isDatabaseConfigured
    ? await db.query.brands.findMany({ orderBy: (b, { asc }) => [asc(b.name)] })
    : [];
  const products = isDatabaseConfigured ? await db.query.products.findMany() : [];
  const countByBrand = new Map<string, number>();
  for (const p of products) {
    if (!p.brandId) continue;
    countByBrand.set(p.brandId, (countByBrand.get(p.brandId) ?? 0) + 1);
  }

  return (
    <div>
      <h1 className="font-heading text-2xl">Marques</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Gérez les marques disponibles pour vos produits (utilisées aussi dans les filtres de la boutique).
      </p>

      <div className="mt-6">
        <BrandCreateForm />
      </div>

      <Table className="mt-10">
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Produits</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands.map((brand) => (
            <BrandRow key={brand.id} brand={brand} productCount={countByBrand.get(brand.id) ?? 0} />
          ))}
          {brands.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                {isDatabaseConfigured ? "Aucune marque." : "Mode démo : Neon non configuré."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
