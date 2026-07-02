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
import { SearchInput } from "@/components/admin/search-input";
import { PaginationControls } from "@/components/admin/pagination-controls";
import { db, isDatabaseConfigured } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { formatDate } from "@/lib/format";
import { assertPagePermission } from "@/lib/admin/permissions";
import {
  bulkUpdateNewsletterStatus,
  bulkDeleteNewsletterSubscribers,
} from "@/lib/admin/newsletter-actions";

export const metadata: Metadata = { title: "Admin — Newsletter" };

const PAGE_SIZE = 20;

export default async function AdminNewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  await assertPagePermission("newsletter");
  if (!isDatabaseConfigured) {
    return (
      <div>
        <h1 className="font-heading text-2xl">Newsletter</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Mode démo : configurez Neon (DATABASE_URL) pour voir les inscrits réels ici.
        </p>
      </div>
    );
  }

  const { q = "", page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const allMatching = await db.query.newsletterSubscribers.findMany({
    where: q ? ilike(newsletterSubscribers.email, `%${q}%`) : undefined,
    orderBy: (s, { desc }) => [desc(s.consentAt)],
  });
  const totalPages = Math.max(1, Math.ceil(allMatching.length / PAGE_SIZE));
  const subscribers = allMatching.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-2xl">Newsletter ({allMatching.length})</h1>
        <Button variant="secondary" render={<Link href="/api/admin/newsletter/export" />}>
          Exporter en CSV
        </Button>
      </div>

      <div className="mt-4">
        <SearchInput defaultValue={q} placeholder="Rechercher un email…" action="/admin/newsletter" />
      </div>

      <form>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" variant="outline" type="submit" formAction={bulkUpdateNewsletterStatus.bind(null, true)}>
            Réactiver la sélection
          </Button>
          <Button size="sm" variant="outline" type="submit" formAction={bulkUpdateNewsletterStatus.bind(null, false)}>
            Désactiver la sélection
          </Button>
          <Button size="sm" variant="destructive" type="submit" formAction={bulkDeleteNewsletterSubscribers}>
            Supprimer la sélection
          </Button>
        </div>

        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead>Email</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Inscrit le</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <input type="checkbox" name="ids" value={s.id} className="size-4 rounded border-border" />
                </TableCell>
                <TableCell>{s.email}</TableCell>
                <TableCell>{s.source}</TableCell>
                <TableCell>
                  <Badge variant={s.active ? "secondary" : "destructive"}>{s.active ? "Actif" : "Inactif"}</Badge>
                </TableCell>
                <TableCell>{formatDate(s.consentAt.toISOString())}</TableCell>
              </TableRow>
            ))}
            {subscribers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Aucun abonné trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </form>

      <PaginationControls
        page={page}
        totalPages={totalPages}
        buildHref={(p) => `/admin/newsletter?${new URLSearchParams({ ...(q ? { q } : {}), page: String(p) })}`}
      />
    </div>
  );
}
