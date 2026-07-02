import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AddressForm } from "@/components/forms/address-form";
import { getAddressesForCurrentUser } from "@/lib/addresses";
import { isDatabaseConfigured } from "@/db";

export const metadata: Metadata = { title: "Mes adresses" };

export default async function AdressesPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  const addresses = await getAddressesForCurrentUser();
  const hasCompleteAddress = addresses.some((a) => a.phone);

  return (
    <div>
      <h1 className="font-heading text-2xl">Mes adresses</h1>

      {callbackUrl && (
        <div className="mt-4 rounded-lg border border-border bg-secondary/40 p-4 text-sm">
          <p>
            Merci de renseigner une adresse de livraison et un numéro de téléphone pour finaliser
            votre commande.
          </p>
          {hasCompleteAddress && (
            <Button size="sm" className="mt-3" render={<Link href={callbackUrl} />}>
              Continuer vers le paiement
            </Button>
          )}
        </div>
      )}

      {addresses.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <div key={address.id} className="rounded-xl border border-border p-4 text-sm">
              <p className="font-medium">{address.label}</p>
              <p>{address.fullName}</p>
              {address.phone && <p>{address.phone}</p>}
              <p>{address.line1}</p>
              <p>
                {address.postalCode} {address.city}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <h2 className="font-heading text-lg">Ajouter une adresse</h2>
        <div className="mt-4">
          <AddressForm callbackUrl={callbackUrl} />
        </div>
        {!isDatabaseConfigured && (
          <p className="mt-2 text-xs text-muted-foreground">
            Mode démo : configurez Neon pour persister vos adresses.
          </p>
        )}
      </div>
    </div>
  );
}
