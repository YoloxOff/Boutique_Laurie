import { env } from "@/env";

/**
 * Retourne `true` si reCAPTCHA n'est pas configuré (mode démo) ou si le score
 * renvoyé par Google est suffisant. Câblé mais désactivé tant que les clés ne
 * sont pas fournies (cf. .env.example).
 */
export async function verifyRecaptcha(token: string | null): Promise<boolean> {
  if (!env.RECAPTCHA_SECRET_KEY) return true;
  if (!token) return false;

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: env.RECAPTCHA_SECRET_KEY, response: token }),
    });
    const data = (await res.json()) as { success: boolean; score?: number };
    return data.success && (data.score ?? 1) >= 0.5;
  } catch {
    return false;
  }
}
