import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/forms/register-form";

export const metadata: Metadata = { title: "Créer un compte" };

export default function InscriptionPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl">Créer un compte</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Créez votre compte pour suivre vos commandes, gérer vos adresses et retrouver vos favoris.
      </p>
      <div className="mt-8">
        <RegisterForm />
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="underline underline-offset-4">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
