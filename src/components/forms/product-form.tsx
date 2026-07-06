"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createProduct, type ProductFormState } from "@/lib/admin/products-actions";

const initialState: ProductFormState = { error: null };

export function ProductForm({ brands }: { brands: { id: string; name: string }[] }) {
  const [state, formAction, isPending] = useActionState(createProduct, initialState);

  return (
    <form action={formAction} className="grid max-w-2xl gap-4 sm:grid-cols-2">
      <div>
        <Label htmlFor="name">Nom</Label>
        <Input id="name" name="name" required className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="sku">SKU</Label>
        <Input id="sku" name="sku" required className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="basePrice">Prix (€)</Label>
        <Input id="basePrice" name="basePrice" type="number" step="0.01" required className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="stockQuantity">Stock initial</Label>
        <Input id="stockQuantity" name="stockQuantity" type="number" defaultValue={0} className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="brandId">Marque</Label>
        <select
          id="brandId"
          name="brandId"
          className="mt-1.5 flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm"
        >
          <option value="">Aucune</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="shortDescription">Sous-titre</Label>
        <Input id="shortDescription" name="shortDescription" className="mt-1.5" />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="objectives">Objectifs (séparés par des virgules)</Label>
        <Input id="objectives" name="objectives" placeholder="Nutrition, Éclat couleur, Lissage" className="mt-1.5" />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={4} required className="mt-1.5" />
      </div>
      {state.error && <p className="sm:col-span-2 text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={isPending} className="sm:col-span-2">
        {isPending ? "Création…" : "Créer le produit"}
      </Button>
    </form>
  );
}
