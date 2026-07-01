"use client";

import { useOptimistic, useTransition } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleWishlist } from "@/lib/wishlist-actions";

export function WishlistButton({
  productSlug,
  initialActive,
  className,
}: {
  productSlug: string;
  initialActive: boolean;
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [active, setOptimisticActive] = useOptimistic(initialActive);

  return (
    <button
      type="button"
      aria-label={active ? "Retirer des favoris" : "Ajouter aux favoris"}
      disabled={isPending}
      onClick={(e) => {
        e.preventDefault();
        startTransition(async () => {
          setOptimisticActive(!active);
          await toggleWishlist(productSlug);
        });
      }}
      className={cn(
        "flex size-9 items-center justify-center rounded-full bg-background/90 shadow-sm transition-colors hover:bg-background",
        className
      )}
    >
      <Heart className={cn("size-4", active && "fill-accent text-accent")} />
    </button>
  );
}
