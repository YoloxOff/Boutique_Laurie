import type { Metadata } from "next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { eq } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/db";
import { users } from "@/db/schema";
import { formatDate } from "@/lib/format";
import { assertPagePermission } from "@/lib/admin/permissions";

export const metadata: Metadata = { title: "Admin — Clients" };

export default async function AdminClientsPage() {
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

  const clients = await db.query.users.findMany({
    where: eq(users.role, "customer"),
    orderBy: (u, { desc }) => [desc(u.createdAt)],
  });

  return (
    <div>
      <h1 className="font-heading text-2xl">Clients</h1>
      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Inscrit le</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
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
        </TableBody>
      </Table>
    </div>
  );
}
