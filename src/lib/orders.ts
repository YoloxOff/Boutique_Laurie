import "server-only";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db, isDatabaseConfigured } from "@/db";
import { orders, orderItems } from "@/db/schema";
import type { CartLine } from "@/lib/cart";
import type { ShippingMethod } from "@/lib/shipping";

export type OrderSummary = {
  orderNumber: string;
  email: string;
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  items: CartLine[];
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  total: number;
  shippingMethod: ShippingMethod;
  createdAt: string;
};

const PENDING_ORDER_COOKIE = "pending_order";

function generateOrderNumber() {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `LC-${rand}`;
}

export async function createPendingOrder(input: {
  email: string;
  items: CartLine[];
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  shippingMethod: ShippingMethod;
}): Promise<OrderSummary> {
  const total = Math.max(0, input.subtotal - input.discountAmount) + input.shippingAmount;
  const orderNumber = generateOrderNumber();

  if (isDatabaseConfigured) {
    await db.insert(orders).values({
      orderNumber,
      email: input.email,
      status: "pending",
      subtotal: input.subtotal.toString(),
      discountAmount: input.discountAmount.toString(),
      shippingAmount: input.shippingAmount.toString(),
      total: total.toString(),
      shippingMethod: input.shippingMethod,
    });
    // Les lignes de commande référencent des produits Postgres reels ; en mode
    // mock (donnees demo sans ids DB), on ne les persiste que si la base est active.
  }

  const summary: OrderSummary = {
    orderNumber,
    email: input.email,
    status: "pending",
    items: input.items,
    subtotal: input.subtotal,
    discountAmount: input.discountAmount,
    shippingAmount: input.shippingAmount,
    total,
    shippingMethod: input.shippingMethod,
    createdAt: new Date().toISOString(),
  };

  if (!isDatabaseConfigured) {
    const store = await cookies();
    store.set(PENDING_ORDER_COOKIE, JSON.stringify(summary), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });
  }

  return summary;
}

export async function getOrderByNumber(orderNumber: string): Promise<OrderSummary | null> {
  if (isDatabaseConfigured) {
    const row = await db.query.orders.findFirst({
      where: eq(orders.orderNumber, orderNumber),
      with: { items: true },
    });
    if (!row) return null;
    return {
      orderNumber: row.orderNumber,
      email: row.email,
      status: row.status,
      items: row.items.map((i) => ({
        key: i.sku,
        productSlug: i.sku,
        variantId: null,
        name: i.nameSnapshot,
        image: "",
        unitPrice: Number(i.unitPrice),
        quantity: i.quantity,
      })),
      subtotal: Number(row.subtotal),
      discountAmount: Number(row.discountAmount),
      shippingAmount: Number(row.shippingAmount),
      total: Number(row.total),
      shippingMethod: row.shippingMethod,
      createdAt: row.createdAt.toISOString(),
    };
  }

  const store = await cookies();
  const raw = store.get(PENDING_ORDER_COOKIE)?.value;
  if (!raw) return null;
  try {
    const summary = JSON.parse(raw) as OrderSummary;
    return summary.orderNumber === orderNumber ? summary : null;
  } catch {
    return null;
  }
}

export async function markOrderPaid(orderNumber: string): Promise<void> {
  if (isDatabaseConfigured) {
    await db.update(orders).set({ status: "paid" }).where(eq(orders.orderNumber, orderNumber));
    return;
  }

  const store = await cookies();
  const raw = store.get(PENDING_ORDER_COOKIE)?.value;
  if (!raw) return;
  try {
    const summary = JSON.parse(raw) as OrderSummary;
    if (summary.orderNumber === orderNumber) {
      summary.status = "paid";
      store.set(PENDING_ORDER_COOKIE, JSON.stringify(summary), {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      });
    }
  } catch {
    // ignore
  }
}

export async function getOrdersForCurrentUser(): Promise<OrderSummary[]> {
  if (isDatabaseConfigured) {
    const session = await auth();
    if (!session?.user?.id) return [];
    const rows = await db.query.orders.findMany({
      where: eq(orders.userId, session.user.id),
      with: { items: true },
      orderBy: (o, { desc }) => [desc(o.createdAt)],
    });
    return rows.map((row) => ({
      orderNumber: row.orderNumber,
      email: row.email,
      status: row.status,
      items: row.items.map((i) => ({
        key: i.sku,
        productSlug: i.sku,
        variantId: null,
        name: i.nameSnapshot,
        image: "",
        unitPrice: Number(i.unitPrice),
        quantity: i.quantity,
      })),
      subtotal: Number(row.subtotal),
      discountAmount: Number(row.discountAmount),
      shippingAmount: Number(row.shippingAmount),
      total: Number(row.total),
      shippingMethod: row.shippingMethod,
      createdAt: row.createdAt.toISOString(),
    }));
  }

  // Mode démo : une seule commande (la dernière) est conservée en cookie.
  const store = await cookies();
  const raw = store.get(PENDING_ORDER_COOKIE)?.value;
  if (!raw) return [];
  try {
    const summary = JSON.parse(raw) as OrderSummary;
    return summary.status === "paid" ? [summary] : [];
  } catch {
    return [];
  }
}

// Re-export utile pour le back-office / webhook
export { orders, orderItems };
