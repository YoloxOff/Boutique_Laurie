"use server";

import { cookies } from "next/headers";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db, isDatabaseConfigured } from "@/db";
import { wishlistItems, products } from "@/db/schema";

const WISHLIST_COOKIE = "wishlist";

export async function toggleWishlist(productSlug: string) {
  if (!isDatabaseConfigured) {
    const store = await cookies();
    const raw = store.get(WISHLIST_COOKIE)?.value;
    const current: string[] = raw ? JSON.parse(raw) : [];
    const next = current.includes(productSlug)
      ? current.filter((s) => s !== productSlug)
      : [...current, productSlug];
    store.set(WISHLIST_COOKIE, JSON.stringify(next), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 90,
    });
    revalidatePath("/compte/favoris");
    return;
  }

  const session = await auth();
  if (!session?.user?.id) return;

  const product = await db.query.products.findFirst({ where: eq(products.slug, productSlug) });
  if (!product) return;

  const existing = await db.query.wishlistItems.findFirst({
    where: and(eq(wishlistItems.userId, session.user.id), eq(wishlistItems.productId, product.id)),
  });

  if (existing) {
    await db
      .delete(wishlistItems)
      .where(and(eq(wishlistItems.userId, session.user.id), eq(wishlistItems.productId, product.id)));
  } else {
    await db.insert(wishlistItems).values({ userId: session.user.id, productId: product.id });
  }

  revalidatePath("/compte/favoris");
}
