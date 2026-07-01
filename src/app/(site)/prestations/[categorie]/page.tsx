import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BoutonRdv } from "@/components/layout/bouton-rdv";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { getAllServices, getServiceBySlug } from "@/lib/content/services";
import { jsonLdBreadcrumb, jsonLdFaqPage } from "@/lib/seo/jsonld";

export async function generateStaticParams() {
  const services = await getAllServices();
  return services.map((s) => ({ categorie: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorie: string }>;
}): Promise<Metadata> {
  const { categorie } = await params;
  const service = await getServiceBySlug(categorie);
  if (!service) return {};
  return {
    title: service.name,
    description: service.description,
  };
}

export default async function PrestationPage({
  params,
}: {
  params: Promise<{ categorie: string }>;
}) {
  const { categorie } = await params;
  const service = await getServiceBySlug(categorie);
  if (!service) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {service.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaqPage(service.faq)) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            jsonLdBreadcrumb([
              { name: "Accueil", url: "/" },
              { name: "Prestations", url: "/prestations" },
              { name: service.name, url: `/prestations/${service.slug}` },
            ])
          ),
        }}
      />

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/prestations">Prestations</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{service.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
          <Image src={service.image} alt={service.name} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl">{service.name}</h1>
          <div className="mt-4 flex gap-6 text-sm text-muted-foreground">
            <span>Durée : {service.duration}</span>
            <span>Prix : {service.price}</span>
          </div>
          <p className="mt-6 text-muted-foreground">{service.description}</p>

          {service.benefits.length > 0 && (
            <ul className="mt-6 space-y-2">
              {service.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                  {benefit}
                </li>
              ))}
            </ul>
          )}

          <BoutonRdv className="mt-8" />
        </div>
      </div>

      {service.faq.length > 0 && (
        <div className="mt-16">
          <h2 className="font-heading text-2xl">Questions fréquentes</h2>
          <Accordion className="mt-6">
            {service.faq.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}
