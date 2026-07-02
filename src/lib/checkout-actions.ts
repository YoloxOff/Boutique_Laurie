"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAddressesForCurrentUser } from "@/lib/addresses";
import {
  getCart,
  getSelectedPromoCode,
  getSelectedShippingMethod,
} from "@/lib/cart";
import { clearCart } from "@/lib/cart-actions";
import { createPendingOrder, markOrderPaid } from "@/lib/orders";
import { computeDiscount, validatePromoCode } from "@/lib/promo";
import { getShippingPrice } from "@/lib/shipping";
import { generateInvoicePdf } from "@/lib/pdf/invoice";
import { sendOrderConfirmationEmail } from "@/lib/email/send";

export async function startCheckout(email: string) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/connexion?callbackUrl=/paiement");
  }

  const [items, promoCode, shippingMethod, addresses] = await Promise.all([
    getCart(),
    getSelectedPromoCode(),
    getSelectedShippingMethod(),
    getAddressesForCurrentUser(),
  ]);

  if (items.length === 0) {
    redirect("/panier");
  }

  const shippingAddress = addresses.find((a) => a.isDefault && a.phone) ?? addresses.find((a) => a.phone);
  if (!shippingAddress) {
    redirect("/compte/adresses?callbackUrl=/paiement");
  }

  const subtotal = items.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const promo = promoCode ? await validatePromoCode(promoCode) : null;
  const discountAmount = computeDiscount(promo, subtotal);
  const shippingAmount = promo?.type === "free_shipping" ? 0 : getShippingPrice(shippingMethod, subtotal - discountAmount);

  const order = await createPendingOrder({
    email,
    userId: session.user.id,
    shippingAddressId: shippingAddress.id,
    items,
    subtotal,
    discountAmount,
    shippingAmount,
    shippingMethod,
  });

  return order;
}

/**
 * Simule une confirmation de paiement en mode démo (sans Stripe configuré).
 * En production, cette confirmation intervient via le webhook Stripe
 * (src/app/api/webhooks/stripe/route.ts) sur l'événement payment_intent.succeeded.
 */
export async function confirmMockPayment(orderNumber: string, email: string) {
  await markOrderPaid(orderNumber);
  await clearCart();
  const invoiceUrl = await generateInvoicePdf(orderNumber);
  await sendOrderConfirmationEmail(email, orderNumber, invoiceUrl);
  redirect(`/confirmation/${orderNumber}`);
}
