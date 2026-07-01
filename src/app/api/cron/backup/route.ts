import { NextResponse } from "next/server";
import { runBackup } from "@/lib/admin/backup";
import { db, isDatabaseConfigured } from "@/db";
import { activityLog } from "@/db/schema";
import { env } from "@/env";

// Appelé quotidiennement par Vercel Cron (voir vercel.json). Protégé par CRON_SECRET :
// https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!env.CRON_SECRET || authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDatabaseConfigured) {
    return NextResponse.json({ skipped: true, reason: "Neon non configuré" });
  }

  const summary = await runBackup();
  await db.insert(activityLog).values({
    userEmail: "system@cron",
    action: "backup.create_scheduled",
    target: summary.pathname,
  });

  return NextResponse.json({ ok: true, pathname: summary.pathname, size: summary.size });
}
