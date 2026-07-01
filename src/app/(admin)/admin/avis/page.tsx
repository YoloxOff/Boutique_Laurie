import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { ReviewModerationActions } from "@/components/admin/review-moderation-actions";
import { db, isDatabaseConfigured } from "@/db";

export const metadata: Metadata = { title: "Admin — Avis" };

export default async function AdminAvisPage() {
  if (!isDatabaseConfigured) {
    return (
      <div>
        <h1 className="font-heading text-2xl">Modération des avis</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Mode démo : configurez Neon (DATABASE_URL) pour modérer les avis produits réels ici.
        </p>
      </div>
    );
  }

  const reviews = await db.query.productReviews.findMany({
    with: { product: true },
    orderBy: (r, { desc }) => [desc(r.createdAt)],
  });

  return (
    <div>
      <h1 className="font-heading text-2xl">Modération des avis</h1>
      <div className="mt-6 space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {review.authorName} — {review.product?.name}
                </p>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={review.status === "approved" ? "default" : "secondary"}>{review.status}</Badge>
                <ReviewModerationActions reviewId={review.id} />
              </div>
            </div>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-sm text-muted-foreground">Aucun avis pour le moment.</p>}
      </div>
    </div>
  );
}
