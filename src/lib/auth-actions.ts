"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { signIn } from "@/lib/auth";
import { db, isDatabaseConfigured } from "@/db";
import { users } from "@/db/schema";

export type AuthFormState = { error: string | null };

export async function authenticate(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const callbackUrl = String(formData.get("callbackUrl") ?? "/compte");

  try {
    await signIn("credentials", { email, password, redirectTo: callbackUrl });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error:
          "Connexion refusée : identifiants incorrects, ou compte temporairement bloqué après plusieurs tentatives.",
      };
    }
    throw error;
  }

  return { error: null };
}

export type RegisterFormState = { error: string | null; success: boolean };

export async function registerCustomer(
  _prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const callbackUrl = String(formData.get("callbackUrl") ?? "").trim();

  if (!name || !email || password.length < 8) {
    return {
      error: "Merci de renseigner un nom, un email valide et un mot de passe d'au moins 8 caractères.",
      success: false,
    };
  }

  if (!isDatabaseConfigured) {
    return {
      error:
        "Mode démo : la création de compte nécessite Neon (DATABASE_URL). Connectez-vous avec le compte de démonstration admin@laurie-coiffure.fr / admin1234.",
      success: false,
    };
  }

  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (existing) {
    return { error: "Un compte existe déjà avec cet email.", success: false };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await db.insert(users).values({ name, email, passwordHash, role: "customer" });

  redirect(
    callbackUrl.startsWith("/") ? `/connexion?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/connexion"
  );
}
