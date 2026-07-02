import type { Metadata } from "next";
import Link from "next/link";
import { and, eq, or, ilike } from "drizzle-orm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { DeleteOrderButton } from "@/components/admin/delete-order-button";
import { BulkDeleteOrdersButton } from "@/components/admin/bulk-delete-orders-button";
import { SearchInput } from "@/components/admin/search-input";
import { db, isDatabaseConfigured } from "@/db";
import { orders, orderStatusEnum } from "@/db/schema";
import { formatDate, formatPrice } from "@/lib/format";
import { assertPagePermission } from "@/lib/admin/permissions";
import { bulkUpdateOrderStatus } from "@/lib/admin/orders-actions";

export const metadata: Metadata = { title: "Admin — Commandes" };

const STATUSES = [
  { value: "", label: "Tous" },
  { value: "pending", label: "En attente" },
  { value: "paid", label: "Payée" },
  { value: "processing", label: "Préparation" },
  { value: "shipped", label: "Expédiée" },
  { value: "delivered", label: "Livrée" },
  { value: "cancelled", label: "Annulée" },
  { value: "refunded", label: "Remboursée" },
] as const;

export default async function AdminCommandesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
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

  const { q = "", status = "" } = await searchParams;
  const validStatus = STATUSES.some((s) => s.value === status) && status ? status : undefined;

  const ordersList = await db.query.orders.findMany({
    where: and(
      validStatus ? eq(orders.status, validStatus as (typeof orderStatusEnum.enumValues)[number]) : undefined,
      q ? or(ilike(orders.orderNumber, `%${q}%`), ilike(orders.email, `%${q}%`)) : undefined
    ),
    orderBy: (o, { desc }) => [desc(o.createdAt)],
  });

  const buildFilterHref = (statusValue: string) =>
    `/admin/commandes?${new URLSearchParams({ ...(q ? { q } : {}), ...(statusValue ? { status: statusValue } : {}) })}`;

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-2xl">Commandes ({ordersList.length})</h1>
        <Button variant="secondary" render={<Link href="/api/admin/commandes/export" />}>
          Exporter en CSV
        </Button>
      </div>

      <div className="mt-4">
        <SearchInput defaultValue={q} placeholder="N° de commande ou email…" action="/admin/commandes" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <Button
            key={s.value}
            size="sm"
            variant={status === s.value ? "default" : "outline"}
            render={<Link href={buildFilterHref(s.value)} />}
          >
            {s.label}
          </Button>
        ))}
      </div>

      <form>
        <div className="mt-4 flex flex-wrap gap-2">
          {(["paid", "processing", "shipped", "delivered", "cancelled", "refunded"] as const).map((s) => (
            <Button key={s} size="sm" variant="outline" type="submit" formAction={bulkUpdateOrderStatus.bind(null, s)}>
              Marquer sélection : {STATUSES.find((x) => x.value === s)?.label}
            </Button>
          ))}
          <BulkDeleteOrdersButton />
        </div>

        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead>N°</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordersList.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <input type="checkbox" name="ids" value={order.id} className="size-4 rounded border-border" />
                </TableCell>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>{order.email}</TableCell>
                <TableCell>{formatDate(order.createdAt.toISOString())}</TableCell>
                <TableCell>{formatPrice(Number(order.total))}</TableCell>
                <TableCell>
                  <OrderStatusSelect orderId={order.id} status={order.status} />
                </TableCell>
                <TableCell>
                  <DeleteOrderButton orderId={order.id} orderNumber={order.orderNumber} />
                </TableCell>
              </TableRow>
            ))}
            {ordersList.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Aucune commande trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </form>
    </div>
  );
}
