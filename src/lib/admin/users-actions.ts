"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/admin/permissions";
import { db, isDatabaseConfigured } from "@/db";
import { users } from "@/db/schema";
import { logActivity } from "@/lib/admin/activity-log";

export type AdminUserFormState = { error: string | null };

export async function createAdminUser(
  _prevState: AdminUserFormState,
  formData: FormData
): Promise<AdminUserFormState> {
  const session = await requireSuperAdmin();
  if (!isDatabaseConfigured) return { error: "Neon non configuré." };

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "employee");
  const permissions = formData.getAll("permissions").map(String);

  if (!name || !email || password.length < 8) {
    return { error: "Nom, email et mot de passe (8 caractères min.) requis." };
  }
  if (role !== "admin" && role !== "employee") {
    return { error: "Rôle invalide." };
  }

  try {
    const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (existing) return { error: "Un compte existe déjà avec cet email." };

    const passwordHash = await bcrypt.hash(password, 10);
    await db.insert(users).values({ name, email, passwordHash, role, permissions });
    await logActivity(session, "admin.create", email);
  } catch (e) {
    console.error("createAdminUser failed:", e);
    return { error: "Une erreur est survenue lors de la création du compte." };
  }

  revalidatePath("/admin/utilisateurs");
  return { error: null };
}

export async function updateAdminUser(formData: FormData) {
  const session = await requireSuperAdmin();
  if (!isDatabaseConfigured) return;

  const id = String(formData.get("id"));
  const role = String(formData.get("role") ?? "employee");
  const permissions = formData.getAll("permissions").map(String);
  if (role !== "admin" && role !== "employee") return;

  await db.update(users).set({ role, permissions }).where(eq(users.id, id));
  await logActivity(session, "admin.update_permissions", id);
  revalidatePath("/admin/utilisateurs");
}

export async function toggleSuspendAdminUser(id: string, suspend: boolean) {
  const session = await requireSuperAdmin();
  if (!isDatabaseConfigured) return;

  await db
    .update(users)
    .set({ suspendedAt: suspend ? new Date() : null })
    .where(eq(users.id, id));
  await logActivity(session, suspend ? "admin.suspend" : "admin.unsuspend", id);
  revalidatePath("/admin/utilisateurs");
}

export async function deleteAdminUser(id: string) {
  const session = await requireSuperAdmin();
  if (!isDatabaseConfigured) return;
  if (session?.user?.id === id) return; // ne peut pas se supprimer soi-même

  await db.delete(users).where(eq(users.id, id));
  await logActivity(session, "admin.delete", id);
  revalidatePath("/admin/utilisateurs");
}
