"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { confirmTwoFactorSetup, type TwoFactorFormState } from "@/lib/admin/two-factor-actions";

const initial: TwoFactorFormState = { error: null };

export function TwoFactorSetupForm({ secret, qrCodeDataUrl }: { secret: string; qrCodeDataUrl: string }) {
  const [state, formAction, isPending] = useActionState(confirmTwoFactorSetup, initial);

  return (
    <div className="space-y-4">
      {/* eslint-disable-next-line @next/next/no-img-element -- data URI, pas une image next/image */}
      <img src={qrCodeDataUrl} alt="QR code d'activation 2FA" className="size-48 rounded-md border border-border" />
      <p className="text-xs text-muted-foreground">
        Ou saisissez manuellement cette clé dans votre application d&apos;authentification (Google
        Authenticator, Authy…) : <code className="font-mono">{secret}</code>
      </p>
      <form action={formAction} className="flex items-end gap-2">
        <input type="hidden" name="secret" value={secret} />
        <div>
          <Label htmlFor="2fa-code">Code à 6 chiffres</Label>
          <Input id="2fa-code" name="code" inputMode="numeric" required className="mt-1.5 w-32" />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Vérification…" : "Activer"}
        </Button>
      </form>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.success && <p className="text-sm text-foreground">Double authentification activée.</p>}
    </div>
  );
}
