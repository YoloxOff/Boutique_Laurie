"use server";

import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/admin/permissions";
import { logActivity } from "@/lib/admin/activity-log";
import { runBackup, restoreBackup, deleteBackup } from "@/lib/admin/backup";

export type BackupActionState = { error: string | null; success?: boolean; message?: string };

export async function createManualBackup(): Promise<BackupActionState> {
  const session = await requireSuperAdmin();
  try {
    const summary = await runBackup();
    await logActivity(session, "backup.create", summary.pathname);
    revalidatePath("/admin/sauvegardes");
    return { error: null, success: true, message: `Sauvegarde créée : ${summary.pathname}` };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Échec de la sauvegarde." };
  }
}

export async function restoreFromBackup(pathname: string): Promise<BackupActionState> {
  const session = await requireSuperAdmin();
  try {
    const result = await restoreBackup(pathname);
    await logActivity(session, "backup.restore", pathname);
    revalidatePath("/");
    revalidatePath("/admin/sauvegardes");
    return {
      error: null,
      success: true,
      message: `Restauration terminée (${result.tables.length} tables).`,
    };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Échec de la restauration." };
  }
}

export async function deleteBackupAction(pathname: string) {
  const session = await requireSuperAdmin();
  await deleteBackup(pathname);
  await logActivity(session, "backup.delete", pathname);
  revalidatePath("/admin/sauvegardes");
}
