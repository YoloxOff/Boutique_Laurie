"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPrice } from "@/lib/format";
import { addToCart } from "@/lib/cart-actions";
import type { MockVariant } from "@/lib/mock/catalog";

export function AddToCartForm({
  productSlug,
  variants,
  basePrice,
  stockStatus,
}: {
  productSlug: string;
  variants: MockVariant[];
  basePrice: number;
  stockStatus: boolean;
}) {
  const [variantId, setVariantId] = useState<string | null>(variants[0]?.id ?? null);
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();

  const selectedVariant = variants.find((v) => v.id === variantId);
  const price = selectedVariant?.priceOverride ?? basePrice;
  const outOfStock = variants.length > 0 ? (selectedVariant?.stockQuantity ?? 0) <= 0 : !stockStatus;

  function handleAdd() {
    startTransition(async () => {
      try {
        await addToCart(productSlug, variantId, quantity);
        toast.success("Ajouté au panier");
      } catch {
        toast.error("Impossible d'ajouter ce produit au panier");
      }
    });
  }

  return (
    <div className="space-y-4">
      <p className="font-heading text-2xl">{formatPrice(price)}</p>

      {variants.length > 1 && (
        <Select value={variantId ?? undefined} onValueChange={setVariantId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choisir un format" />
          </SelectTrigger>
          <SelectContent>
            {variants.map((v) => (
              <SelectItem key={v.id} value={v.id} disabled={v.stockQuantity <= 0}>
                {v.label} {v.stockQuantity <= 0 ? "(épuisé)" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <div className="flex items-center gap-3">
        <Select value={String(quantity)} onValueChange={(v) => setQuantity(Number(v))}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button className="flex-1" disabled={isPending || outOfStock} onClick={handleAdd}>
          {outOfStock ? "Épuisé" : isPending ? "Ajout…" : "Ajouter au panier"}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        {outOfStock ? "Actuellement indisponible" : "En stock — expédié sous 24 à 48h"}
      </p>
    </div>
  );
}
