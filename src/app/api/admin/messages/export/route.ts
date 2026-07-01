import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin/permissions";
import { db, isDatabaseConfigured } from "@/db";
import { toCsv, csvResponse } from "@/lib/admin/csv";

export async function GET() {
  await requirePermission("messages");

  if (!isDatabaseConfigured) {
    return NextResponse.json({ message: "Neon non configuré" }, { status: 503 });
  }

  const messages = await db.query.contactMessages.findMany({
    orderBy: (m, { desc }) => [desc(m.createdAt)],
  });
  const csv = toCsv(
    ["nom", "email", "message", "statut", "date"],
    messages.map((m) => [m.name, m.email, m.message, m.status, m.createdAt.toISOString()])
  );

  return csvResponse("messages.csv", csv);
}
