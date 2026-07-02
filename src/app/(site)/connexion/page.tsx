import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";

export const metadata: Metadata = { title: "Connexion" };

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl">Connexion</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Accédez à votre compte pour suivre vos commandes et retrouver vos favoris.
      </p>
      <div className="mt-8">
        <LoginForm callbackUrl={callbackUrl ?? "/compte"} />
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link
          href={callbackUrl ? `/inscription?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/inscription"}
          className="underline underline-offset-4"
        >
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
