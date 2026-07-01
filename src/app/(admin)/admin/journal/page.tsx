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
import { PaginationControls } from "@/components/admin/pagination-controls";
import { auth } from "@/lib/auth";
import { db, isDatabaseConfigured } from "@/db";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Admin — Journal d'activité" };

const PAGE_SIZE = 30;

export default async function AdminJournalPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  if (session?.user?.role !== "super_admin") {
    redirect("/admin");
  }

  if (!isDatabaseConfigured) {
    return (
      <div>
        <h1 className="font-heading text-2xl">Journal d&apos;activité</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Mode démo : configurez Neon (DATABASE_URL) pour voir le journal réel ici.
        </p>
      </div>
    );
  }

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const allEntries = await db.query.activityLog.findMany({
    orderBy: (a, { desc }) => [desc(a.createdAt)],
  });
  const totalPages = Math.max(1, Math.ceil(allEntries.length / PAGE_SIZE));
  const entries = allEntries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <h1 className="font-heading text-2xl">Journal d&apos;activité</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Réservé au super administrateur. Trace les actions sensibles du back-office (connexions,
        création/modification/suppression, commandes…).
      </p>

      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Cible</TableHead>
            <TableHead>IP</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{formatDate(entry.createdAt.toISOString())}</TableCell>
              <TableCell>{entry.userEmail}</TableCell>
              <TableCell>{entry.action}</TableCell>
              <TableCell>{entry.target ?? "—"}</TableCell>
              <TableCell>{entry.ip ?? "—"}</TableCell>
            </TableRow>
          ))}
          {entries.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                Aucune activité enregistrée.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <PaginationControls page={page} totalPages={totalPages} buildHref={(p) => `/admin/journal?page=${p}`} />
    </div>
  );
}
