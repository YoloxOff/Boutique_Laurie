import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DeleteAccountForm } from "@/components/forms/delete-account-form";
import { auth } from "@/lib/auth";
import { db, isDatabaseConfigured } from "@/db";
import { users } from "@/db/schema";

export const metadata: Metadata = { title: "Paramètres" };

export default async function ParametresPage() {
  const session = await auth();

  const user =
    isDatabaseConfigured && session?.user?.id
      ? await db.query.users.findFirst({ where: eq(users.id, session.user.id) })
      : null;

  return (
    <div>
      <h1 className="font-heading text-2xl">Paramètres du compte</h1>

      <div className="mt-6 max-w-md space-y-4">
        <div>
          <Label htmlFor="settings-name">Nom</Label>
          <Input id="settings-name" defaultValue={session?.user?.name ?? ""} disabled className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="settings-email">Email</Label>
          <Input id="settings-email" defaultValue={session?.user?.email ?? ""} disabled className="mt-1.5" />
        </div>
        <p className="text-xs text-muted-foreground">
          La modification du profil et du mot de passe sera disponible dans une prochaine itération.
        </p>
      </div>

      <div className="mt-12 max-w-md border-t border-border pt-8">
        <h2 className="font-heading text-lg text-destructive">Zone de suppression</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Supprimer votre compte effacera définitivement votre profil, vos adresses et vos favoris.
          Vos commandes passées sont conservées à des fins comptables mais ne seront plus rattachées
          à votre compte.
        </p>
        <div className="mt-4">
          <DeleteAccountForm hasPassword={Boolean(user?.passwordHash)} />
        </div>
      </div>
    </div>
  );
}
