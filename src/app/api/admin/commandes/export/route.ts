import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin/permissions";
import { db, isDatabaseConfigured } from "@/db";
import { toCsv, csvResponse } from "@/lib/admin/csv";

export async function GET() {
  await requirePermission("orders");

  if (!isDatabaseConfigured) {
    return NextResponse.json({ message: "Neon non configuré" }, { status: 503 });
  }

  const orders = await db.query.orders.findMany({ orderBy: (o, { desc }) => [desc(o.createdAt)] });
  const csv = toCsv(
    ["numero", "email", "date", "total", "statut"],
    orders.map((o) => [o.orderNumber, o.email, o.createdAt.toISOString(), o.total, o.status])
  );

  return csvResponse("commandes.csv", csv);
}
