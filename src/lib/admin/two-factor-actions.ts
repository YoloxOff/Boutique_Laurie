"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { isAdminRole } from "@/lib/admin/permissions";
import { verifyTwoFactorToken } from "@/lib/admin/two-factor";
import { logActivity } from "@/lib/admin/activity-log";
import { db, isDatabaseConfigured } from "@/db";
import { users } from "@/db/schema";

export type TwoFactorFormState = { error: string | null; success?: boolean };

export async function confirmTwoFactorSetup(
  _prevState: TwoFactorFormState,
  formData: FormData
): Promise<TwoFactorFormState> {
  const session = await auth();
  if (!session?.user?.id || !isAdminRole(session.user.role)) {
    return { error: "Accès refusé." };
  }
  if (!isDatabaseConfigured) return { error: "Neon non configuré." };

  const secret = String(formData.get("secret") ?? "");
  const code = String(formData.get("code") ?? "").trim();
  if (!secret || !code) return { error: "Code requis." };

  if (!verifyTwoFactorToken(secret, code)) {
    return { error: "Code invalide. Vérifiez l'heure de votre téléphone et réessayez." };
  }

  await db
    .update(users)
    .set({ twoFactorSecret: secret, twoFactorEnabled: true })
    .where(eq(users.id, session.user.id));

  await logActivity(session, "auth.2fa_enabled");
  revalidatePath("/admin/securite");
  return { error: null, success: true };
}

export async function disableTwoFactor() {
  const session = await auth();
  if (!session?.user?.id || !isAdminRole(session.user.role)) return;
  if (!isDatabaseConfigured) return;

  await db
    .update(users)
    .set({ twoFactorSecret: null, twoFactorEnabled: false })
    .where(eq(users.id, session.user.id));

  await logActivity(session, "auth.2fa_disabled");
  revalidatePath("/admin/securite");
}
