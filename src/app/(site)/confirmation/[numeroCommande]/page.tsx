import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrderByNumber } from "@/lib/orders";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Confirmation de commande" };

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ numeroCommande: string }>;
}) {
  const { numeroCommande } = await params;
  const order = await getOrderByNumber(numeroCommande);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <CheckCircle2 className="mx-auto size-14 text-accent-foreground" />
      <h1 className="mt-6 font-heading text-3xl">Merci pour votre commande !</h1>
      <p className="mt-4 text-muted-foreground">
        Votre commande <strong>{order.orderNumber}</strong> a bien été enregistrée. Un email de
        confirmation vous a été envoyé à {order.email}.
      </p>

      <div className="mt-10 space-y-2 rounded-xl border border-border p-6 text-left text-sm">
        {order.items.map((item) => (
          <div key={item.key} className="flex justify-between">
            <span className="text-muted-foreground">
              {item.name} x{item.quantity}
            </span>
            <span>{formatPrice(item.unitPrice * item.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-border pt-3 font-heading text-lg">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Button render={<Link href="/boutique" />}>Continuer mes achats</Button>
        <Button variant="outline" render={<Link href="/compte/commandes" />}>
          Suivre ma commande
        </Button>
      </div>
    </div>
  );
}
