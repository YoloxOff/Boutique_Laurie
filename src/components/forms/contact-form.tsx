"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactForm, type ContactFormState } from "@/lib/contact-actions";

const initialState: ContactFormState = { success: false, message: "" };

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom</Label>
        <Input id="name" name="name" required className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" rows={5} required className="mt-1.5" />
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Envoi en cours…" : "Envoyer le message"}
      </Button>
      {state.message && (
        <p className={`text-sm ${state.success ? "text-foreground" : "text-destructive"}`}>{state.message}</p>
      )}
    </form>
  );
}
