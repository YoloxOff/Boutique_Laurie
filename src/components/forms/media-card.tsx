"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateMediaDetails, deleteMedia } from "@/lib/admin/media-actions";

export type MediaItem = {
  id: string;
  url: string;
  pathname: string;
  name: string;
  folder: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  sizeBytes: number;
};

export function MediaCard({ item }: { item: MediaItem }) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="relative aspect-square bg-secondary">
        <Image src={item.url} alt={item.alt || item.name} fill sizes="200px" className="object-cover" />
      </div>
      <div className="space-y-1 p-3 text-xs">
        <p className="truncate font-medium" title={item.name}>
          {item.name}
        </p>
        <p className="text-muted-foreground">
          {item.width}×{item.height} — {(item.sizeBytes / 1024).toFixed(0)} Ko
          {item.folder ? ` — ${item.folder}` : ""}
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(item.url);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? "Copié !" : "Copier l'URL"}
          </Button>
          <Button size="sm" variant="outline" onClick={() => setEditing((v) => !v)}>
            {editing ? "Fermer" : "Modifier"}
          </Button>
          <form
            action={deleteMedia.bind(null, item.id, item.pathname)}
            onSubmit={(e) => {
              if (!confirm(`Supprimer ${item.name} ?`)) e.preventDefault();
            }}
          >
            <Button size="sm" variant="destructive" type="submit">
              Supprimer
            </Button>
          </form>
        </div>
        {editing && (
          <form action={updateMediaDetails} className="mt-2 space-y-1.5 border-t border-border pt-2">
            <input type="hidden" name="id" value={item.id} />
            <Input name="name" defaultValue={item.name} placeholder="Nom" className="h-7 text-xs" />
            <Input name="folder" defaultValue={item.folder} placeholder="Dossier" className="h-7 text-xs" />
            <Input name="alt" defaultValue={item.alt} placeholder="Texte alternatif" className="h-7 text-xs" />
            <Input name="caption" defaultValue={item.caption} placeholder="Légende" className="h-7 text-xs" />
            <Button size="sm" type="submit" className="w-full">
              Enregistrer
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
