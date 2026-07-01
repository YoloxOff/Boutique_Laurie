"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { subscribeToNewsletter } from "@/lib/marketing-actions";

export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const result = await subscribeToNewsletter(email);
          setStatus(result.success ? "success" : "error");
          if (result.success) setEmail("");
        });
      }}
    >
      <div className="flex gap-2">
        <Input
          type="email"
          required
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-background"
        />
        <Button type="submit" disabled={isPending}>
          S&apos;inscrire
        </Button>
      </div>
      {status === "success" && (
        <p className="mt-2 text-xs text-muted-foreground">
          Merci ! Votre code de réduction -10% arrive par email.
        </p>
      )}
      {status === "error" && (
        <p className="mt-2 text-xs text-destructive">Une erreur est survenue, réessayez.</p>
      )}
    </form>
  );
}
