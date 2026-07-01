import type { Metadata } from "next";
import { AddressForm } from "@/components/forms/address-form";
import { getAddressesForCurrentUser } from "@/lib/addresses";
import { isDatabaseConfigured } from "@/db";

export const metadata: Metadata = { title: "Mes adresses" };

export default async function AdressesPage() {
  const addresses = await getAddressesForCurrentUser();

  return (
    <div>
      <h1 className="font-heading text-2xl">Mes adresses</h1>

      {addresses.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <div key={address.id} className="rounded-xl border border-border p-4 text-sm">
              <p className="font-medium">{address.label}</p>
              <p>{address.fullName}</p>
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
          <AddressForm />
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
