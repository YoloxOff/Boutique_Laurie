"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateProductDetails, type ProductFormState } from "@/lib/admin/products-actions";

const initial: ProductFormState = { error: null };

export function ProductEditForm({
  id,
  name,
  shortDescription,
  description,
  basePrice,
  slug,
  seoTitle,
  seoDescription,
  brandId,
  brands,
  objectives,
}: {
  id: string;
  name: string;
  shortDescription: string | null;
  description: string;
  basePrice: number;
  slug: string;
  seoTitle: string | null;
  seoDescription: string | null;
  brandId: string | null;
  brands: { id: string; name: string }[];
  objectives: string[];
}) {
  const [state, formAction, isPending] = useActionState(updateProductDetails, initial);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="id" value={id} />
      <div>
        <Label htmlFor="edit-name">Nom</Label>
        <Input id="edit-name" name="name" defaultValue={name} required className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="edit-basePrice">Prix (€)</Label>
        <Input id="edit-basePrice" name="basePrice" type="number" step="0.01" defaultValue={basePrice} className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="edit-brandId">Marque</Label>
        <select
          id="edit-brandId"
          name="brandId"
          defaultValue={brandId ?? ""}
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
        <Label htmlFor="edit-shortDescription">Sous-titre</Label>
        <Input
          id="edit-shortDescription"
          name="shortDescription"
          defaultValue={shortDescription ?? ""}
          className="mt-1.5"
        />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="edit-objectives">Objectifs (séparés par des virgules)</Label>
        <Input
          id="edit-objectives"
          name="objectives"
          defaultValue={objectives.join(", ")}
          placeholder="Nutrition, Éclat couleur, Lissage"
          className="mt-1.5"
        />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="edit-description">Description</Label>
        <Textarea id="edit-description" name="description" rows={4} defaultValue={description} className="mt-1.5" />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="edit-slug">URL personnalisée (slug)</Label>
        <Input id="edit-slug" name="slug" defaultValue={slug} className="mt-1.5" />
      </div>
      <div className="sm:col-span-2">
        <h3 className="text-sm font-semibold text-muted-foreground">SEO</h3>
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="edit-seoTitle">Titre (balise meta title)</Label>
        <Input id="edit-seoTitle" name="seoTitle" defaultValue={seoTitle ?? ""} className="mt-1.5" />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="edit-seoDescription">Description (balise meta description)</Label>
        <Textarea id="edit-seoDescription" name="seoDescription" rows={2} defaultValue={seoDescription ?? ""} className="mt-1.5" />
      </div>

      {state.error && <p className="sm:col-span-2 text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={isPending} className="sm:col-span-2">
        {isPending ? "Enregistrement…" : "Enregistrer les modifications"}
      </Button>
    </form>
  );
}
