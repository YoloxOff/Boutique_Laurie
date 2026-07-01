import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin/permissions";
import { db, isDatabaseConfigured } from "@/db";
import { toCsv, csvResponse } from "@/lib/admin/csv";

export async function GET() {
  await requirePermission("products");

  if (!isDatabaseConfigured) {
    return NextResponse.json({ message: "Neon non configuré" }, { status: 503 });
  }

  const rows = await db.query.products.findMany({ with: { variants: true } });
  const csv = toCsv(
    ["nom", "sku", "prix", "stock_total", "statut"],
    rows.map((p) => [
      p.name,
      p.sku,
      p.basePrice,
      p.variants.reduce((sum, v) => sum + v.stockQuantity, 0),
      p.status,
    ])
  );

  return csvResponse("produits.csv", csv);
}
