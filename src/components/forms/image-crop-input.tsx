"use client";

import { useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getCroppedFile } from "@/lib/image-crop";

export function ImageCropInput({
  name,
  label,
  required,
  aspect = 3 / 4,
}: {
  name: string;
  label: string;
  required?: boolean;
  aspect?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [rawImageUrl, setRawImageUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [fileName, setFileName] = useState("image.jpg");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setRawImageUrl(URL.createObjectURL(file));
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }

  async function confirmCrop() {
    if (!rawImageUrl || !croppedAreaPixels || !inputRef.current) return;

    const cropped = await getCroppedFile(rawImageUrl, croppedAreaPixels, fileName);
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(cropped);
    inputRef.current.files = dataTransfer.files;

    setPreviewUrl(URL.createObjectURL(cropped));
    setRawImageUrl(null);
  }

  function cancelCrop() {
    setRawImageUrl(null);
    if (!previewUrl && inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div className="mt-1.5 flex items-center gap-3">
        {previewUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="Aperçu" className="size-16 rounded-md border border-border object-cover" />
        )}
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept="image/*"
          required={required}
          onChange={handleFileChange}
          className="block text-sm"
        />
      </div>

      <Dialog open={rawImageUrl !== null} onOpenChange={(open) => !open && cancelCrop()}>
        <DialogContent className="max-w-lg">
          <DialogTitle>Recadrer l&apos;image</DialogTitle>
          <div className="relative h-80 w-full overflow-hidden rounded-md bg-secondary">
            {rawImageUrl && (
              <Cropper
                image={rawImageUrl}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
              />
            )}
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
            <Button type="button" variant="outline" onClick={cancelCrop}>
              Annuler
            </Button>
            <Button type="button" onClick={confirmCrop}>
              Valider le recadrage
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
