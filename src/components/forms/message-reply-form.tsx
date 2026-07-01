"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { replyToMessage, type ReplyFormState } from "@/lib/admin/messages-actions";

const initial: ReplyFormState = { error: null };

export function MessageReplyForm({ id, email }: { id: string; email: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(replyToMessage, initial);

  if (!open) {
    return (
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        Répondre
      </Button>
    );
  }

  return (
    <form action={formAction} className="mt-3 space-y-2">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="email" value={email} />
      <Textarea name="reply" rows={4} placeholder={`Votre réponse à ${email}…`} required />
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Envoi…" : "Envoyer la réponse"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
