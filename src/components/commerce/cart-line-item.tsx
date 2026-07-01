"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPrice } from "@/lib/format";
import { removeFromCart, updateCartItemQuantity } from "@/lib/cart-actions";
import type { CartLine } from "@/lib/cart";

export function CartLineItem({ line }: { line: CartLine }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-4 border-b border-border/60 py-6">
      <Link href={`/boutique/produit/${line.productSlug}`} className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-secondary">
        {line.image && <Image src={line.image} alt={line.name} fill sizes="96px" className="object-cover" />}
      </Link>
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between gap-4">
          <Link href={`/boutique/produit/${line.productSlug}`} className="font-medium hover:underline">
            {line.name}
          </Link>
          <p className="font-heading">{formatPrice(line.unitPrice * line.quantity)}</p>
        </div>
        <div className="flex items-center justify-between">
          <Select
            value={String(line.quantity)}
            onValueChange={(v) =>
              startTransition(() => {
                updateCartItemQuantity(line.key, Number(v));
              })
            }
          >
            <SelectTrigger className="w-20" disabled={isPending}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={isPending}
            onClick={() => startTransition(() => removeFromCart(line.key))}
            aria-label="Retirer du panier"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
