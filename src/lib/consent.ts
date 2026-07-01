export const CONSENT_COOKIE = "cc_consent";
export const CONSENT_UPDATED_EVENT = "cc:updated";

export type ConsentState = {
  analytics: boolean;
  marketing: boolean;
};

export function readConsentCookie(): ConsentState | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1])) as ConsentState;
  } catch {
    return null;
  }
}

export function writeConsentCookie(state: ConsentState) {
  const maxAge = 60 * 60 * 24 * 180; // 6 mois
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(state))}; path=/; max-age=${maxAge}; samesite=lax`;
  window.dispatchEvent(new CustomEvent(CONSENT_UPDATED_EVENT, { detail: state }));
}
