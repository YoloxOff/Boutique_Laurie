import "server-only";
import { headers } from "next/headers";
import { db, isDatabaseConfigured } from "@/db";
import { activityLog } from "@/db/schema";

type SessionLike = { user?: { id?: string; email?: string | null } | null } | null;

export async function logActivity(session: SessionLike, action: string, target?: string) {
  if (!isDatabaseConfigured || !session?.user?.email) return;

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? null;

  await db.insert(activityLog).values({
    userId: session.user.id ?? null,
    userEmail: session.user.email,
    action,
    target: target ?? null,
    ip,
  });
}
