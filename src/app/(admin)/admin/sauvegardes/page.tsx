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
import { CreateBackupButton, BackupRowActions } from "@/components/forms/backup-actions-panel";
import { auth } from "@/lib/auth";
import { listBackups } from "@/lib/admin/backup";
import { isDatabaseConfigured } from "@/db";
import { env } from "@/env";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Admin — Sauvegardes" };

export default async function AdminSauvegardesPage() {
  const session = await auth();
  if (session?.user?.role !== "super_admin") redirect("/admin");

  if (!isDatabaseConfigured || !env.BLOB_READ_WRITE_TOKEN) {
    return (
      <div>
        <h1 className="font-heading text-2xl">Sauvegardes</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Configurez Neon (DATABASE_URL) et Vercel Blob (BLOB_READ_WRITE_TOKEN) pour activer les
          sauvegardes.
        </p>
      </div>
    );
  }

  const backups = await listBackups();

  return (
    <div>
      <h1 className="font-heading text-2xl">Sauvegardes</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Réservé au super administrateur. Une sauvegarde chiffrée du cœur métier (produits,
        commandes, clients, codes promo, newsletter, paramètres, pages légales) est créée
        automatiquement chaque nuit à 3h (cron Vercel), en plus des sauvegardes manuelles
        ci-dessous. La restauration réinjecte les données sans rien supprimer.
      </p>

      <div className="mt-6">
        <CreateBackupButton />
      </div>

      <Table className="mt-8">
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Fichier</TableHead>
            <TableHead>Taille</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {backups.map((b) => (
            <TableRow key={b.pathname}>
              <TableCell>{formatDate(b.uploadedAt.toISOString())}</TableCell>
              <TableCell className="font-mono text-xs">{b.pathname}</TableCell>
              <TableCell>{(b.size / 1024).toFixed(0)} Ko</TableCell>
              <TableCell>
                <BackupRowActions pathname={b.pathname} />
              </TableCell>
            </TableRow>
          ))}
          {backups.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                Aucune sauvegarde pour le moment.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
