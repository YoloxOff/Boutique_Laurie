import type { Metadata } from "next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PromoCodeCreateForm } from "@/components/forms/promo-code-create-form";
import { db, isDatabaseConfigured } from "@/db";

export const metadata: Metadata = { title: "Admin — Codes promo" };

export default async function AdminCodesPromoPage() {
  const codes = isDatabaseConfigured ? await db.query.promoCodes.findMany() : [];

  return (
    <div>
      <h1 className="font-heading text-2xl">Codes promo</h1>

      <div className="mt-6">
        <PromoCodeCreateForm />
      </div>

      <Table className="mt-10">
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Valeur</TableHead>
            <TableHead>Utilisations</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {codes.map((code) => (
            <TableRow key={code.id}>
              <TableCell>{code.code}</TableCell>
              <TableCell>{code.type}</TableCell>
              <TableCell>{code.value}</TableCell>
              <TableCell>{code.usageCount}</TableCell>
            </TableRow>
          ))}
          {codes.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                {isDatabaseConfigured
                  ? "Aucun code promo créé."
                  : "Mode démo : les codes BIENVENUE10 et LIVRAISON sont utilisables sur le site."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
