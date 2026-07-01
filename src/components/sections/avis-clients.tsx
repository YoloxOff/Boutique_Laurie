import { Star } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { getTestimonials } from "@/lib/content/gallery";

export async function AvisClients() {
  const testimonials = await getTestimonials();

  return (
    <section className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Ils témoignent" title="Avis clients" />
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {testimonials.map((t, i) => (
            <Card key={i} className="border-none bg-background">
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
      </div>
    </section>
  );
}
