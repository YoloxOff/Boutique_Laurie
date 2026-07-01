import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq, gte } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { SalesChart } from "@/components/admin/sales-chart";
import { db, isDatabaseConfigured } from "@/db";
import { orders, productReviews, users, contactMessages } from "@/db/schema";
import { mockProducts } from "@/lib/mock/catalog";
import { formatPrice, formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Admin — Tableau de bord" };

const DAYS_HISTORY = 14;

async function getStats() {
  if (!isDatabaseConfigured) {
    const lowStock = mockProducts.flatMap((p) => p.variants).filter((v) => v.stockQuantity < 5);
    return {
      demo: true as const,
      ordersToday: 0,
      revenueToday: 0,
      ordersMonth: 0,
      revenueMonth: 0,
      totalProducts: mockProducts.length,
      lowStockCount: lowStock.length,
      avgCartValue: 0,
      newMessages: 0,
      topProducts: [] as { name: string; quantity: number }[],
      latestOrders: [] as (typeof orders.$inferSelect)[],
      latestCustomers: [] as (typeof users.$inferSelect)[],
      recentReviews: [] as { authorName: string; rating: number; comment: string }[],
      salesEvolution: [] as { label: string; value: number }[],
    };
  }

  const since = new Date();
  since.setDate(since.getDate() - DAYS_HISTORY);

  const [allOrders, allProducts, latestOrders, latestCustomers, recentReviews, newMessagesCount] =
    await Promise.all([
      db.query.orders.findMany({ where: gte(orders.createdAt, since) }),
      db.query.products.findMany({ with: { variants: true } }),
      db.query.orders.findMany({ orderBy: [desc(orders.createdAt)], limit: 5 }),
      db.query.users.findMany({ where: eq(users.role, "customer"), orderBy: [desc(users.createdAt)], limit: 5 }),
      db.query.productReviews.findMany({ with: { product: true }, orderBy: [desc(productReviews.createdAt)], limit: 5 }),
      db.query.contactMessages.findMany({ where: eq(contactMessages.status, "new") }),
    ]);

  const today = new Date().toDateString();
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();

  const ordersToday = allOrders.filter((o) => o.createdAt.toDateString() === today);
  const ordersMonth = allOrders.filter(
    (o) => o.createdAt.getMonth() === thisMonth && o.createdAt.getFullYear() === thisYear
  );

  const lowStockCount = allProducts.filter((p) => p.variants.some((v) => v.stockQuantity < 5)).length;
  const allOrdersEver = await db.query.orders.findMany();
  const avgCartValue =
    allOrdersEver.length > 0 ? allOrdersEver.reduce((sum, o) => sum + Number(o.total), 0) / allOrdersEver.length : 0;

  // Top produits vendus (sur toutes les commandes)
  const allItemsEver = await db.query.orderItems.findMany();
  const soldByProduct = new Map<string, number>();
  for (const item of allItemsEver) {
    const key = item.nameSnapshot;
    soldByProduct.set(key, (soldByProduct.get(key) ?? 0) + item.quantity);
  }
  const topProducts = [...soldByProduct.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, quantity]) => ({ name, quantity }));

  const salesEvolution = Array.from({ length: DAYS_HISTORY }, (_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - (DAYS_HISTORY - 1 - i));
    const dayStr = day.toDateString();
    const value = allOrders
      .filter((o) => o.createdAt.toDateString() === dayStr)
      .reduce((sum, o) => sum + Number(o.total), 0);
    return { label: day.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }), value };
  });

  return {
    demo: false as const,
    ordersToday: ordersToday.length,
    revenueToday: ordersToday.reduce((sum, o) => sum + Number(o.total), 0),
    ordersMonth: ordersMonth.length,
    revenueMonth: ordersMonth.reduce((sum, o) => sum + Number(o.total), 0),
    totalProducts: allProducts.length,
    lowStockCount,
    avgCartValue,
    newMessages: newMessagesCount.length,
    topProducts,
    latestOrders,
    latestCustomers,
    recentReviews,
    salesEvolution,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="font-heading text-2xl">Tableau de bord</h1>
      {stats.demo && (
        <p className="mt-2 text-sm text-muted-foreground">
          Mode démo — Neon non configuré. Statistiques limitées.
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground">Commandes aujourd&apos;hui</p>
          <p className="mt-2 font-heading text-3xl">{stats.ordersToday}</p>
        </div>
        <div className="rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground">CA aujourd&apos;hui</p>
          <p className="mt-2 font-heading text-3xl">{formatPrice(stats.revenueToday)}</p>
        </div>
        <div className="rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground">Commandes ce mois</p>
          <p className="mt-2 font-heading text-3xl">{stats.ordersMonth}</p>
        </div>
        <div className="rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground">CA ce mois</p>
          <p className="mt-2 font-heading text-3xl">{formatPrice(stats.revenueMonth)}</p>
        </div>
        <div className="rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground">Produits</p>
          <p className="mt-2 font-heading text-3xl">{stats.totalProducts}</p>
        </div>
        <div className="rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground">Alertes stock bas</p>
          <p className="mt-2 font-heading text-3xl">{stats.lowStockCount}</p>
        </div>
        <div className="rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground">Panier moyen</p>
          <p className="mt-2 font-heading text-3xl">{formatPrice(stats.avgCartValue)}</p>
        </div>
        <div className="rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground">Nouveaux messages</p>
          <p className="mt-2 font-heading text-3xl">{stats.newMessages}</p>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-border p-6">
        <h2 className="font-heading text-lg">Évolution des ventes (14 derniers jours)</h2>
        <div className="mt-4">
          <SalesChart data={stats.salesEvolution} />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border p-6">
          <h2 className="font-heading text-lg">Dernières commandes</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {stats.latestOrders.map((o) => (
              <li key={o.id} className="flex items-center justify-between border-b border-border/60 pb-2">
                <span>
                  {o.orderNumber} — {o.email}
                </span>
                <span className="flex items-center gap-2">
                  {formatPrice(Number(o.total))}
                  <Badge variant="secondary">{o.status}</Badge>
                </span>
              </li>
            ))}
            {stats.latestOrders.length === 0 && <p className="text-muted-foreground">Aucune commande.</p>}
          </ul>
          <Link href="/admin/commandes" className="mt-4 inline-block text-sm underline underline-offset-4">
            Voir toutes les commandes
          </Link>
        </div>

        <div className="rounded-xl border border-border p-6">
          <h2 className="font-heading text-lg">Derniers clients</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {stats.latestCustomers.map((c) => (
              <li key={c.id} className="flex items-center justify-between border-b border-border/60 pb-2">
                <span>{c.name ?? c.email}</span>
                <span className="text-muted-foreground">{formatDate(c.createdAt.toISOString())}</span>
              </li>
            ))}
            {stats.latestCustomers.length === 0 && <p className="text-muted-foreground">Aucun client.</p>}
          </ul>
          <Link href="/admin/clients" className="mt-4 inline-block text-sm underline underline-offset-4">
            Voir tous les clients
          </Link>
        </div>

        <div className="rounded-xl border border-border p-6">
          <h2 className="font-heading text-lg">Produits les plus vendus</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {stats.topProducts.map((p) => (
              <li key={p.name} className="flex items-center justify-between border-b border-border/60 pb-2">
                <span>{p.name}</span>
                <span className="text-muted-foreground">{p.quantity} vendus</span>
              </li>
            ))}
            {stats.topProducts.length === 0 && <p className="text-muted-foreground">Pas encore de ventes.</p>}
          </ul>
        </div>

        <div className="rounded-xl border border-border p-6">
          <h2 className="font-heading text-lg">Avis récents</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {stats.recentReviews.map((r, i) => (
              <li key={i} className="border-b border-border/60 pb-2">
                <p className="font-medium">
                  {r.authorName} — {r.rating}/5
                </p>
                <p className="text-muted-foreground">{r.comment}</p>
              </li>
            ))}
            {stats.recentReviews.length === 0 && <p className="text-muted-foreground">Aucun avis.</p>}
          </ul>
          <Link href="/admin/avis" className="mt-4 inline-block text-sm underline underline-offset-4">
            Voir tous les avis
          </Link>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
        Nombre de visiteurs et taux de conversion nécessitent de connecter un outil d&apos;analytics
        (Vercel Analytics ou GA4) — non branché pour l&apos;instant, ces chiffres ne sont pas
        affichés pour éviter de montrer des données fictives.
      </div>
    </div>
  );
}
