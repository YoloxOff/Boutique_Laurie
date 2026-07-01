import { NextResponse, type NextRequest } from "next/server";
import { getOrderByNumber } from "@/lib/orders";
import { isStripeConfigured, stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  if (!isStripeConfigured || !stripe) {
    return NextResponse.json({ message: "Stripe non configuré" }, { status: 503 });
  }

  const { orderNumber } = (await req.json()) as { orderNumber?: string };
  if (!orderNumber) {
    return NextResponse.json({ message: "orderNumber manquant" }, { status: 400 });
  }

  const order = await getOrderByNumber(orderNumber);
  if (!order) {
    return NextResponse.json({ message: "Commande introuvable" }, { status: 404 });
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.total * 100),
    currency: "eur",
    metadata: { orderNumber: order.orderNumber },
    automatic_payment_methods: { enabled: true },
  });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
