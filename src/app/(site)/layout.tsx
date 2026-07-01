import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CookieConsentBanner } from "@/components/marketing/cookie-consent-banner";
import { AnalyticsScripts } from "@/components/marketing/analytics-scripts";
import { ChatWidget } from "@/components/marketing/chat-widget";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatWidget />
      <CookieConsentBanner />
      <AnalyticsScripts />
    </>
  );
}
