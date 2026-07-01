import type { Metadata } from "next";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReviewModerationActions } from "@/components/admin/review-moderation-actions";
import { db, isDatabaseConfigured } from "@/db";
import { productReviews } from "@/db/schema";
import { assertPagePermission } from "@/lib/admin/permissions";
import { bulkModerateReviews, bulkDeleteReviews } from "@/lib/admin/reviews-actions";

export const metadata: Metadata = { title: "Admin — Avis" };

const STATUSES = [
  { value: "", label: "Tous" },
  { value: "pending", label: "En attente" },
  { value: "approved", label: "Approuvés" },
  { value: "rejected", label: "Refusés" },
] as const;

export default async function AdminAvisPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await assertPagePermission("reviews");
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

  const { status = "" } = await searchParams;
  const validStatus = ["pending", "approved", "rejected"].includes(status) ? status : undefined;

  const reviews = await db.query.productReviews.findMany({
    where: validStatus ? eq(productReviews.status, validStatus as "pending" | "approved" | "rejected") : undefined,
    with: { product: true },
    orderBy: (r, { desc }) => [desc(r.createdAt)],
  });

  return (
    <div>
      <h1 className="font-heading text-2xl">Modération des avis</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <Button
            key={s.value}
            size="sm"
            variant={status === s.value ? "default" : "outline"}
            render={<Link href={`/admin/avis${s.value ? `?status=${s.value}` : ""}`} />}
          >
            {s.label}
          </Button>
        ))}
      </div>

      <form>
        <div className="mt-4 flex gap-2">
          <Button size="sm" variant="outline" type="submit" formAction={bulkModerateReviews.bind(null, "approved")}>
            Approuver la sélection
          </Button>
          <Button size="sm" variant="outline" type="submit" formAction={bulkModerateReviews.bind(null, "rejected")}>
            Refuser la sélection
          </Button>
          <Button size="sm" variant="destructive" type="submit" formAction={bulkDeleteReviews}>
            Supprimer la sélection
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="flex gap-3 rounded-xl border border-border p-4">
              <input type="checkbox" name="ids" value={review.id} className="mt-1 size-4 shrink-0 rounded border-border" />
              <div className="flex flex-1 items-center justify-between">
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
      </form>
    </div>
  );
}
