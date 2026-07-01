"use client";

import { useActionState, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadMedia, type MediaFormState } from "@/lib/admin/media-actions";

const initial: MediaFormState = { error: null };

export function MediaUploadForm({ currentFolder }: { currentFolder: string }) {
  const [state, formAction, isPending] = useActionState(uploadMedia, initial);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <form action={formAction} className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file && fileInputRef.current) {
            const dt = new DataTransfer();
            dt.items.add(file);
            fileInputRef.current.files = dt.files;
            setFileName(file.name);
          }
        }}
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center text-sm transition-colors ${
          dragOver ? "border-primary bg-secondary/40" : "border-border"
        }`}
      >
        <p className="text-muted-foreground">Glissez-déposez une image ici, ou</p>
        <label className="mt-2 cursor-pointer text-sm font-medium underline underline-offset-4">
          choisissez un fichier
          <input
            ref={fileInputRef}
            type="file"
            name="file"
            accept="image/*"
            required
            className="sr-only"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          />
        </label>
        {fileName && <p className="mt-2 text-xs text-foreground">{fileName}</p>}
        <p className="mt-2 text-xs text-muted-foreground">
          JPEG/PNG/WebP, 15 Mo max — converti automatiquement en WebP et compressé.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <Label htmlFor="media-folder">Dossier</Label>
          <Input id="media-folder" name="folder" defaultValue={currentFolder} placeholder="produits, galerie…" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="media-name">Nom personnalisé</Label>
          <Input id="media-name" name="name" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="media-alt">Texte alternatif (SEO)</Label>
          <Input id="media-alt" name="alt" className="mt-1.5" />
        </div>
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.success && <p className="text-sm text-foreground">Image ajoutée.</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Envoi…" : "Envoyer"}
      </Button>
    </form>
  );
}
