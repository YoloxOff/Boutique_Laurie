import "server-only";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/db";
import { cartItems } from "@/db/schema";

export const CART_COOKIE = "cart_items"; // mode mock : contenu du panier stocké directement (JSON)
export const CART_ID_COOKIE = "cart_id"; // mode DB : identifiant du panier serveur
export const PROMO_COOKIE = "promo_code";
export const SHIPPING_METHOD_COOKIE = "shipping_method";

export type CartLine = {
  key: string; // `${productSlug}:${variantId ?? "default"}`
  productSlug: string;
  variantId: string | null;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
};

export function lineKey(productSlug: string, variantId: string | null) {
  return `${productSlug}:${variantId ?? "default"}`;
}

export async function readMockCart(): Promise<CartLine[]> {
  const store = await cookies();
  const raw = store.get(CART_COOKIE)?.value;
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CartLine[];
  } catch {
    return [];
  }
}

export async function getCart(): Promise<CartLine[]> {
  if (!isDatabaseConfigured) return readMockCart();

  const store = await cookies();
  const cartId = store.get(CART_ID_COOKIE)?.value;
  if (!cartId) return [];

  try {
    const rows = await db.query.cartItems.findMany({
      where: eq(cartItems.cartId, cartId),
      with: { product: { with: { images: true } }, variant: true },
    });
    return rows.map((r) => ({
      key: lineKey(r.product.slug, r.variantId),
      productSlug: r.product.slug,
      variantId: r.variantId,
      name: r.product.name + (r.variant ? ` — ${r.variant.label}` : ""),
      image: r.product.images[0]?.url ?? "",
      unitPrice: Number(r.unitPriceSnapshot),
      quantity: r.quantity,
    }));
  } catch {
    return [];
  }
}

export async function getCartItemCount(): Promise<number> {
  const lines = await getCart();
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}

export async function getCartSubtotal(): Promise<number> {
  const lines = await getCart();
  return lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0);
}

export async function getSelectedPromoCode(): Promise<string | null> {
  const store = await cookies();
  return store.get(PROMO_COOKIE)?.value ?? null;
}

export async function getSelectedShippingMethod(): Promise<
  "click_collect" | "domicile" | "mondial_relay" | "colissimo"
> {
  const store = await cookies();
  const value = store.get(SHIPPING_METHOD_COOKIE)?.value;
  if (value === "domicile" || value === "mondial_relay" || value === "colissimo") return value;
  return "click_collect";
}
