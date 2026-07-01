import "server-only";
import { Resend } from "resend";
import { env } from "@/env";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export async function sendOrderConfirmationEmail(
  email: string,
  orderNumber: string,
  invoiceUrl: string | null
) {
  if (!resend) {
    console.log(`[email:mock] confirmation de commande ${orderNumber} envoyée (simulée) à ${email}`);
    return;
  }

  await resend.emails.send({
    from: env.EMAIL_FROM ?? "Laurie Coiffure <commandes@laurie-coiffure.fr>",
    to: email,
    subject: `Confirmation de votre commande ${orderNumber}`,
    html: `<p>Merci pour votre commande <strong>${orderNumber}</strong> !</p>${
      invoiceUrl ? `<p><a href="${invoiceUrl}">Télécharger votre facture</a></p>` : ""
    }`,
  });
}

export async function sendContactNotificationEmail(name: string, email: string, message: string) {
  if (!resend) {
    console.log(`[email:mock] notification de contact de ${name} (${email})`);
    return;
  }
  await resend.emails.send({
    from: env.EMAIL_FROM ?? "Laurie Coiffure <contact@laurie-coiffure.fr>",
    to: env.EMAIL_FROM ?? "contact@laurie-coiffure.fr",
    subject: `Nouveau message de contact de ${name}`,
    html: `<p>${message}</p><p>Répondre à : ${email}</p>`,
  });
}

export async function sendContactReplyEmail(to: string, replyMessage: string) {
  if (!resend) {
    console.log(`[email:mock] réponse envoyée (simulée) à ${to}`);
    return;
  }
  await resend.emails.send({
    from: env.EMAIL_FROM ?? "Laurie Coiffure <contact@laurie-coiffure.fr>",
    to,
    subject: "Réponse à votre message — Laurie Coiffure",
    html: `<p>${replyMessage.replace(/\n/g, "<br/>")}</p>`,
  });
}
