"use client";

import { useTransition } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateOrderStatus } from "@/lib/admin/orders-actions";
import { orderStatusEnum } from "@/db/schema";

const LABELS: Record<string, string> = {
  pending: "En attente",
  paid: "Payée",
  processing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
  refunded: "Remboursée",
};

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      value={status}
      disabled={isPending}
      onValueChange={(value) =>
        startTransition(() =>
          updateOrderStatus(orderId, value as (typeof orderStatusEnum.enumValues)[number])
        )
      }
    >
      <SelectTrigger className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {orderStatusEnum.enumValues.map((value) => (
          <SelectItem key={value} value={value}>
            {LABELS[value] ?? value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
