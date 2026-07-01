import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin/permissions";
import { db, isDatabaseConfigured } from "@/db";
import { toCsv, csvResponse } from "@/lib/admin/csv";

export async function GET() {
  await requirePermission("promotions");

  if (!isDatabaseConfigured) {
    return NextResponse.json({ message: "Neon non configuré" }, { status: 503 });
  }

  const codes = await db.query.promoCodes.findMany();
  const csv = toCsv(
    ["code", "type", "valeur", "utilisations", "limite", "actif"],
    codes.map((c) => [c.code, c.type, c.value, c.usageCount, c.usageLimit ?? "", c.active ? "oui" : "non"])
  );

  return csvResponse("codes-promo.csv", csv);
}
