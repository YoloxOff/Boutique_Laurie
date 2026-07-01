"use server";

import { db, isDatabaseConfigured } from "@/db";
import { newsletterSubscribers } from "@/db/schema";

export async function subscribeToNewsletter(email: string): Promise<{ success: boolean }> {
  if (!email || !email.includes("@")) return { success: false };

  if (!isDatabaseConfigured) {
    // Mode démo : simule l'inscription sans persistance réelle.
    console.log(`[newsletter:mock] inscription simulée pour ${email}`);
    return { success: true };
  }

  try {
    await db
      .insert(newsletterSubscribers)
      .values({ email, source: "site" })
      .onConflictDoNothing({ target: newsletterSubscribers.email });
    return { success: true };
  } catch {
    return { success: false };
  }
}
