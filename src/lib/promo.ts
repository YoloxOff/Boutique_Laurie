import { eq } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/db";
import { promoCodes } from "@/db/schema";

export type PromoResult = {
  code: string;
  type: "percentage" | "fixed" | "free_shipping";
  value: number;
};

const MOCK_PROMO_CODES: Record<string, PromoResult> = {
  BIENVENUE10: { code: "BIENVENUE10", type: "percentage", value: 10 },
  LIVRAISON: { code: "LIVRAISON", type: "free_shipping", value: 0 },
};

export async function validatePromoCode(code: string): Promise<PromoResult | null> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return null;

  if (!isDatabaseConfigured) {
    return MOCK_PROMO_CODES[normalized] ?? null;
  }

  try {
    const row = await db.query.promoCodes.findFirst({ where: eq(promoCodes.code, normalized) });
    if (!row || !row.active) return null;
    return { code: row.code, type: row.type, value: Number(row.value) };
  } catch {
    return MOCK_PROMO_CODES[normalized] ?? null;
  }
}

export function computeDiscount(promo: PromoResult | null, subtotal: number): number {
  if (!promo) return 0;
  if (promo.type === "percentage") return Math.round(subtotal * (promo.value / 100) * 100) / 100;
  if (promo.type === "fixed") return Math.min(promo.value, subtotal);
  return 0; // free_shipping traité séparément sur les frais de port
}
