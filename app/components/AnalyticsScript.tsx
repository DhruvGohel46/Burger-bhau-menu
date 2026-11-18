"use client";

import { useEffect } from "react";
import Script from "next/script";
import { STORE } from "@/app/data/storeConfig";
import { captureUtmParams } from "@/lib/analytics";

export default function AnalyticsScript() {
    useEffect(() => {
        captureUtmParams();
    }, []);

    if (!STORE.googleTagId) {
        return null;
    }

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${STORE.googleTagId}`}
                strategy="afterInteractive"
            />
            <Script id="google-gtag" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${STORE.googleTagId}', {
                        page_path: window.location.pathname,
                    });
                `}
            </Script>
        </>
    );
}
