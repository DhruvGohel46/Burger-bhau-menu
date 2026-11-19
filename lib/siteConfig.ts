/**
 * Central site configuration and canonical URL definition.
 * Single source of truth for the primary website domain.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://burgerbhaukothariya.in").replace(/\/+$/, "");
