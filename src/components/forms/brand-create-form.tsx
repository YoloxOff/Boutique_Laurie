"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBrand, type BrandFormState } from "@/lib/admin/brands-actions";

const initial: BrandFormState = { error: null };

export function BrandCreateForm() {
  const [state, formAction, isPending] = useActionState(createBrand, initial);

  return (
    <form action={formAction} className="max-w-md space-y-3">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <Label htmlFor="brand-name">Nom de la marque</Label>
          <Input id="brand-name" name="name" required className="mt-1.5" />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Ajout…" : "Ajouter"}
        </Button>
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
    </form>
  );
}
