import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/commerce/checkout-form";
import {
  getCart,
  getSelectedPromoCode,
  getSelectedShippingMethod,
} from "@/lib/cart";
import { computeDiscount, validatePromoCode } from "@/lib/promo";
import { getShippingPrice } from "@/lib/shipping";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Paiement" };

export default async function PaiementPage() {
  const [items, promoCode, shippingMethod] = await Promise.all([
    getCart(),
    getSelectedPromoCode(),
    getSelectedShippingMethod(),
  ]);

  if (items.length === 0) redirect("/panier");

  const subtotal = items.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const promo = promoCode ? await validatePromoCode(promoCode) : null;
  const discountAmount = computeDiscount(promo, subtotal);
  const shippingAmount = promo?.type === "free_shipping" ? 0 : getShippingPrice(shippingMethod, subtotal - discountAmount);
  const total = Math.max(0, subtotal - discountAmount) + shippingAmount;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl">Paiement</h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_320px]">
        <CheckoutForm total={total} />

        <div className="space-y-3 rounded-xl border border-border p-6 text-sm">
          {items.map((item) => (
            <div key={item.key} className="flex justify-between">
              <span className="text-muted-foreground">
                {item.name} x{item.quantity}
              </span>
              <span>{formatPrice(item.unitPrice * item.quantity)}</span>
            </div>
          ))}
          <div className="border-t border-border pt-3 flex justify-between font-heading text-lg">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
