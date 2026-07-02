"use client";

import { Button } from "@/components/ui/button";
import { deleteOrder } from "@/lib/admin/orders-actions";

export function DeleteOrderButton({ orderId, orderNumber }: { orderId: string; orderNumber: string }) {
  return (
    <Button
      size="sm"
      variant="destructive"
      type="submit"
      formAction={deleteOrder.bind(null, orderId)}
      onClick={(e) => {
        if (!confirm(`Supprimer définitivement la commande ${orderNumber} ?`)) e.preventDefault();
      }}
    >
      Supprimer
    </Button>
  );
}
