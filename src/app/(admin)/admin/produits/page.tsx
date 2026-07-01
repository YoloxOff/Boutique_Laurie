import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db, isDatabaseConfigured } from "@/db";
import { mockProducts } from "@/lib/mock/catalog";
import { formatPrice } from "@/lib/format";
import { assertPagePermission } from "@/lib/admin/permissions";

export const metadata: Metadata = { title: "Admin — Produits" };

async function getProductRows() {
  if (!isDatabaseConfigured) {
    return mockProducts.map((p) => ({
      id: p.slug,
      name: p.name,
      sku: p.sku,
      basePrice: p.basePrice,
      stock: p.variants.reduce((sum, v) => sum + v.stockQuantity, 0),
    }));
  }
  const rows = await db.query.products.findMany({ with: { variants: true } });
  return rows.map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    basePrice: Number(p.basePrice),
    stock: p.variants.reduce((sum, v) => sum + v.stockQuantity, 0),
  }));
}

export default async function AdminProduitsPage() {
  await assertPagePermission("products");
  const products = await getProductRows();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl">Produits</h1>
        <Button render={<Link href="/admin/produits/nouveau" />}>Ajouter un produit</Button>
      </div>

      <Table className="mt-8">
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.sku}</TableCell>
              <TableCell>{formatPrice(product.basePrice)}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell className="text-right">
                <Link href={`/admin/produits/${product.id}`} className="text-sm underline underline-offset-4">
                  Gérer
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
