import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/db";
import { orders, stripeEvents } from "@/db/schema";
import { env } from "@/env";
import { isStripeConfigured, stripe } from "@/lib/stripe";
import { generateInvoicePdf } from "@/lib/pdf/invoice";
import { sendOrderConfirmationEmail } from "@/lib/email/send";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!isStripeConfigured || !stripe || !env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ message: "Stripe non configuré" }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature ?? "", env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return NextResponse.json({ message: `Signature invalide: ${String(err)}` }, { status: 400 });
  }

  if (isDatabaseConfigured) {
    const alreadyProcessed = await db.query.stripeEvents.findFirst({
      where: eq(stripeEvents.id, event.id),
    });
    if (alreadyProcessed) {
      return NextResponse.json({ received: true, deduped: true });
    }
    await db.insert(stripeEvents).values({ id: event.id });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const orderNumber = paymentIntent.metadata?.orderNumber;
    if (orderNumber) {
      if (isDatabaseConfigured) {
        await db
          .update(orders)
          .set({ status: "paid", stripePaymentIntentId: paymentIntent.id })
          .where(eq(orders.orderNumber, orderNumber));
      }
      const invoiceUrl = await generateInvoicePdf(orderNumber).catch(() => null);
      const email = paymentIntent.receipt_email;
      if (email) {
        await sendOrderConfirmationEmail(email, orderNumber, invoiceUrl).catch(() => null);
      }
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object;
    const orderNumber = paymentIntent.metadata?.orderNumber;
    if (orderNumber && isDatabaseConfigured) {
      await db.update(orders).set({ status: "cancelled" }).where(eq(orders.orderNumber, orderNumber));
    }
  }

  return NextResponse.json({ received: true });
}
