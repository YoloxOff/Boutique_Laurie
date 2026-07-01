"use client";

import { useTransition } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatPrice } from "@/lib/format";
import { setShippingMethod } from "@/lib/cart-actions";
import { SHIPPING_METHODS, getShippingPrice, type ShippingMethod } from "@/lib/shipping";

export function ShippingMethodSelector({ selected, subtotal }: { selected: ShippingMethod; subtotal: number }) {
  const [, startTransition] = useTransition();

  return (
    <RadioGroup
      value={selected}
      onValueChange={(v) => startTransition(() => setShippingMethod(v))}
      className="space-y-3"
    >
      {SHIPPING_METHODS.map((method) => {
        const price = getShippingPrice(method.value, subtotal);
        return (
          <div key={method.value} className="flex items-center justify-between rounded-lg border border-border p-3">
            <div className="flex items-center gap-3">
              <RadioGroupItem value={method.value} id={`shipping-${method.value}`} />
              <Label htmlFor={`shipping-${method.value}`} className="cursor-pointer">
                <span className="font-medium">{method.label}</span>
                <span className="block text-xs text-muted-foreground">{method.description}</span>
              </Label>
            </div>
            <span className="text-sm font-medium">{price === 0 ? "Gratuit" : formatPrice(price)}</span>
          </div>
        );
      })}
    </RadioGroup>
  );
}
