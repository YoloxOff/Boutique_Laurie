import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getOrdersForCurrentUser } from "@/lib/orders";
import { formatDate, formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Mes commandes" };

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  paid: "Payée",
  processing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
  refunded: "Remboursée",
};

export default async function CommandesPage() {
  const orders = await getOrdersForCurrentUser();

  return (
    <div>
      <h1 className="font-heading text-2xl">Mes commandes</h1>

      {orders.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">Vous n&apos;avez pas encore passé de commande.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {orders.map((order) => (
            <Link
              key={order.orderNumber}
              href={`/compte/commandes/${order.orderNumber}`}
              className="flex items-center justify-between rounded-xl border border-border p-4 hover:border-accent"
            >
              <div>
                <p className="font-medium">{order.orderNumber}</p>
                <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="secondary">{STATUS_LABELS[order.status] ?? order.status}</Badge>
                <span className="font-heading">{formatPrice(order.total)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
