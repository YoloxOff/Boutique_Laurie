import type { Metadata } from "next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { db, isDatabaseConfigured } from "@/db";
import { formatDate, formatPrice } from "@/lib/format";
import { assertPagePermission } from "@/lib/admin/permissions";

export const metadata: Metadata = { title: "Admin — Commandes" };

export default async function AdminCommandesPage() {
  await assertPagePermission("orders");
  if (!isDatabaseConfigured) {
    return (
      <div>
        <h1 className="font-heading text-2xl">Commandes</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Mode démo : configurez Neon (DATABASE_URL) pour voir les commandes réelles ici.
        </p>
      </div>
    );
  }

  const orders = await db.query.orders.findMany({ orderBy: (o, { desc }) => [desc(o.createdAt)] });

  return (
    <div>
      <h1 className="font-heading text-2xl">Commandes</h1>
      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead>N°</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.orderNumber}</TableCell>
              <TableCell>{order.email}</TableCell>
              <TableCell>{formatDate(order.createdAt.toISOString())}</TableCell>
              <TableCell>{formatPrice(Number(order.total))}</TableCell>
              <TableCell>
                <OrderStatusSelect orderId={order.id} status={order.status} />
              </TableCell>
            </TableRow>
          ))}
          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                Aucune commande pour le moment.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
