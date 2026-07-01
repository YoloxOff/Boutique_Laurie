"use client";

import Script from "next/script";
import { env } from "@/env";
import { useConsentCookie } from "@/lib/use-consent-cookie";

export function AnalyticsScripts() {
  const consent = useConsentCookie();

  if (!consent) return null;

  return (
    <>
      {consent.analytics && env.NEXT_PUBLIC_GA4_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${env.NEXT_PUBLIC_GA4_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${env.NEXT_PUBLIC_GA4_ID}');`}
          </Script>
        </>
      )}

      {consent.analytics && env.NEXT_PUBLIC_GTM_ID && (
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0], j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
            j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl; f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${env.NEXT_PUBLIC_GTM_ID}');`}
        </Script>
      )}

      {consent.marketing && env.NEXT_PUBLIC_META_PIXEL_ID && (
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
            document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${env.NEXT_PUBLIC_META_PIXEL_ID}');
            fbq('track', 'PageView');`}
        </Script>
      )}
    </>
  );
}
