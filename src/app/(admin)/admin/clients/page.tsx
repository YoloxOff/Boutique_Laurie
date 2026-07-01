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
import { db, isDatabaseConfigured } from "@/db";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Admin — Clients" };

export default async function AdminClientsPage() {
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

  const users = await db.query.users.findMany({ orderBy: (u, { desc }) => [desc(u.createdAt)] });

  return (
    <div>
      <h1 className="font-heading text-2xl">Clients</h1>
      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Inscrit le</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
              </TableCell>
              <TableCell>{formatDate(user.createdAt.toISOString())}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
