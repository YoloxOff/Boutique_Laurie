"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addAddress, type AddressFormState } from "@/lib/addresses-actions";

const initialState: AddressFormState = { error: null };

export function AddressForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, formAction, isPending] = useActionState(addAddress, initialState);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      {callbackUrl && <input type="hidden" name="callbackUrl" value={callbackUrl} />}
      <div className="sm:col-span-2">
        <Label htmlFor="fullName">Nom complet</Label>
        <Input id="fullName" name="fullName" required className="mt-1.5" />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input id="phone" name="phone" type="tel" required className="mt-1.5" />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="line1">Adresse</Label>
        <Input id="line1" name="line1" required className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="postalCode">Code postal</Label>
        <Input id="postalCode" name="postalCode" required className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="city">Ville</Label>
        <Input id="city" name="city" required className="mt-1.5" />
      </div>
      {state.error && <p className="sm:col-span-2 text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={isPending} className="sm:col-span-2">
        {isPending ? "Ajout…" : "Ajouter cette adresse"}
      </Button>
    </form>
  );
}
