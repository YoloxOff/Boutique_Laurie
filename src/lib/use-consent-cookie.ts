"use client";

import { useSyncExternalStore } from "react";
import { CONSENT_COOKIE, CONSENT_UPDATED_EVENT, type ConsentState } from "@/lib/consent";

function subscribe(callback: () => void) {
  window.addEventListener(CONSENT_UPDATED_EVENT, callback);
  return () => window.removeEventListener(CONSENT_UPDATED_EVENT, callback);
}

function getSnapshot() {
  return document.cookie;
}

function getServerSnapshot() {
  return "";
}

/**
 * Lit le cookie de consentement via useSyncExternalStore plutot qu'un
 * useState+useEffect, pour rester synchronise avec l'evenement CONSENT_UPDATED_EVENT
 * sans setState direct dans un effet.
 */
export function useConsentCookie(): ConsentState | null {
  const cookieString = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const match = cookieString.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1])) as ConsentState;
  } catch {
    return null;
  }
}
