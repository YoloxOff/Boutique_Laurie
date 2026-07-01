import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { requirePermission } from "@/lib/admin/permissions";
import { db, isDatabaseConfigured } from "@/db";
import { users } from "@/db/schema";
import { toCsv, csvResponse } from "@/lib/admin/csv";

export async function GET() {
  await requirePermission("customers");

  if (!isDatabaseConfigured) {
    return NextResponse.json({ message: "Neon non configuré" }, { status: 503 });
  }

  const clients = await db.query.users.findMany({ where: eq(users.role, "customer") });
  const csv = toCsv(
    ["nom", "email", "telephone", "statut", "inscrit_le"],
    clients.map((c) => [
      c.name ?? "",
      c.email,
      c.phone ?? "",
      c.suspendedAt ? "bloqué" : "actif",
      c.createdAt.toISOString(),
    ])
  );

  return csvResponse("clients.csv", csv);
}
