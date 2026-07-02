"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StockInput } from "@/components/forms/stock-input";
import { addProductVariant, updateProductVariant, deleteProductVariant } from "@/lib/admin/products-actions";

type Variant = {
  id: string;
  label: string;
  sku: string;
  priceOverride: string | null;
  stockQuantity: number;
};

export function ProductVariantManager({ productId, variants }: { productId: string; variants: Variant[] }) {
  return (
    <div className="space-y-3">
      {variants.map((variant) => (
        <VariantRow key={variant.id} productId={productId} variant={variant} />
      ))}
      {variants.length === 0 && <p className="text-sm text-muted-foreground">Aucune variante.</p>}

      <form
        action={addProductVariant.bind(null, productId)}
        className="flex flex-wrap items-end gap-3 rounded-lg border border-dashed border-border p-4"
      >
        <div>
          <Label htmlFor="new-variant-label">Nom</Label>
          <Input id="new-variant-label" name="label" required className="mt-1.5 w-40" placeholder="Ex. Grand format" />
        </div>
        <div>
          <Label htmlFor="new-variant-sku">SKU</Label>
          <Input id="new-variant-sku" name="sku" required className="mt-1.5 w-40" />
        </div>
        <div>
          <Label htmlFor="new-variant-stock">Stock</Label>
          <Input id="new-variant-stock" name="stockQuantity" type="number" defaultValue={0} className="mt-1.5 w-24" />
        </div>
        <Button type="submit">Ajouter une variante</Button>
      </form>
    </div>
  );
}

function VariantRow({ productId, variant }: { productId: string; variant: Variant }) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={updateProductVariant.bind(null, variant.id, productId)}
      className="flex flex-wrap items-end gap-3 rounded-lg border border-border p-3"
    >
      <div>
        <Label htmlFor={`variant-label-${variant.id}`}>Nom</Label>
        <Input id={`variant-label-${variant.id}`} name="label" defaultValue={variant.label} required className="mt-1.5 w-40" />
      </div>
      <div>
        <Label htmlFor={`variant-sku-${variant.id}`}>SKU</Label>
        <Input id={`variant-sku-${variant.id}`} name="sku" defaultValue={variant.sku} required className="mt-1.5 w-40" />
      </div>
      <div>
        <Label htmlFor={`variant-price-${variant.id}`}>Prix (€)</Label>
        <Input
          id={`variant-price-${variant.id}`}
          name="priceOverride"
          type="number"
          step="0.01"
          defaultValue={variant.priceOverride ?? ""}
          placeholder="Prix de base"
          className="mt-1.5 w-28"
        />
      </div>
      <div>
        <Label>Stock</Label>
        <div className="mt-1.5">
          <StockInput variantId={variant.id} initialStock={variant.stockQuantity} />
        </div>
      </div>
      <Button type="submit" size="sm" variant="outline">
        Enregistrer
      </Button>
      <Button
        type="button"
        size="sm"
        variant="destructive"
        disabled={isPending}
        onClick={() => {
          if (confirm(`Supprimer la variante ${variant.label} ?`)) {
            startTransition(() => deleteProductVariant(variant.id, productId));
          }
        }}
      >
        Supprimer
      </Button>
    </form>
  );
}
