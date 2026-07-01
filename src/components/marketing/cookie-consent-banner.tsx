"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { writeConsentCookie, type ConsentState } from "@/lib/consent";
import { useConsentCookie } from "@/lib/use-consent-cookie";

export function CookieConsentBanner() {
  const consent = useConsentCookie();
  const [customizing, setCustomizing] = useState(false);
  const [draft, setDraft] = useState<ConsentState>({ analytics: false, marketing: false });

  function acceptAll() {
    writeConsentCookie({ analytics: true, marketing: true });
  }

  function rejectAll() {
    writeConsentCookie({ analytics: false, marketing: false });
  }

  function saveCustom() {
    writeConsentCookie(draft);
  }

  if (consent !== null) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background p-4 shadow-lg sm:p-6">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm text-muted-foreground">
          Nous utilisons des cookies pour améliorer votre expérience, mesurer notre audience et
          vous proposer des contenus adaptés. Consultez notre{" "}
          <Link href="/cookies" className="underline">
            politique de cookies
          </Link>
          .
        </p>

        {customizing && (
          <div className="mt-4 space-y-3 rounded-lg border border-border p-4">
            <div className="flex items-center justify-between text-sm">
              <span>Cookies nécessaires (toujours actifs)</span>
              <Switch checked disabled />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Cookies de mesure d&apos;audience (Google Analytics)</span>
              <Switch
                checked={draft.analytics}
                onCheckedChange={(v) => setDraft((d) => ({ ...d, analytics: v }))}
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Cookies marketing (Meta Pixel)</span>
              <Switch
                checked={draft.marketing}
                onCheckedChange={(v) => setDraft((d) => ({ ...d, marketing: v }))}
              />
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={acceptAll}>Tout accepter</Button>
          <Button variant="outline" onClick={rejectAll}>
            Tout refuser
          </Button>
          {customizing ? (
            <Button variant="secondary" onClick={saveCustom}>
              Enregistrer mes choix
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => setCustomizing(true)}>
              Personnaliser
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
