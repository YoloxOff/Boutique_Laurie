"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateSiteSettings, type SettingsFormState } from "@/lib/admin/settings-actions";
import type { SiteSettings } from "@/lib/content/site-settings";

const initial: SettingsFormState = { error: null };

export function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction, isPending] = useActionState(updateSiteSettings, initial);
  const hoursText = settings.hours.map((h) => `${h.day}: ${h.hours}`).join("\n");

  return (
    <form action={formAction} className="grid max-w-3xl gap-4 sm:grid-cols-2">
      <div>
        <Label htmlFor="phone">Téléphone</Label>
        <Input id="phone" name="phone" defaultValue={settings.phone} className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={settings.email} className="mt-1.5" />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="address">Adresse / zone d&apos;intervention</Label>
        <Input id="address" name="address" defaultValue={settings.address} className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="instagram">Instagram</Label>
        <Input id="instagram" name="instagram" defaultValue={settings.instagram} className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="facebook">Facebook</Label>
        <Input id="facebook" name="facebook" defaultValue={settings.facebook} className="mt-1.5" />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="bookingUrl">Lien de réservation (Fleeky)</Label>
        <Input id="bookingUrl" name="bookingUrl" defaultValue={settings.planityUrl} className="mt-1.5" />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="hours">Horaires (un par ligne, format &quot;Jour: horaires&quot;)</Label>
        <Textarea id="hours" name="hours" rows={3} defaultValue={hoursText} className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="vatNumber">N° TVA</Label>
        <Input id="vatNumber" name="vatNumber" className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="announcementBar">Bandeau d&apos;annonce (optionnel)</Label>
        <Input id="announcementBar" name="announcementBar" defaultValue={settings.announcementBar} className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="paymentMethods">Moyens de paiement (séparés par des virgules)</Label>
        <Input id="paymentMethods" name="paymentMethods" placeholder="Carte bancaire, Espèces" className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="shippingMethods">Moyens de livraison (séparés par des virgules)</Label>
        <Input id="shippingMethods" name="shippingMethods" placeholder="Colissimo, Mondial Relay" className="mt-1.5" />
      </div>

      {state.error && <p className="sm:col-span-2 text-sm text-destructive">{state.error}</p>}
      {state.success && <p className="sm:col-span-2 text-sm text-foreground">Paramètres enregistrés.</p>}
      <Button type="submit" disabled={isPending} className="sm:col-span-2">
        {isPending ? "Enregistrement…" : "Enregistrer"}
      </Button>
    </form>
  );
}
