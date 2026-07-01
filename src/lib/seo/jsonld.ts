import { env } from "@/env";
import { mockSiteSettings } from "@/lib/mock/content";

const siteUrl = env.NEXT_PUBLIC_SITE_URL;

export function jsonLdLocalBusiness() {
  return {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: env.NEXT_PUBLIC_SITE_NAME,
    image: `${siteUrl}/images/salon-exterieur.jpg`,
    url: siteUrl,
    telephone: mockSiteSettings.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: mockSiteSettings.address,
      addressCountry: "FR",
    },
    sameAs: [mockSiteSettings.instagram, mockSiteSettings.facebook].filter(Boolean),
  };
}

export function jsonLdBreadcrumb(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };
}

export function jsonLdProduct(product: {
  name: string;
  description: string;
  slug: string;
  brandName: string;
  sku: string;
  basePrice: number;
  imageUrl?: string;
  inStock: boolean;
  ratingValue?: number;
  reviewCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: product.imageUrl,
    brand: { "@type": "Brand", name: product.brandName },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/boutique/produit/${product.slug}`,
      priceCurrency: "EUR",
      price: product.basePrice,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    ...(product.reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.ratingValue,
            reviewCount: product.reviewCount,
          },
        }
      : {}),
  };
}

export function jsonLdFaqPage(faq: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
