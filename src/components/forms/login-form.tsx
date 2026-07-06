"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authenticate, type AuthFormState } from "@/lib/auth-actions";

const initialState: AuthFormState = { error: null };

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction, isPending] = useActionState(authenticate, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div>
        <Label htmlFor="login-email">Email</Label>
        <Input id="login-email" name="email" type="email" required className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="login-password">Mot de passe</Label>
        <Input id="login-password" name="password" type="password" required className="mt-1.5" />
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Connexion…" : "Se connecter"}
      </Button>
    </form>
  );
}
