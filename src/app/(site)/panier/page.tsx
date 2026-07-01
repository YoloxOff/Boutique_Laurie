import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CartLineItem } from "@/components/commerce/cart-line-item";
import { PromoCodeForm } from "@/components/commerce/promo-code-form";
import { ShippingMethodSelector } from "@/components/commerce/shipping-method-selector";
import { getCart, getSelectedPromoCode, getSelectedShippingMethod } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { getShippingPrice } from "@/lib/shipping";
import { computeDiscount, validatePromoCode } from "@/lib/promo";

export const metadata: Metadata = { title: "Panier" };

export default async function PanierPage() {
  const [lines, promoCode, shippingMethod] = await Promise.all([
    getCart(),
    getSelectedPromoCode(),
    getSelectedShippingMethod(),
  ]);

  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const promo = promoCode ? await validatePromoCode(promoCode) : null;
  const discount = computeDiscount(promo, subtotal);
  const shippingPrice =
    promo?.type === "free_shipping" ? 0 : getShippingPrice(shippingMethod, subtotal - discount);
  const total = Math.max(0, subtotal - discount) + shippingPrice;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl">Votre panier est vide</h1>
        <p className="mt-4 text-muted-foreground">Découvrez notre sélection de produits professionnels.</p>
        <Button className="mt-8" render={<Link href="/boutique" />}>
          Découvrir la boutique
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl">Votre panier</h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
        <div>
          {lines.map((line) => (
            <CartLineItem key={line.key} line={line} />
          ))}
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="font-heading text-lg">Code promo</h2>
            <div className="mt-3">
              <PromoCodeForm appliedCode={promoCode} />
            </div>
            {promoCode && !promo && (
              <p className="mt-2 text-xs text-destructive">Code promo invalide ou expiré.</p>
            )}
            {promo && <p className="mt-2 text-xs text-foreground">Code {promo.code} appliqué.</p>}
          </div>

          <div>
            <h2 className="font-heading text-lg">Livraison</h2>
            <div className="mt-3">
              <ShippingMethodSelector selected={shippingMethod} subtotal={subtotal - discount} />
            </div>
          </div>

          <div className="space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sous-total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-accent-foreground">
                <span>Réduction</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Livraison</span>
              <span>{shippingPrice === 0 ? "Gratuite" : formatPrice(shippingPrice)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-heading text-lg">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <Button className="w-full" size="lg" render={<Link href="/paiement" />}>
            Passer la commande
          </Button>
        </div>
      </div>
    </div>
  );
}
