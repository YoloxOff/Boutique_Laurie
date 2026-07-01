"use client";

import { useActionState, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  createManualBackup,
  restoreFromBackup,
  deleteBackupAction,
  type BackupActionState,
} from "@/lib/admin/backup-actions";

const initial: BackupActionState = { error: null };

export function CreateBackupButton() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: BackupActionState) => createManualBackup(),
    initial
  );

  return (
    <form action={formAction}>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Sauvegarde en cours…" : "Créer une sauvegarde maintenant"}
      </Button>
      {state.error && <p className="mt-2 text-sm text-destructive">{state.error}</p>}
      {state.message && <p className="mt-2 text-sm text-foreground">{state.message}</p>}
    </form>
  );
}

export function BackupRowActions({ pathname }: { pathname: string }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ error: boolean; text: string } | null>(null);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        disabled={isPending}
        onClick={() => {
          if (!confirm("Restaurer cette sauvegarde ? Les données seront réinjectées (fusion, rien n'est supprimé).")) return;
          startTransition(async () => {
            const result = await restoreFromBackup(pathname);
            setMessage(
              result.error ? { error: true, text: result.error } : { error: false, text: result.message ?? "Restauré." }
            );
          });
        }}
      >
        Restaurer
      </Button>
      <form
        action={deleteBackupAction.bind(null, pathname)}
        onSubmit={(e) => {
          if (!confirm("Supprimer définitivement cette sauvegarde ?")) e.preventDefault();
        }}
      >
        <Button size="sm" variant="destructive" type="submit">
          Supprimer
        </Button>
      </form>
      {message && (
        <span className={`text-xs ${message.error ? "text-destructive" : "text-muted-foreground"}`}>
          {message.text}
        </span>
      )}
    </div>
  );
}
