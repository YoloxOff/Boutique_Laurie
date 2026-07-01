import "server-only";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db, isDatabaseConfigured } from "@/db";
import { wishlistItems } from "@/db/schema";

const WISHLIST_COOKIE = "wishlist";

async function readMockWishlist(): Promise<string[]> {
  const store = await cookies();
  const raw = store.get(WISHLIST_COOKIE)?.value;
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export async function getWishlistSlugs(): Promise<string[]> {
  if (!isDatabaseConfigured) return readMockWishlist();

  const session = await auth();
  if (!session?.user) return readMockWishlist();

  try {
    const rows = await db.query.wishlistItems.findMany({
      where: eq(wishlistItems.userId, session.user.id ?? ""),
      with: { product: true },
    });
    return rows.map((r) => r.product?.slug).filter((s): s is string => Boolean(s));
  } catch {
    return [];
  }
}

export async function isInWishlist(productSlug: string): Promise<boolean> {
  const slugs = await getWishlistSlugs();
  return slugs.includes(productSlug);
}
