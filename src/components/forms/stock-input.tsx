"use client";

import { useTransition } from "react";
import { Input } from "@/components/ui/input";
import { updateStock } from "@/lib/admin/products-actions";

export function StockInput({ variantId, initialStock }: { variantId: string; initialStock: number }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Input
      type="number"
      defaultValue={initialStock}
      disabled={isPending}
      className="w-24"
      onBlur={(e) => {
        const value = Number(e.target.value);
        if (value !== initialStock) {
          startTransition(() => updateStock(variantId, value));
        }
      }}
    />
  );
}
