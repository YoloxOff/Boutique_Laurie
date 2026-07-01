import "server-only";
import { auth } from "@/lib/auth";
import { isAdminRole } from "@/lib/admin/permissions";

/**
 * Revérifie le rôle admin à l'intérieur de chaque Server Action / Route Handler
 * du back-office — défense en profondeur, ne jamais dépendre uniquement du middleware.
 * Autorise super_admin/admin/employee ; utiliser requirePermission() pour restreindre
 * une action à une permission précise.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || !isAdminRole(session.user.role)) {
    throw new Error("Accès refusé : réservé au back-office.");
  }
  return session;
}
