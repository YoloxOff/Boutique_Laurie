"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createPromoCode, type PromoFormState } from "@/lib/admin/promo-actions";

const initialState: PromoFormState = { error: null };

export function PromoCodeCreateForm() {
  const [state, formAction, isPending] = useActionState(createPromoCode, initialState);
  const [type, setType] = useState("percentage");

  return (
    <form action={formAction} className="grid max-w-xl gap-4 sm:grid-cols-3">
      <div>
        <Label htmlFor="code">Code</Label>
        <Input id="code" name="code" required className="mt-1.5 uppercase" />
      </div>
      <div>
        <Label htmlFor="type-select">Type</Label>
        <Select value={type} onValueChange={(v) => setType(v ?? "percentage")}>
          <SelectTrigger id="type-select" className="mt-1.5 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentage">Pourcentage</SelectItem>
            <SelectItem value="fixed">Montant fixe</SelectItem>
            <SelectItem value="free_shipping">Livraison offerte</SelectItem>
          </SelectContent>
        </Select>
        <input type="hidden" name="type" value={type} />
      </div>
      <div>
        <Label htmlFor="value">Valeur</Label>
        <Input id="value" name="value" type="number" step="0.01" defaultValue={0} className="mt-1.5" />
      </div>
      {state.error && <p className="sm:col-span-3 text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={isPending} className="sm:col-span-3">
        {isPending ? "Création…" : "Créer le code promo"}
      </Button>
    </form>
  );
}
