import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TwoFactorSetupForm } from "@/components/forms/two-factor-setup-form";
import { disableTwoFactor } from "@/lib/admin/two-factor-actions";
import { generateTwoFactorSecret, generateTwoFactorQrCode } from "@/lib/admin/two-factor";
import { auth } from "@/lib/auth";
import { isAdminRole } from "@/lib/admin/permissions";
import { db, isDatabaseConfigured } from "@/db";
import { users } from "@/db/schema";

export const metadata: Metadata = { title: "Admin — Sécurité" };

export default async function AdminSecuritePage() {
  const session = await auth();
  if (!session?.user?.id || !isAdminRole(session.user.role)) redirect("/admin");

  if (!isDatabaseConfigured) {
    return (
      <div>
        <h1 className="font-heading text-2xl">Sécurité</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Mode démo : configurez Neon (DATABASE_URL) pour activer la double authentification.
        </p>
      </div>
    );
  }

  const currentUser = await db.query.users.findFirst({ where: eq(users.id, session.user.id) });
  if (!currentUser) redirect("/admin");

  return (
    <div>
      <h1 className="font-heading text-2xl">Sécurité</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Double authentification (2FA), protection contre les tentatives de connexion répétées
        (5 essais puis blocage temporaire de 15 minutes) et déconnexion automatique après 2h
        d&apos;inactivité sont actives sur votre compte.
      </p>

      <div className="mt-8 max-w-md rounded-xl border border-border p-6">
        <h2 className="font-heading text-lg">Double authentification (2FA)</h2>
        {currentUser.twoFactorEnabled ? (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Activée sur ce compte.</p>
            <form action={disableTwoFactor} className="mt-4">
              <Button variant="destructive" type="submit">
                Désactiver la 2FA
              </Button>
            </form>
          </div>
        ) : (
          <div className="mt-4">
            <p className="mb-4 text-sm text-muted-foreground">
              Scannez ce QR code avec une application d&apos;authentification, puis saisissez le
              code généré pour activer la 2FA.
            </p>
            <TwoFactorSetup email={currentUser.email} />
          </div>
        )}
      </div>
    </div>
  );
}

async function TwoFactorSetup({ email }: { email: string }) {
  const secret = generateTwoFactorSecret();
  const qrCodeDataUrl = await generateTwoFactorQrCode(email, secret);
  return <TwoFactorSetupForm secret={secret} qrCodeDataUrl={qrCodeDataUrl} />;
}
