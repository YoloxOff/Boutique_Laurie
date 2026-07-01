import type { Metadata } from "next";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { and, eq, or, ilike } from "drizzle-orm";
import { SearchInput } from "@/components/admin/search-input";
import { db, isDatabaseConfigured } from "@/db";
import { users } from "@/db/schema";
import { formatDate } from "@/lib/format";
import { assertPagePermission } from "@/lib/admin/permissions";
import { bulkSetCustomerBlocked } from "@/lib/admin/customers-actions";

export const metadata: Metadata = { title: "Admin — Clients" };

export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await assertPagePermission("customers");
  if (!isDatabaseConfigured) {
    return (
      <div>
        <h1 className="font-heading text-2xl">Clients</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Mode démo : configurez Neon (DATABASE_URL) pour voir les clients réels ici.
        </p>
      </div>
    );
  }

  const { q = "" } = await searchParams;

  const clients = await db.query.users.findMany({
    where: and(
      eq(users.role, "customer"),
      q ? or(ilike(users.name, `%${q}%`), ilike(users.email, `%${q}%`)) : undefined
    ),
    orderBy: (u, { desc }) => [desc(u.createdAt)],
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl">Clients ({clients.length})</h1>
        <Button variant="secondary" render={<Link href="/api/admin/clients/export" />}>
          Exporter (RGPD)
        </Button>
      </div>

      <div className="mt-4">
        <SearchInput defaultValue={q} placeholder="Rechercher un nom ou un email…" action="/admin/clients" />
      </div>

      <form>
        <div className="mt-4 flex gap-2">
          <Button size="sm" variant="outline" type="submit" formAction={bulkSetCustomerBlocked.bind(null, true)}>
            Bloquer la sélection
          </Button>
          <Button size="sm" variant="outline" type="submit" formAction={bulkSetCustomerBlocked.bind(null, false)}>
            Débloquer la sélection
          </Button>
        </div>

        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Inscrit le</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <input type="checkbox" name="ids" value={client.id} className="size-4 rounded border-border" />
                </TableCell>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>
                  <Badge variant={client.suspendedAt ? "destructive" : "secondary"}>
                    {client.suspendedAt ? "Bloqué" : "Actif"}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(client.createdAt.toISOString())}</TableCell>
              </TableRow>
            ))}
            {clients.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Aucun client trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </form>
    </div>
  );
}
