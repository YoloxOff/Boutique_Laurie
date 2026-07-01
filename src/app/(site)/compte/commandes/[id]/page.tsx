import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrderByNumber } from "@/lib/orders";
import { formatDate, formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Détail de la commande" };

export default async function CommandeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderByNumber(id);
  if (!order) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl">Commande {order.orderNumber}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{formatDate(order.createdAt)} — Statut : {order.status}</p>

      <div className="mt-8 space-y-3 rounded-xl border border-border p-6 text-sm">
        {order.items.map((item) => (
          <div key={item.key} className="flex justify-between">
            <span className="text-muted-foreground">
              {item.name} x{item.quantity}
            </span>
            <span>{formatPrice(item.unitPrice * item.quantity)}</span>
          </div>
        ))}
        <div className="border-t border-border pt-3 flex justify-between font-heading text-lg">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        La facture PDF est envoyée par email à la confirmation de paiement (Vercel Blob requis pour
        un lien de téléchargement permanent — voir .env.example).
      </p>
    </div>
  );
}
