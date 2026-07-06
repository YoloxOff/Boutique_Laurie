"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { updateGalleryItem, deleteGalleryItem } from "@/lib/admin/gallery-actions";

type GalleryItemCardProps = {
  item: {
    id: string;
    title: string;
    category: string;
    type: string;
    imageUrl: string;
    imageAfterUrl: string | null;
    videoUrl: string | null;
  };
};

export function GalleryItemCard({ item }: GalleryItemCardProps) {
  const [editing, setEditing] = useState(false);
  const [type, setType] = useState(item.type);

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="relative aspect-square bg-secondary">
        <Image src={item.imageUrl} alt={item.title || item.category} fill sizes="200px" className="object-cover" />
      </div>
      <div className="space-y-1 p-2 text-xs text-muted-foreground">
        <p className="truncate font-medium text-foreground">{item.title || "(sans titre)"}</p>
        <p>{item.category}</p>
      </div>
      <div className="flex gap-1.5 p-1.5 pt-0">
        <Button size="sm" variant="outline" className="flex-1" onClick={() => setEditing((v) => !v)}>
          {editing ? "Fermer" : "Modifier"}
        </Button>
        <form
          action={deleteGalleryItem.bind(null, item.id, item.imageUrl, item.imageAfterUrl)}
          onSubmit={(e) => {
            if (!confirm("Supprimer cette réalisation ?")) e.preventDefault();
          }}
        >
          <Button size="sm" variant="destructive" type="submit">
            Supprimer
          </Button>
        </form>
      </div>
      {editing && (
        <form action={updateGalleryItem} className="space-y-2 border-t border-border p-2">
          <input type="hidden" name="id" value={item.id} />
          <input
            name="title"
            defaultValue={item.title}
            placeholder="Titre"
            className="w-full rounded-md border border-border bg-background px-2 py-1 text-xs"
          />
          <select
            name="category"
            defaultValue={item.category}
            className="w-full rounded-md border border-border bg-background px-2 py-1 text-xs"
          >
            <option value="Mariage">Mariage</option>
            <option value="Quotidien">Quotidien</option>
          </select>
          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-2 py-1 text-xs"
          >
            <option value="photo">Photo</option>
            <option value="avant-apres">Avant / après</option>
            <option value="video">Vidéo</option>
          </select>
          {type === "video" && (
            <input
              name="videoUrl"
              type="url"
              defaultValue={item.videoUrl ?? ""}
              placeholder="URL de la vidéo"
              className="w-full rounded-md border border-border bg-background px-2 py-1 text-xs"
            />
          )}
          <Button size="sm" type="submit" className="w-full">
            Enregistrer
          </Button>
        </form>
      )}
    </div>
  );
}
