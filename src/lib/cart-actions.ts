"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { and, eq, isNull } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/db";
import { cartItems, carts } from "@/db/schema";
import { getProductBySlug } from "@/lib/data/products";
import {
  CART_COOKIE,
  CART_ID_COOKIE,
  PROMO_COOKIE,
  SHIPPING_METHOD_COOKIE,
  type CartLine,
  lineKey,
  readMockCart,
} from "@/lib/cart";

async function writeMockCart(lines: CartLine[]) {
  const store = await cookies();
  store.set(CART_COOKIE, JSON.stringify(lines), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

async function getOrCreateDbCartId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(CART_ID_COOKIE)?.value;
  if (existing) return existing;

  const [cart] = await db.insert(carts).values({ sessionToken: crypto.randomUUID() }).returning();

  store.set(CART_ID_COOKIE, cart.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return cart.id;
}

export async function addToCart(productSlug: string, variantId: string | null, quantity: number) {
  const product = await getProductBySlug(productSlug);
  if (!product) throw new Error("Produit introuvable");

  const variant = variantId ? product.variants.find((v) => v.id === variantId) : null;
  const unitPrice = variant?.priceOverride ?? product.basePrice;

  if (!isDatabaseConfigured) {
    const lines = await readMockCart();
    const key = lineKey(productSlug, variantId);
    const existing = lines.find((l) => l.key === key);
    if (existing) {
      existing.quantity += quantity;
    } else {
      lines.push({
        key,
        productSlug,
        variantId,
        name: product.name + (variant ? ` — ${variant.label}` : ""),
        image: product.images[0]?.url ?? "",
        unitPrice,
        quantity,
      });
    }
    await writeMockCart(lines);
  } else {
    const cartId = await getOrCreateDbCartId();
    const existing = await db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.cartId, cartId),
        eq(cartItems.productId, product.id),
        variantId ? eq(cartItems.variantId, variantId) : isNull(cartItems.variantId)
      ),
    });
    if (existing) {
      await db.update(cartItems).set({ quantity: existing.quantity + quantity }).where(eq(cartItems.id, existing.id));
    } else {
      await db.insert(cartItems).values({
        cartId,
        productId: product.id,
        variantId: variantId ?? undefined,
        quantity,
        unitPriceSnapshot: unitPrice.toString(),
      });
    }
  }

  revalidatePath("/panier");
  revalidatePath("/", "layout");
}

export async function updateCartItemQuantity(key: string, quantity: number) {
  if (!isDatabaseConfigured) {
    const lines = await readMockCart();
    const next =
      quantity <= 0 ? lines.filter((l) => l.key !== key) : lines.map((l) => (l.key === key ? { ...l, quantity } : l));
    await writeMockCart(next);
  } else {
    const store = await cookies();
    const cartId = store.get(CART_ID_COOKIE)?.value;
    if (cartId) {
      const separatorIndex = key.lastIndexOf(":");
      const productSlug = key.slice(0, separatorIndex);
      const variantPart = key.slice(separatorIndex + 1);
      const variantId = variantPart === "default" ? null : variantPart;
      const product = await getProductBySlug(productSlug);
      if (product) {
        const existing = await db.query.cartItems.findFirst({
          where: and(
            eq(cartItems.cartId, cartId),
            eq(cartItems.productId, product.id),
            variantId ? eq(cartItems.variantId, variantId) : isNull(cartItems.variantId)
          ),
        });
        if (existing) {
          if (quantity <= 0) {
            await db.delete(cartItems).where(eq(cartItems.id, existing.id));
          } else {
            await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, existing.id));
          }
        }
      }
    }
  }
  revalidatePath("/panier");
  revalidatePath("/", "layout");
}

export async function removeFromCart(key: string) {
  await updateCartItemQuantity(key, 0);
}

export async function clearCart() {
  if (!isDatabaseConfigured) {
    await writeMockCart([]);
  } else {
    const store = await cookies();
    const cartId = store.get(CART_ID_COOKIE)?.value;
    if (cartId) {
      await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
    }
  }
  revalidatePath("/panier");
  revalidatePath("/", "layout");
}

export async function applyPromoCode(code: string) {
  const store = await cookies();
  if (!code.trim()) {
    store.delete(PROMO_COOKIE);
  } else {
    store.set(PROMO_COOKIE, code.trim().toUpperCase(), { path: "/", maxAge: 60 * 60 * 24 });
  }
  revalidatePath("/panier");
}

export async function setShippingMethod(method: string) {
  const store = await cookies();
  store.set(SHIPPING_METHOD_COOKIE, method, { path: "/", maxAge: 60 * 60 * 24 });
  revalidatePath("/panier");
}
