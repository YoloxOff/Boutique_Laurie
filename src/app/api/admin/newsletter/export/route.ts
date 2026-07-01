import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin/permissions";
import { db, isDatabaseConfigured } from "@/db";

export async function GET() {
  await requirePermission("newsletter");

  if (!isDatabaseConfigured) {
    return NextResponse.json({ message: "Neon non configuré" }, { status: 503 });
  }

  const subscribers = await db.query.newsletterSubscribers.findMany();
  const csv = ["email,inscrit_le,actif", ...subscribers.map((s) => `${s.email},${s.consentAt.toISOString()},${s.active}`)].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=newsletter.csv",
    },
  });
}
