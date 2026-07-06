"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import Cropper, { type Area } from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  updateGalleryItem,
  deleteGalleryItem,
  replaceGalleryItemImage,
  type GalleryItemFormState,
} from "@/lib/admin/gallery-actions";
import { getCroppedFile } from "@/lib/image-crop";

const initialCropState: GalleryItemFormState = { error: null };

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
  const [cropOpen, setCropOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const [cropState, replaceImageAction, isCropping] = useActionState(
    replaceGalleryItemImage.bind(null, item.id, item.imageUrl),
    initialCropState
  );

  async function confirmRecrop() {
    if (!croppedAreaPixels) return;
    const cropped = await getCroppedFile(item.imageUrl, croppedAreaPixels, "recadre.jpg");
    const fd = new FormData();
    fd.set("file", cropped);
    replaceImageAction(fd);
    setCropOpen(false);
  }

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
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          disabled={isCropping}
          onClick={() => {
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setCropOpen(true);
          }}
        >
          {isCropping ? "…" : "Recadrer"}
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
      {cropState.error && <p className="px-1.5 pb-1.5 text-xs text-destructive">{cropState.error}</p>}

      <Dialog open={cropOpen} onOpenChange={setCropOpen}>
        <DialogContent className="max-w-lg">
          <DialogTitle>Recadrer l&apos;image</DialogTitle>
          <div className="relative h-80 w-full overflow-hidden rounded-md bg-secondary">
            <Cropper
              image={item.imageUrl}
              crop={crop}
              zoom={zoom}
              aspect={3 / 4}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
            />
          </div>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="mt-3 w-full"
          />
          <div className="mt-3 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setCropOpen(false)}>
              Annuler
            </Button>
            <Button type="button" onClick={confirmRecrop}>
              Valider le recadrage
            </Button>
          </div>
        </DialogContent>
      </Dialog>
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
