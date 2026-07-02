"use client";

import { Button } from "@/components/ui/button";
import { bulkDeleteOrders } from "@/lib/admin/orders-actions";

export function BulkDeleteOrdersButton() {
  return (
    <Button
      size="sm"
      variant="destructive"
      type="submit"
      formAction={bulkDeleteOrders}
      onClick={(e) => {
        if (!confirm("Supprimer définitivement les commandes sélectionnées ?")) e.preventDefault();
      }}
    >
      Supprimer la sélection
    </Button>
  );
}
