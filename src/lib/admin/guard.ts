import "server-only";
import { auth } from "@/lib/auth";

/**
 * Revérifie le rôle admin à l'intérieur de chaque Server Action / Route Handler
 * du back-office — défense en profondeur, ne jamais dépendre uniquement du middleware.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Accès refusé : réservé aux administrateurs.");
  }
  return session;
}
