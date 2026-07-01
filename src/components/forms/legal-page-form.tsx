"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateLegalPage, type SettingsFormState } from "@/lib/admin/settings-actions";

const initial: SettingsFormState = { error: null };

export function LegalPageForm({
  pageKey,
  title,
  content,
}: {
  pageKey: string;
  title: string;
  content: string;
}) {
  const [state, formAction, isPending] = useActionState(updateLegalPage, initial);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="key" value={pageKey} />
      <div>
        <Label htmlFor={`title-${pageKey}`}>Titre</Label>
        <Input id={`title-${pageKey}`} name="title" defaultValue={title} className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor={`content-${pageKey}`}>Contenu</Label>
        <Textarea id={`content-${pageKey}`} name="content" rows={8} defaultValue={content} className="mt-1.5" />
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.success && <p className="text-sm text-foreground">Page enregistrée.</p>}
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "Enregistrement…" : "Enregistrer"}
      </Button>
    </form>
  );
}
