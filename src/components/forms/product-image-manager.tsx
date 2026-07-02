"use client";

import Image from "next/image";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addProductImage, deleteProductImage, type ProductImageFormState } from "@/lib/admin/product-images-actions";

const initial: ProductImageFormState = { error: null };

export function ProductImageManager({
  productId,
  images,
}: {
  productId: string;
  images: { id: string; url: string; alt: string }[];
}) {
  const [state, formAction, isPending] = useActionState(addProductImage.bind(null, productId), initial);

  return (
    <div className="space-y-4">
      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((image) => (
            <div key={image.id} className="overflow-hidden rounded-lg border border-border">
              <div className="relative aspect-square bg-secondary">
                <Image src={image.url} alt={image.alt} fill sizes="200px" className="object-cover" />
              </div>
              <form
                action={deleteProductImage.bind(null, image.id, productId, image.url)}
                onSubmit={(e) => {
                  if (!confirm("Supprimer cette image ?")) e.preventDefault();
                }}
                className="p-1.5"
              >
                <Button size="sm" variant="destructive" type="submit" className="w-full">
                  Supprimer
                </Button>
              </form>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Aucune image pour ce produit.</p>
      )}

      <form action={formAction} className="flex flex-wrap items-end gap-3 rounded-lg border border-dashed border-border p-4">
        <div>
          <Label htmlFor="product-image-file">Ajouter une image</Label>
          <input
            id="product-image-file"
            type="file"
            name="file"
            accept="image/*"
            required
            className="mt-1.5 block text-sm"
          />
        </div>
        <div>
          <Label htmlFor="product-image-alt">Texte alternatif</Label>
          <Input id="product-image-alt" name="alt" className="mt-1.5" />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Envoi…" : "Ajouter"}
        </Button>
      </form>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
    </div>
  );
}
