import { getSiteSettings } from "@/lib/content/site-settings";

export async function AnnouncementBar() {
  const settings = await getSiteSettings();
  const message = settings.announcementBar || "Livraison offerte dès 49€ d'achat • Click & Collect gratuit";

  return (
    <div className="bg-primary py-2 text-center text-xs font-medium tracking-wide text-primary-foreground">
      {message}
    </div>
  );
}
