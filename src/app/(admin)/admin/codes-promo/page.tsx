import type { Metadata } from "next";
import Link from "next/link";
import { ilike } from "drizzle-orm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PromoCodeCreateForm } from "@/components/forms/promo-code-create-form";
import { SearchInput } from "@/components/admin/search-input";
import { db, isDatabaseConfigured } from "@/db";
import { promoCodes } from "@/db/schema";
import { assertPagePermission } from "@/lib/admin/permissions";
import { bulkSetPromoActive, bulkDeletePromoCodes } from "@/lib/admin/promo-actions";

export const metadata: Metadata = { title: "Admin — Codes promo" };

export default async function AdminCodesPromoPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await assertPagePermission("promotions");
  const { q = "" } = await searchParams;

  const codes = isDatabaseConfigured
    ? await db.query.promoCodes.findMany({ where: q ? ilike(promoCodes.code, `%${q}%`) : undefined })
    : [];

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-2xl">Codes promo</h1>
        <Button variant="secondary" render={<Link href="/api/admin/codes-promo/export" />}>
          Exporter en CSV
        </Button>
      </div>

      <div className="mt-6">
        <PromoCodeCreateForm />
      </div>

      <div className="mt-10">
        <SearchInput defaultValue={q} placeholder="Rechercher un code…" action="/admin/codes-promo" />
      </div>

      <form>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" variant="outline" type="submit" formAction={bulkSetPromoActive.bind(null, true)}>
            Activer la sélection
          </Button>
          <Button size="sm" variant="outline" type="submit" formAction={bulkSetPromoActive.bind(null, false)}>
            Désactiver la sélection
          </Button>
          <Button size="sm" variant="destructive" type="submit" formAction={bulkDeletePromoCodes}>
            Supprimer la sélection
          </Button>
        </div>

        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Valeur</TableHead>
              <TableHead>Utilisations</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {codes.map((code) => (
              <TableRow key={code.id}>
                <TableCell>
                  <input type="checkbox" name="ids" value={code.id} className="size-4 rounded border-border" />
                </TableCell>
                <TableCell>{code.code}</TableCell>
                <TableCell>{code.type}</TableCell>
                <TableCell>{code.value}</TableCell>
                <TableCell>
                  {code.usageCount}
                  {code.usageLimit ? ` / ${code.usageLimit}` : ""}
                </TableCell>
                <TableCell>
                  <Badge variant={code.active ? "secondary" : "destructive"}>{code.active ? "Actif" : "Inactif"}</Badge>
                </TableCell>
              </TableRow>
            ))}
            {codes.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  {isDatabaseConfigured
                    ? "Aucun code promo créé."
                    : "Mode démo : les codes BIENVENUE10 et LIVRAISON sont utilisables sur le site."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </form>
    </div>
  );
}
