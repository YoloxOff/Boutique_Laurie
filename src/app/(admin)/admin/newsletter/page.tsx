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
import { Button } from "@/components/ui/button";
import { db, isDatabaseConfigured } from "@/db";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Admin — Newsletter" };

export default async function AdminNewsletterPage() {
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

  const subscribers = await db.query.newsletterSubscribers.findMany();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl">Newsletter ({subscribers.length})</h1>
        <Button variant="secondary" render={<Link href="/api/admin/newsletter/export" />}>
          Exporter en CSV
        </Button>
      </div>

      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Inscrit le</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscribers.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.email}</TableCell>
              <TableCell>{s.source}</TableCell>
              <TableCell>{formatDate(s.consentAt.toISOString())}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
