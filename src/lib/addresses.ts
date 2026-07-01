import "server-only";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db, isDatabaseConfigured } from "@/db";
import { addresses } from "@/db/schema";

export async function getAddressesForCurrentUser() {
  if (!isDatabaseConfigured) return [];
  const session = await auth();
  if (!session?.user?.id) return [];
  return db.query.addresses.findMany({ where: eq(addresses.userId, session.user.id) });
}
