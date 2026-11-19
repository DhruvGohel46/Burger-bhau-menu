// ─── Burger Bhau Store Configuration ─────────────────────────
// Edit this file to update all store details on the landing page.
// After editing, rebuild and redeploy the site.
//
// This is the single source of truth for store information.
// The older shopConfig.ts reads from here automatically.

import { SITE_URL } from "@/lib/siteConfig";

export const STORE = {
    // ─── Store Identity ─────────────────────────────────────
    name: "Burger Bhau",
    branch: "Kothariya",
    tagline: "Fresh burgers, pizza and more",
    phone: "919558941555",
    whatsappNumber: "919558941555",
    websiteUrl: SITE_URL,

    // ─── Hero Section ───────────────────────────────────────
    // Path to hero image (relative to /public or Supabase Storage URL).
    // Can also be changed anytime from the Admin Portal (Settings -> Hero Photo).
    heroImage: "/productimage/burger/burger-tandoori-tadka.jpg",
    // Short headline (7 words max)
    heroHeadline: "Made fresh, right when you order",
    // One line of copy (12 words max)
    heroSubline: "Burgers, pizza, sandwiches and more in Kothariya, Rajkot",

    // ─── Address ────────────────────────────────────────────
    address: {
        street: "Besides Axis Bank, Surbhi Possible 3, Rolex Road, Kothariya",
        city: "Rajkot",
        state: "Gujarat",
        postalCode: "360004",
        country: "IN",
        // Add a landmark to help visitors find you, e.g. "Near XYZ Circle"
        landmark: "Besides Axis Bank, Surbhi Possible 3",
    },

    // ─── Location ───────────────────────────────────────────
    coordinates: {
        lat: 22.23793791286797,
        lng: 70.8121401001821,
    },
    // Distance Card Add-on configuration (editable)
    distanceCard: {
        enabled: true,
        maxDistanceMeters: 2000, // 2 km
        walkingSpeedMetersPerMinute: 80, // 80 m/min (~4.8 km/h walking speed)
        accuracyThresholdMeters: 300, // fallback if GPS accuracy is worse than 300m
        linesFile: "@/app/data/distance-lines.json",
    },
    // Google Maps navigation link (opens turn-by-turn directions on tap)
    mapsDirectionsUrl:
        "https://www.google.com/maps/dir/?api=1&destination=22.23793791286797,70.8121401001821",
    // Google Maps embed URL for the "Find us" section
    mapsEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12244.891247087276!2d70.79826304398604!3d22.245888415627523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959b530de7af957%3A0x13afca3988e94f96!2sBurger%20Bhau!5e1!3m2!1sen!2sin!4v1774524524083!5m2!1sen!2sin",

    // ─── Opening Hours ──────────────────────────────────────
    // 24-hour format. Set both open and close to "" for a closed day.
    hours: {
        monday:    { open: "11:00", close: "23:00" },
        tuesday:   { open: "11:00", close: "23:00" },
        wednesday: { open: "11:00", close: "23:00" },
        thursday:  { open: "11:00", close: "23:00" },
        friday:    { open: "11:00", close: "23:00" },
        saturday:  { open: "11:00", close: "23:00" },
        sunday:    { open: "11:00", close: "23:00" },
    } as Record<string, { open: string; close: string }>,

    // ─── Landing Page: "Most Loved" Items ───────────────────
    // Item IDs from menu.json. These show as large photo cards on the homepage.
    highlightedItems: [
        "burger-bhau-special",
        "burger-tandoori-tadka",
        "burger-korean",
        "fries-loaded",
        "pizza-cheese-burst",
        "sandwich-indori-jumbo",
        "garlic-cheesy-7",
        "burger-african-peri-peri",
    ],

    // ─── Reviews ────────────────────────────────────────────
    // Replace with your real Google rating and reviews.
    // Set googleRating to 0 to hide the reviews section entirely.
    googleRating: 0,
    googleReviewCount: 0,
    reviews: [] as { author: string; text: string; rating: number }[],

    // ─── Google Reviews Add-on Configuration ────────────────
    // Configures the weekly Google Business Profile sync and website review section.
    googleReviews: {
        // Master switch for the reviews section
        enabled: true,
        // Static reviews file loaded by browser after first paint
        reviewsDataUrl: "/data/reviews.json",
        // Google Maps Place link (opens store on Google Maps)
        googleMapsPlaceUrl: "https://www.google.com/maps/place/Burger+Bhau/@22.2458884,70.798263,14z/data=!4m6!3m5!1s0x3959b530de7af957:0x13afca3988e94f96!8m2!3d22.2379379!4d70.8121401!16s%2Fg%2F11w7_0y76j",
        // Direct link to prompt visitor to write a review
        writeReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJV-563jC1WTkRlk-piDnqrxM",
        // Selection filter: Minimum stars (4 or 5 stars only)
        minRating: 4,
        // Selection filter: Minimum comment character length (skips empty or one-word ratings)
        minCommentLength: 40,
        // Selection filter: Maximum age in months (0 = no limit, 24 = last 24 months)
        maxAgeMonths: 24,
        // Maximum reviews shown in the section
        maxDisplayReviews: 6,
        // Section typography & headings
        sectionHeading: "What our customers say",
        sectionSubtitle: "Real Google reviews from our Kothariya, Rajkot store",
        // Weekly server sync job schedule
        scheduleDescription: "Every Monday at 03:00 UTC (08:30 AM IST)",
        scheduleCron: "0 3 * * 1",
        // Set true to preview placeholder cards during local design testing
        showPlaceholdersInDev: false,
    },

    // ─── Google Analytics / Ads ─────────────────────────────
    // Paste your Google tag ID here to enable tracking.
    // Examples: "G-XXXXXXXXXX" (Analytics) or "AW-XXXXXXXXXX" (Ads).
    // Leave empty to keep all tracking off.
    googleTagId: "",

    // ─── Parking / Visit Notes ──────────────────────────────
    // A short note about parking or how to reach the store. Leave empty to hide.
    visitNote: "",
};

// ─── Store Status ───────────────────────────────────────────
// Returns whether the store is currently open and a human-readable status line.
// Runs client-side, computes against IST (Asia/Kolkata).

import type { SpecialHoursConfig } from "../../lib/types";

export interface StoreStatusResult {
    isOpen: boolean;
    statusText: string;
    isSpecialHours?: boolean;
    specialCloseTime?: string;
    specialLabel?: string;
    shiftOriginDate?: string;
}

export function formatTime12(hour: number, minute: number): string {
    const period = hour >= 12 ? "PM" : "AM";
    const h = hour % 12 || 12;
    return `${h}:${String(minute).padStart(2, "0")} ${period}`;
}

export function formatTimeStr(time24: string): string {
    if (!time24) return "";
    const [h, m] = time24.split(":").map(Number);
    return formatTime12(h, m);
}

// Helper to extract IST date parts
export function getIstParts(date: Date = new Date()) {
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "long",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
    });
    const parts = formatter.formatToParts(date);
    const year = parts.find((p) => p.type === "year")?.value || "";
    const month = parts.find((p) => p.type === "month")?.value || "";
    const day = parts.find((p) => p.type === "day")?.value || "";
    const dateStr = `${year}-${month}-${day}`;
    const weekday = (parts.find((p) => p.type === "weekday")?.value || "").toLowerCase();
    const hour = parseInt(parts.find((p) => p.type === "hour")?.value || "0", 10);
    const minute = parseInt(parts.find((p) => p.type === "minute")?.value || "0", 10);
    return { year, month, day, dateStr, weekday, hour, minute, currentMin: hour * 60 + minute };
}

export function getTodayIstDateStr(ref: Date = new Date()): string {
    return getIstParts(ref).dateStr;
}

export function getYesterdayIstDateStr(ref: Date = new Date()): string {
    const yDate = new Date(ref.getTime() - 24 * 60 * 60 * 1000);
    return getIstParts(yDate).dateStr;
}

export function getTomorrowIstDateStr(ref: Date = new Date()): string {
    const tDate = new Date(ref.getTime() + 24 * 60 * 60 * 1000);
    return getIstParts(tDate).dateStr;
}

export function getActiveSpecialHours(
    dateStr: string,
    configs?: SpecialHoursConfig | SpecialHoursConfig[] | null
): SpecialHoursConfig | null {
    if (!configs) return null;
    const list = Array.isArray(configs) ? configs : [configs];
    const found = list.find((item) => item && item.date === dateStr && item.enabled !== false);
    return found || null;
}

export function getStoreStatus(
    customSpecialHours?: SpecialHoursConfig | SpecialHoursConfig[] | null,
    referenceDate?: Date
): StoreStatusResult {
    try {
        const now = referenceDate || new Date();

        // If customSpecialHours wasn't passed directly, check localStorage on client
        let specialConfigs = customSpecialHours;
        if (specialConfigs === undefined && typeof window !== "undefined") {
            try {
                const stored = localStorage.getItem("bb_admin_special_hours");
                if (stored) {
                    specialConfigs = JSON.parse(stored);
                }
            } catch {
                // Ignore localStorage read errors
            }
        }

        const today = getIstParts(now);
        const yesterday = getIstParts(new Date(now.getTime() - 24 * 60 * 60 * 1000));

        // ─── PHASE 1: Check if yesterday's shift crossed midnight into early morning today ───
        const yesterdaySpecial = getActiveSpecialHours(yesterday.dateStr, specialConfigs);
        const yOpenStr = yesterdaySpecial?.open_time || STORE.hours[yesterday.weekday]?.open || "11:00";
        const yCloseStr = yesterdaySpecial ? yesterdaySpecial.close_time : (STORE.hours[yesterday.weekday]?.close || "23:00");

        const [yOpenH, yOpenM] = yOpenStr.split(":").map(Number);
        const [yCloseH, yCloseM] = yCloseStr.split(":").map(Number);
        const yOpenMin = yOpenH * 60 + yOpenM;
        const yCloseMin = yCloseH * 60 + yCloseM;

        // A shift crosses midnight when close_time < open_time (e.g. 02:00 = 120 < 11:00 = 660)
        const yCrossesMidnight = yCloseMin < yOpenMin;
        if (yCrossesMidnight) {
            // Yesterday's shift continues past midnight into today until yCloseMin
            if (today.currentMin < yCloseMin) {
                return {
                    isOpen: true,
                    statusText: yesterdaySpecial
                        ? `Open now · Specially open until ${formatTime12(yCloseH, yCloseM)}`
                        : `Open now · Closes at ${formatTime12(yCloseH, yCloseM)}`,
                    isSpecialHours: Boolean(yesterdaySpecial),
                    specialCloseTime: yCloseStr,
                    specialLabel: yesterdaySpecial?.label || "Special Late Night",
                    shiftOriginDate: yesterday.dateStr,
                };
            }
        }

        // ─── PHASE 2: Evaluate Today's Shift ───
        const todaySpecial = getActiveSpecialHours(today.dateStr, specialConfigs);
        const todayHours = STORE.hours[today.weekday];
        const tOpenStr = todaySpecial?.open_time || todayHours?.open || "11:00";
        const tCloseStr = todaySpecial ? todaySpecial.close_time : (todayHours?.close || "23:00");

        if (!tOpenStr || !tCloseStr) {
            return { isOpen: false, statusText: "Closed today" };
        }

        const [tOpenH, tOpenM] = tOpenStr.split(":").map(Number);
        const [tCloseH, tCloseM] = tCloseStr.split(":").map(Number);
        const tOpenMin = tOpenH * 60 + tOpenM;
        const tCloseMin = tCloseH * 60 + tCloseM;

        const tCrossesMidnight = tCloseMin < tOpenMin;

        if (tCrossesMidnight) {
            // Case A: Today's shift crosses midnight into tomorrow morning
            if (today.currentMin >= tOpenMin) {
                // It is currently between open time and 23:59 tonight
                return {
                    isOpen: true,
                    statusText: todaySpecial
                        ? `Open now · Specially open today until ${formatTime12(tCloseH, tCloseM)}`
                        : `Open now · Closes at ${formatTime12(tCloseH, tCloseM)}`,
                    isSpecialHours: Boolean(todaySpecial),
                    specialCloseTime: tCloseStr,
                    specialLabel: todaySpecial?.label || "Special Late Night",
                    shiftOriginDate: today.dateStr,
                };
            } else {
                // Before today's opening time (and yesterday's late shift is already over)
                return {
                    isOpen: false,
                    statusText: todaySpecial
                        ? `Closed · Opens today at ${formatTime12(tOpenH, tOpenM)} (Specially open until ${formatTime12(tCloseH, tCloseM)})`
                        : `Closed · Opens today at ${formatTime12(tOpenH, tOpenM)}`,
                    isSpecialHours: Boolean(todaySpecial),
                    specialCloseTime: tCloseStr,
                    specialLabel: todaySpecial?.label,
                    shiftOriginDate: today.dateStr,
                };
            }
        } else {
            // Case B: Standard same-day shift (e.g. 11:00 to 23:00 or 23:30)
            if (today.currentMin >= tOpenMin && today.currentMin < tCloseMin) {
                return {
                    isOpen: true,
                    statusText: todaySpecial
                        ? `Open now · Specially open today until ${formatTime12(tCloseH, tCloseM)}`
                        : `Open now · Closes at ${formatTime12(tCloseH, tCloseM)}`,
                    isSpecialHours: Boolean(todaySpecial),
                    specialCloseTime: tCloseStr,
                    specialLabel: todaySpecial?.label,
                    shiftOriginDate: today.dateStr,
                };
            } else if (today.currentMin < tOpenMin) {
                return {
                    isOpen: false,
                    statusText: todaySpecial
                        ? `Closed · Opens today at ${formatTime12(tOpenH, tOpenM)} (Specially open until ${formatTime12(tCloseH, tCloseM)})`
                        : `Closed · Opens today at ${formatTime12(tOpenH, tOpenM)}`,
                    isSpecialHours: Boolean(todaySpecial),
                    specialCloseTime: tCloseStr,
                    shiftOriginDate: today.dateStr,
                };
            } else {
                // After closing — check next open day
                const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
                const todayIndex = days.indexOf(today.weekday);
                for (let i = 1; i <= 7; i++) {
                    const nextDayIndex = (todayIndex + i) % 7;
                    const nextDay = days[nextDayIndex];
                    const nextDate = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
                    const nextDateStr = getIstParts(nextDate).dateStr;
                    const nextSpecial = getActiveSpecialHours(nextDateStr, specialConfigs);
                    const nextHours = STORE.hours[nextDay];
                    const nOpenStr = nextSpecial?.open_time || nextHours?.open;
                    if (nOpenStr) {
                        const [nh, nm] = nOpenStr.split(":").map(Number);
                        const label = i === 1 ? "tomorrow" : nextDay.charAt(0).toUpperCase() + nextDay.slice(1);
                        return {
                            isOpen: false,
                            statusText: `Closed · Opens ${label} at ${formatTime12(nh, nm)}`,
                        };
                    }
                }
                return { isOpen: false, statusText: "Closed" };
            }
        }
    } catch {
        return { isOpen: false, statusText: "" };
    }
}
