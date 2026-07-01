"use server";

import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/admin/permissions";
import { logActivity } from "@/lib/admin/activity-log";
import { sendContactReplyEmail } from "@/lib/email/send";
import { db, isDatabaseConfigured } from "@/db";
import { contactMessages } from "@/db/schema";

export type ReplyFormState = { error: string | null };

export async function replyToMessage(
  _prevState: ReplyFormState,
  formData: FormData
): Promise<ReplyFormState> {
  const session = await requirePermission("messages");
  if (!isDatabaseConfigured) return { error: "Neon non configuré." };

  const id = String(formData.get("id"));
  const to = String(formData.get("email"));
  const reply = String(formData.get("reply") ?? "").trim();
  if (!reply) return { error: "Le message de réponse est vide." };

  await sendContactReplyEmail(to, reply);
  await db.update(contactMessages).set({ status: "replied" }).where(eq(contactMessages.id, id));
  await logActivity(session, "message.reply", to);
  revalidatePath("/admin/messages");
  return { error: null };
}

export async function bulkArchiveMessages(formData: FormData) {
  const session = await requirePermission("messages");
  if (!isDatabaseConfigured) return;
  const ids = formData.getAll("ids").map(String);
  if (ids.length === 0) return;

  await db.update(contactMessages).set({ status: "archived" }).where(inArray(contactMessages.id, ids));
  await logActivity(session, "message.bulk_archive", `${ids.length} message(s)`);
  revalidatePath("/admin/messages");
}

export async function bulkDeleteMessages(formData: FormData) {
  const session = await requirePermission("messages");
  if (!isDatabaseConfigured) return;
  const ids = formData.getAll("ids").map(String);
  if (ids.length === 0) return;

  await db.delete(contactMessages).where(inArray(contactMessages.id, ids));
  await logActivity(session, "message.bulk_delete", `${ids.length} message(s)`);
  revalidatePath("/admin/messages");
}
