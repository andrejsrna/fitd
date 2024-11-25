// app/components/AnalyticsProvider.tsx

"use client";

import { useState } from 'react';
import Script from 'next/script';
import CookieConsent from 'react-cookie-consent';

const AnalyticsProvider = () => {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  return (
    <>
      {analyticsEnabled && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_TRACKING_ID', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}
      <CookieConsent
        onAccept={() => setAnalyticsEnabled(true)}
        enableDeclineButton
        declineButtonText="Odmietnuť"
        buttonText="Prijať"
      >
        Tento web používa cookies na zlepšenie vášho zážitku. Môžete prijať alebo odmietnuť sledovacie cookies.
      </CookieConsent>
    </>
  );
};

export default AnalyticsProvider;
