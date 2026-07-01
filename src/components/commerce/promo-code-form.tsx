"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { applyPromoCode } from "@/lib/cart-actions";

export function PromoCodeForm({ appliedCode }: { appliedCode: string | null }) {
  const [code, setCode] = useState(appliedCode ?? "");
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(() => applyPromoCode(code));
      }}
    >
      <Input
        placeholder="Code promo"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="uppercase"
      />
      <Button type="submit" variant="secondary" disabled={isPending}>
        Appliquer
      </Button>
    </form>
  );
}
