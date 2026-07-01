"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerCustomer, type RegisterFormState } from "@/lib/auth-actions";

const initialState: RegisterFormState = { error: null, success: false };

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerCustomer, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="register-name">Nom</Label>
        <Input id="register-name" name="name" required className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="register-email">Email</Label>
        <Input id="register-email" name="email" type="email" required className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="register-password">Mot de passe</Label>
        <Input id="register-password" name="password" type="password" required minLength={8} className="mt-1.5" />
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Création…" : "Créer mon compte"}
      </Button>
    </form>
  );
}
