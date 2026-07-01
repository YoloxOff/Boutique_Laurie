import type { Metadata } from "next";
import Link from "next/link";
import { and, or, ilike } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SearchInput } from "@/components/admin/search-input";
import { PaginationControls } from "@/components/admin/pagination-controls";
import { db, isDatabaseConfigured } from "@/db";
import { products } from "@/db/schema";
import { mockProducts } from "@/lib/mock/catalog";
import { formatPrice } from "@/lib/format";
import { assertPagePermission } from "@/lib/admin/permissions";
import { bulkSetProductStatus, bulkDeleteProducts } from "@/lib/admin/products-actions";

export const metadata: Metadata = { title: "Admin — Produits" };

const PAGE_SIZE = 20;

async function getProductRows(q: string, status: string) {
  if (!isDatabaseConfigured) {
    return mockProducts
      .filter((p) => !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase()))
      .map((p) => ({
        id: p.slug,
        name: p.name,
        sku: p.sku,
        basePrice: p.basePrice,
        stock: p.variants.reduce((sum, v) => sum + v.stockQuantity, 0),
        status: "active",
      }));
  }
  const rows = await db.query.products.findMany({
    where: and(
      status ? ilike(products.status, status) : undefined,
      q ? or(ilike(products.name, `%${q}%`), ilike(products.sku, `%${q}%`)) : undefined
    ),
    with: { variants: true },
  });
  return rows.map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    basePrice: Number(p.basePrice),
    stock: p.variants.reduce((sum, v) => sum + v.stockQuantity, 0),
    status: p.status,
  }));
}

export default async function AdminProduitsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  await assertPagePermission("products");
  const { q = "", status = "", page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const allMatching = await getProductRows(q, status);
  const totalPages = Math.max(1, Math.ceil(allMatching.length / PAGE_SIZE));
  const productsPage = allMatching.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const buildFilterHref = (statusValue: string) =>
    `/admin/produits?${new URLSearchParams({ ...(q ? { q } : {}), ...(statusValue ? { status: statusValue } : {}) })}`;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl">Produits ({allMatching.length})</h1>
        <div className="flex gap-2">
          <Button variant="secondary" render={<Link href="/api/admin/produits/export" />}>
            Exporter en CSV
          </Button>
          <Button render={<Link href="/admin/produits/nouveau" />}>Ajouter un produit</Button>
        </div>
      </div>

      <div className="mt-4">
        <SearchInput defaultValue={q} placeholder="Nom ou SKU…" action="/admin/produits" />
      </div>

      <div className="mt-4 flex gap-2">
        {[
          { value: "", label: "Tous" },
          { value: "active", label: "Publiés" },
          { value: "draft", label: "Brouillons" },
        ].map((s) => (
          <Button key={s.value} size="sm" variant={status === s.value ? "default" : "outline"} render={<Link href={buildFilterHref(s.value)} />}>
            {s.label}
          </Button>
        ))}
      </div>

      <form>
        <div className="mt-4 flex gap-2">
          <Button size="sm" variant="outline" type="submit" formAction={bulkSetProductStatus.bind(null, "active")}>
            Publier la sélection
          </Button>
          <Button size="sm" variant="outline" type="submit" formAction={bulkSetProductStatus.bind(null, "draft")}>
            Dépublier la sélection
          </Button>
          <Button size="sm" variant="destructive" type="submit" formAction={bulkDeleteProducts}>
            Supprimer la sélection
          </Button>
        </div>

        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead>Nom</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {productsPage.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <input type="checkbox" name="ids" value={product.id} className="size-4 rounded border-border" />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{formatPrice(product.basePrice)}</TableCell>
                <TableCell>
                  {product.stock}
                  {product.stock < 5 && (
                    <Badge variant="destructive" className="ml-2">
                      Stock bas
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={product.status === "active" ? "secondary" : "outline"}>
                    {product.status === "active" ? "Publié" : "Brouillon"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/produits/${product.id}`} className="text-sm underline underline-offset-4">
                    Gérer
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {productsPage.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Aucun produit trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </form>

      <PaginationControls
        page={page}
        totalPages={totalPages}
        buildHref={(p) => `/admin/produits?${new URLSearchParams({ ...(q ? { q } : {}), ...(status ? { status } : {}), page: String(p) })}`}
      />
    </div>
  );
}
