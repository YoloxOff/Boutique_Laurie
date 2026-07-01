import type { Metadata } from "next";
import { Star } from "lucide-react";
import { SectionHeading } from "@/components/sections/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { getTestimonials } from "@/lib/content/gallery";
import { getAllProducts, getProductBySlug } from "@/lib/data/products";
import { env } from "@/env";

export const metadata: Metadata = {
  title: "Avis clients",
  description: "Découvrez les avis de nos clientes et clients sur le salon Laurie Coiffure et nos produits.",
};

export default async function AvisPage() {
  const testimonials = await getTestimonials();
  const products = await getAllProducts();
  const productReviews = (
    await Promise.all(products.map((p) => getProductBySlug(p.slug)))
  )
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .flatMap((p) => p.reviews.map((r) => ({ ...r, productName: p.name })));

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Ce qu'on dit de nous" title="Avis clients" />

      {env.NEXT_PUBLIC_GOOGLE_PLACE_ID ? (
        <div className="mt-10 rounded-xl border border-border p-6 text-center text-sm text-muted-foreground">
          Widget d&apos;avis Google Maps (nécessite NEXT_PUBLIC_GOOGLE_MAPS_API_KEY et
          NEXT_PUBLIC_GOOGLE_PLACE_ID configurés).
        </div>
      ) : (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Les avis Google seront affichés ici une fois la clé Google Places configurée.
        </p>
      )}

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {testimonials.map((t, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex gap-0.5 text-accent">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="size-4" fill={idx < t.rating ? "currentColor" : "none"} />
                ))}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">&laquo; {t.comment} &raquo;</p>
              <p className="mt-4 text-sm font-medium">{t.author}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {productReviews.length > 0 && (
        <div className="mt-16">
          <h2 className="font-heading text-2xl">Avis produits</h2>
          <div className="mt-6 space-y-4">
            {productReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{review.title || review.productName}</p>
                    <div className="flex gap-0.5 text-accent">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} className="size-3.5" fill={idx < review.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {review.authorName} — {review.productName}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
