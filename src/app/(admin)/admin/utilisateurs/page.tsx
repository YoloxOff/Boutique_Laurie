import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminUserCreateForm } from "@/components/forms/admin-user-create-form";
import { AdminUserRow } from "@/components/forms/admin-user-row";
import { auth } from "@/lib/auth";
import { db, isDatabaseConfigured } from "@/db";
import { inArray } from "drizzle-orm";
import { users } from "@/db/schema";

export const metadata: Metadata = { title: "Admin — Utilisateurs" };

export default async function AdminUtilisateursPage() {
  const session = await auth();
  if (session?.user?.role !== "super_admin") {
    redirect("/admin");
  }

  const adminUsers = isDatabaseConfigured
    ? await db.query.users.findMany({
        where: inArray(users.role, ["employee", "admin", "super_admin"]),
        orderBy: (u, { desc }) => [desc(u.createdAt)],
      })
    : [];

  return (
    <div>
      <h1 className="font-heading text-2xl">Utilisateurs du back-office</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Créez des comptes administrateur ou employé et attribuez-leur des permissions précises.
        Réservé au super administrateur.
      </p>

      <div className="mt-6">
        <AdminUserCreateForm />
      </div>

      <Table className="mt-10">
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {adminUsers.map((u) => (
            <AdminUserRow
              key={u.id}
              user={{
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role,
                permissions: u.permissions,
                suspendedAt: u.suspendedAt,
              }}
              currentUserId={session?.user?.id}
            />
          ))}
          {adminUsers.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                {isDatabaseConfigured ? "Aucun compte back-office." : "Mode démo : Neon non configuré."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
