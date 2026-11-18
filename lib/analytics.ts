// ─── Analytics & Event Tracking ─────────────────────────────
// Events fire to Google Analytics / Ads when a tag ID is configured in storeConfig.
// UTM parameters from ad clicks are captured into sessionStorage.

import { STORE } from "@/app/data/storeConfig";

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
        dataLayer?: unknown[];
    }
}

/**
 * Track a named event. Fires to Google Analytics/Ads when configured,
 * and logs to the console in development.
 *
 * Usage:
 *   trackEvent("directions_click")
 *   trackEvent("call_click", { source: "hero" })
 */
export function trackEvent(
    eventName: string,
    params?: Record<string, string>,
): void {
    if (typeof window === "undefined") return;

    const utmParams = getUtmParams();
    const allParams = { ...utmParams, ...params };

    if (window.gtag && STORE.googleTagId) {
        window.gtag("event", eventName, allParams);
    }

    if (process.env.NODE_ENV === "development") {
        console.log(`[analytics] ${eventName}`, allParams);
    }
}

/**
 * Capture UTM parameters from the current URL and store them
 * in sessionStorage so they persist across page navigations.
 * Call once on the landing page mount.
 */
export function captureUtmParams(): void {
    if (typeof window === "undefined") return;

    try {
        const url = new URL(window.location.href);
        const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

        const params: Record<string, string> = {};
        let hasUtm = false;

        for (const key of utmKeys) {
            const value = url.searchParams.get(key);
            if (value) {
                params[key] = value;
                hasUtm = true;
            }
        }

        if (hasUtm) {
            sessionStorage.setItem("bb_utm", JSON.stringify(params));
        }
    } catch {
        // sessionStorage or URL API unavailable
    }
}

/**
 * Retrieve stored UTM parameters from sessionStorage.
 */
export function getUtmParams(): Record<string, string> {
    if (typeof window === "undefined") return {};

    try {
        const stored = sessionStorage.getItem("bb_utm");
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
}
