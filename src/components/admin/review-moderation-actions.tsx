"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { moderateReview } from "@/lib/admin/reviews-actions";

export function ReviewModerationActions({ reviewId }: { reviewId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="secondary"
        disabled={isPending}
        onClick={() => startTransition(() => moderateReview(reviewId, "approved"))}
      >
        Approuver
      </Button>
      <Button
        size="sm"
        variant="ghost"
        disabled={isPending}
        onClick={() => startTransition(() => moderateReview(reviewId, "rejected"))}
      >
        Rejeter
      </Button>
    </div>
  );
}
