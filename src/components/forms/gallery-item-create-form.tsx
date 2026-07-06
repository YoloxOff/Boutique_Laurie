"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addGalleryItem, type GalleryItemFormState } from "@/lib/admin/gallery-actions";

const initial: GalleryItemFormState = { error: null };

export function GalleryItemCreateForm() {
  const [state, formAction, isPending] = useActionState(addGalleryItem, initial);
  const [type, setType] = useState("photo");

  return (
    <form action={formAction} className="grid max-w-2xl gap-4 rounded-lg border border-border p-4 sm:grid-cols-2">
      <div>
        <Label htmlFor="gallery-title">Titre</Label>
        <Input id="gallery-title" name="title" className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="gallery-category">Catégorie</Label>
        <select
          id="gallery-category"
          name="category"
          required
          className="mt-1.5 flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm"
        >
          <option value="Mariage">Mariage</option>
          <option value="Quotidien">Quotidien</option>
        </select>
      </div>
      <div>
        <Label htmlFor="gallery-type">Type</Label>
        <select
          id="gallery-type"
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-1.5 flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm"
        >
          <option value="photo">Photo</option>
          <option value="avant-apres">Avant / après</option>
          <option value="video">Vidéo</option>
        </select>
      </div>
      {type === "video" && (
        <div>
          <Label htmlFor="gallery-video-url">URL de la vidéo</Label>
          <Input id="gallery-video-url" name="videoUrl" type="url" className="mt-1.5" />
        </div>
      )}
      <div>
        <Label htmlFor="gallery-file">{type === "avant-apres" ? "Photo (avant)" : "Photo"}</Label>
        <input id="gallery-file" type="file" name="file" accept="image/*" required className="mt-1.5 block text-sm" />
      </div>
      {type === "avant-apres" && (
        <div>
          <Label htmlFor="gallery-file-after">Photo (après)</Label>
          <input id="gallery-file-after" type="file" name="fileAfter" accept="image/*" className="mt-1.5 block text-sm" />
        </div>
      )}

      {state.error && <p className="sm:col-span-2 text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={isPending} className="sm:col-span-2">
        {isPending ? "Envoi…" : "Ajouter la réalisation"}
      </Button>
    </form>
  );
}
