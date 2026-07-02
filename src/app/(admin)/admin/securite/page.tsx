import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isAdminRole } from "@/lib/admin/permissions";

export const metadata: Metadata = { title: "Admin — Sécurité" };

export default async function AdminSecuritePage() {
  const session = await auth();
  if (!session?.user?.id || !isAdminRole(session.user.role)) redirect("/admin");

  return (
    <div>
      <h1 className="font-heading text-2xl">Sécurité</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Protection contre les tentatives de connexion répétées (5 essais puis blocage temporaire
        de 15 minutes) et déconnexion automatique après 2h d&apos;inactivité sont actives sur
        votre compte.
      </p>
    </div>
  );
}
