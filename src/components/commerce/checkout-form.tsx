"use client";

import { useState, useTransition } from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { startCheckout, confirmMockPayment } from "@/lib/checkout-actions";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

function StripePaymentStep({ orderNumber }: { orderNumber: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <PaymentElement />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button
        className="w-full"
        disabled={!stripe || isPending}
        onClick={() => {
          if (!stripe || !elements) return;
          startTransition(async () => {
            const { error: confirmError } = await stripe.confirmPayment({
              elements,
              confirmParams: {
                return_url: `${window.location.origin}/confirmation/${orderNumber}`,
              },
            });
            if (confirmError) setError(confirmError.message ?? "Le paiement a échoué.");
          });
        }}
      >
        {isPending ? "Paiement en cours…" : "Payer maintenant"}
      </Button>
    </div>
  );
}

export function CheckoutForm({ total, userEmail }: { total: number; userEmail?: string }) {
  const [email, setEmail] = useState(userEmail ?? "");
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const order = await startCheckout(email);

      if (!stripePromise) {
        // Mode démo : aucune clé Stripe configurée, on confirme directement la commande.
        await confirmMockPayment(order.orderNumber, email);
        return;
      }

      const res = await fetch("/api/checkout/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber: order.orderNumber }),
      });
      if (!res.ok) {
        setError("Impossible d'initialiser le paiement, merci de réessayer.");
        return;
      }
      const data = (await res.json()) as { clientSecret: string };
      setOrderNumber(order.orderNumber);
      setClientSecret(data.clientSecret);
    });
  }

  if (clientSecret && orderNumber && stripePromise) {
    return (
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <StripePaymentStep orderNumber={orderNumber} />
      </Elements>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="checkout-email">Email</Label>
        <Input
          id="checkout-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" size="lg" disabled={isPending}>
        {isPending ? "Préparation du paiement…" : `Payer ${total.toFixed(2)} €`}
      </Button>
      {!stripePromise && (
        <p className="text-xs text-muted-foreground">
          Mode démo : aucune clé Stripe configurée, le paiement sera simulé automatiquement.
        </p>
      )}
    </form>
  );
}
