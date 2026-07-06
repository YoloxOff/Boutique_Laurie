"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteOwnAccount, type DeleteAccountFormState } from "@/lib/account/actions";

const initialState: DeleteAccountFormState = { error: null };

export function DeleteAccountForm({ hasPassword }: { hasPassword: boolean }) {
  const [state, formAction, isPending] = useActionState(deleteOwnAccount, initialState);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!confirm("Supprimer définitivement votre compte ? Cette action est irréversible.")) {
          e.preventDefault();
        }
      }}
      className="max-w-md space-y-4"
    >
      {hasPassword && (
        <div>
          <Label htmlFor="delete-account-password">Confirmez avec votre mot de passe</Label>
          <Input id="delete-account-password" name="password" type="password" required className="mt-1.5" />
        </div>
      )}
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" variant="destructive" disabled={isPending}>
        {isPending ? "Suppression…" : "Supprimer mon compte"}
      </Button>
    </form>
  );
}
