// app/components/AnalyticsProvider.tsx

"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
const Cookies = require('js-cookie');
import { CookieConsent } from "./CookieConsent";

const AnalyticsProvider = () => {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  // Check for existing consent
  useEffect(() => {
    const consent = Cookies.get("cookie_consent");
    if (consent === "accepted") {
      setAnalyticsEnabled(true);
      setConsentGiven(true);
    } else if (consent === "declined") {
      setConsentGiven(true);
    }
  }, []);

  const handleAccept = () => {
    setAnalyticsEnabled(true);
    setConsentGiven(true);
    Cookies.set("cookie_consent", "accepted", { expires: 365 });
  };

  const handleDecline = () => {
    setConsentGiven(true);
    Cookies.set("cookie_consent", "declined", { expires: 365 });
  };

  return (
    <>
      {analyticsEnabled && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=G-DVH285RDFB`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-DVH285RDFB', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}
      {!consentGiven && (
        <CookieConsent onAccept={handleAccept} onDecline={handleDecline} />
      )}
    </>
  );
};

export default AnalyticsProvider;
