'use client'

import Script from 'next/script'
import type { Report } from '@/sanity/types'

export function AnalyticsScripts({ report }: { report: Report }) {
  return (
    <>
      {report.gaTrackingId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${report.gaTrackingId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${report.gaTrackingId}');
            `}
          </Script>
        </>
      )}

      {report.facebookPixelId && (
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${report.facebookPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {report.googleAdsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${report.googleAdsId}`}
            strategy="afterInteractive"
          />
          <Script id="gads-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${report.googleAdsId}');
            `}
          </Script>
        </>
      )}

      {report.segmentWriteKey && (
        <Script id="segment-init" strategy="afterInteractive">
          {`
            !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="${report.segmentWriteKey}";analytics.SNIPPET_VERSION="4.16.1";
            analytics.load("${report.segmentWriteKey}");
            analytics.page();
            }}();
          `}
        </Script>
      )}
    </>
  )
}
