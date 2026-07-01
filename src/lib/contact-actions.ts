"use server";

import { headers } from "next/headers";
import { checkRateLimit } from "@/lib/rate-limit";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { sendContactNotificationEmail } from "@/lib/email/send";
import { db, isDatabaseConfigured } from "@/db";
import { contactMessages } from "@/db/schema";

export type ContactFormState = {
  success: boolean;
  message: string;
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const recaptchaToken = formData.get("recaptchaToken") as string | null;

  if (!name || !email || !message) {
    return { success: false, message: "Merci de remplir tous les champs obligatoires." };
  }

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for") ?? "anonymous";

  const [{ success: withinLimit }, recaptchaValid] = await Promise.all([
    checkRateLimit(`contact:${ip}`),
    verifyRecaptcha(recaptchaToken),
  ]);

  if (!withinLimit) {
    return { success: false, message: "Trop de tentatives, merci de réessayer dans quelques minutes." };
  }
  if (!recaptchaValid) {
    return { success: false, message: "Vérification anti-spam échouée, merci de réessayer." };
  }

  if (isDatabaseConfigured) {
    await db.insert(contactMessages).values({ name, email, message });
  }
  await sendContactNotificationEmail(name, email, message);

  return { success: true, message: "Votre message a bien été envoyé, nous vous répondrons rapidement." };
}
