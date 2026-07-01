import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { PermissionKey } from "@/lib/admin/permission-keys";

export { PERMISSIONS, type PermissionKey } from "@/lib/admin/permission-keys";

type SessionLike = {
  user?: { role?: string; permissions?: string[] } | null;
} | null;

/** super_admin a toujours tout ; admin/employee dépendent de `permissions`. */
export function can(session: SessionLike, permission: PermissionKey): boolean {
  const role = session?.user?.role;
  if (role === "super_admin") return true;
  if (role !== "admin" && role !== "employee") return false;
  return session?.user?.permissions?.includes(permission) ?? false;
}

export function isAdminRole(role?: string): boolean {
  return role === "super_admin" || role === "admin" || role === "employee";
}

/** Défense en profondeur pour les Server Actions : ne jamais dépendre uniquement du layout/middleware. */
export async function requirePermission(permission: PermissionKey) {
  const session = await auth();
  if (!isAdminRole(session?.user?.role) || !can(session, permission)) {
    throw new Error("Accès refusé : permission manquante.");
  }
  return session!;
}

/** Défense en profondeur pour les pages : redirige vers /admin si la permission manque. */
export async function assertPagePermission(permission: PermissionKey) {
  const session = await auth();
  if (!isAdminRole(session?.user?.role) || !can(session, permission)) {
    redirect("/admin");
  }
  return session!;
}

export async function requireSuperAdmin() {
  const session = await auth();
  if (session?.user?.role !== "super_admin") {
    throw new Error("Accès refusé : réservé au super administrateur.");
  }
  return session;
}
