"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { auth, signOut } from "@/lib/auth";
import { db, isDatabaseConfigured } from "@/db";
import { users } from "@/db/schema";

export type DeleteAccountFormState = { error: string | null };

export async function deleteOwnAccount(
  _prevState: DeleteAccountFormState,
  formData: FormData
): Promise<DeleteAccountFormState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Vous devez être connecté." };
  if (!isDatabaseConfigured) return { error: "Neon non configuré." };

  const userId = session.user.id;

  try {
    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!user) return { error: "Compte introuvable." };

    if (user.passwordHash) {
      const password = String(formData.get("password") ?? "");
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) return { error: "Mot de passe incorrect." };
    }

    await db.delete(users).where(eq(users.id, userId));
  } catch (e) {
    console.error("deleteOwnAccount failed:", e);
    return { error: "Une erreur est survenue lors de la suppression du compte." };
  }

  await signOut({ redirectTo: "/" });
  return { error: null };
}
