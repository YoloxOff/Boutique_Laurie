import type { Metadata } from "next";
import { db, isDatabaseConfigured } from "@/db";
import { mockProducts } from "@/lib/mock/catalog";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Admin — Tableau de bord" };

async function getStats() {
  if (!isDatabaseConfigured) {
    const lowStock = mockProducts.flatMap((p) => p.variants).filter((v) => v.stockQuantity < 15);
    return {
      ordersToday: 0,
      revenueToday: 0,
      totalProducts: mockProducts.length,
      lowStockCount: lowStock.length,
    };
  }

  const [products, orders] = await Promise.all([
    db.query.products.findMany(),
    db.query.orders.findMany(),
  ]);
  const today = new Date().toDateString();
  const ordersToday = orders.filter((o) => o.createdAt.toDateString() === today);

  return {
    ordersToday: ordersToday.length,
    revenueToday: ordersToday.reduce((sum, o) => sum + Number(o.total), 0),
    totalProducts: products.length,
    lowStockCount: 0,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="font-heading text-2xl">Tableau de bord</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground">Commandes aujourd&apos;hui</p>
          <p className="mt-2 font-heading text-3xl">{stats.ordersToday}</p>
        </div>
        <div className="rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground">CA aujourd&apos;hui</p>
          <p className="mt-2 font-heading text-3xl">{formatPrice(stats.revenueToday)}</p>
        </div>
        <div className="rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground">Produits</p>
          <p className="mt-2 font-heading text-3xl">{stats.totalProducts}</p>
        </div>
        <div className="rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground">Alertes stock bas</p>
          <p className="mt-2 font-heading text-3xl">{stats.lowStockCount}</p>
        </div>
      </div>
    </div>
  );
}
