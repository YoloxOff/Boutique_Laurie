import { NextResponse } from "next/server";
import { env } from "@/env";
import { getAllProducts } from "@/lib/data/products";

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!);
}

/**
 * Flux produits au format Google Merchant Center / Google Shopping (RSS 2.0).
 * A soumettre dans Google Merchant Center une fois le compte créé (cf. .env.example).
 */
export async function GET() {
  const products = await getAllProducts();

  const items = products
    .map(
      (p) => `
    <item>
      <g:id>${escapeXml(p.slug)}</g:id>
      <title>${escapeXml(p.name)}</title>
      <description>${escapeXml(p.shortDescription)}</description>
      <link>${env.NEXT_PUBLIC_SITE_URL}/boutique/produit/${p.slug}</link>
      <g:image_link>${escapeXml(p.image?.url ?? "")}</g:image_link>
      <g:brand>${escapeXml(p.brandSlug.replace(/-/g, " "))}</g:brand>
      <g:condition>new</g:condition>
      <g:availability>in stock</g:availability>
      <g:price>${p.basePrice.toFixed(2)} EUR</g:price>
      <g:google_product_category>Health &amp; Beauty &gt; Personal Care &gt; Hair Care</g:google_product_category>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${env.NEXT_PUBLIC_SITE_NAME} — Boutique</title>
    <link>${env.NEXT_PUBLIC_SITE_URL}/boutique</link>
    <description>Flux produits Google Shopping / Merchant Center</description>${items}
  </channel>
</rss>`;

  return new NextResponse(xml, { headers: { "Content-Type": "application/xml" } });
}
