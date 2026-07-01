import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";

export const metadata: Metadata = { title: "Mon compte" };

export default async function CompteDashboardPage() {
  const session = await auth();

  return (
    <div>
      <h1 className="font-heading text-2xl">Tableau de bord</h1>
      <p className="mt-2 text-sm text-muted-foreground">{session?.user?.email}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link href="/compte/commandes" className="rounded-xl border border-border p-6 hover:border-accent">
          <p className="font-heading text-lg">Mes commandes</p>
          <p className="mt-1 text-sm text-muted-foreground">Historique et suivi</p>
        </Link>
        <Link href="/compte/favoris" className="rounded-xl border border-border p-6 hover:border-accent">
          <p className="font-heading text-lg">Mes favoris</p>
          <p className="mt-1 text-sm text-muted-foreground">Produits enregistrés</p>
        </Link>
        <Link href="/compte/adresses" className="rounded-xl border border-border p-6 hover:border-accent">
          <p className="font-heading text-lg">Mes adresses</p>
          <p className="mt-1 text-sm text-muted-foreground">Livraison &amp; facturation</p>
        </Link>
      </div>
    </div>
  );
}
