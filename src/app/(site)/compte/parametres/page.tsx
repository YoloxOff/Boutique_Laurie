import type { Metadata } from "next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/auth";

export const metadata: Metadata = { title: "Paramètres" };

export default async function ParametresPage() {
  const session = await auth();

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
    </div>
  );
}
