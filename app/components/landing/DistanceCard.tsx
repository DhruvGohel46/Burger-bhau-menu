"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faLocationDot,
    faPersonWalking,
} from "@fortawesome/free-solid-svg-icons";
import { STORE } from "@/app/data/storeConfig";
import { trackEvent } from "@/lib/analytics";
import linesData from "@/app/data/distance-lines.json";
import styles from "./DistanceCard.module.css";

type CardStatus = "loading" | "located" | "fallback";

interface FormattedLine {
    text: string;
    distanceText: string;
    walkText: string;
    bandNumber: number;
}

const STORAGE_KEY_LAST_LINE = "burger_bhau_last_distance_line";

/**
 * Straight-line Haversine distance formula in meters.
 * Calculated strictly on the visitor's device; no coordinates are sent to servers.
 */
function calculateHaversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371000; // Earth mean radius in meters
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Format distance according to requirements:
 * Under 1 km: meters rounded to nearest 10 (e.g., "120 meters")
 * From 1 km: kilometres with one decimal (e.g., "1.4 km")
 */
function formatDistance(meters: number): string {
    if (meters < 1000) {
        const rounded = Math.max(10, Math.round(meters / 10) * 10);
        return `${rounded} meters`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Format walking time (used only for distances under 500 meters).
 * Default speed: 80 meters per minute, rounded up.
 */
function formatWalkTime(meters: number, speed = 80): string {
    const mins = Math.max(1, Math.ceil(meters / speed));
    return `${mins} minute${mins === 1 ? "" : "s"}`;
}

/**
 * Identify distance band (1 through 8).
 */
function getBand(meters: number): { bandNumber: number; key: keyof typeof linesData } | null {
    if (meters < 100) return { bandNumber: 1, key: "band1" };
    if (meters < 200) return { bandNumber: 2, key: "band2" };
    if (meters < 300) return { bandNumber: 3, key: "band3" };
    if (meters < 400) return { bandNumber: 4, key: "band4" };
    if (meters < 500) return { bandNumber: 5, key: "band5" };
    if (meters < 1000) return { bandNumber: 6, key: "band6" };
    if (meters < 1500) return { bandNumber: 7, key: "band7" };
    if (meters <= 2000) return { bandNumber: 8, key: "band8" };
    return null;
}

/**
 * Shuffle helper: picks a random line from list, ensuring no immediate repetition on device.
 */
function pickLineWithoutImmediateRepeat(candidates: string[]): string {
    if (!candidates || candidates.length === 0) return "";
    let lastLine = "";
    try {
        lastLine = localStorage.getItem(STORAGE_KEY_LAST_LINE) || "";
    } catch {
        // localStorage unavailable (e.g. private browsing restriction)
    }

    const available = candidates.filter((l) => l !== lastLine);
    const pool = available.length > 0 ? available : candidates;
    const picked = pool[Math.floor(Math.random() * pool.length)];

    try {
        localStorage.setItem(STORAGE_KEY_LAST_LINE, picked);
    } catch {
        // Ignore storage errors
    }
    return picked;
}

function renderHighlightedDistance(text: string, distanceText: string) {
    if (!distanceText || !text.includes(distanceText)) return text;
    const parts = text.split(distanceText);
    return (
        <>
            {parts[0]}
            <strong className={styles.distanceHighlight}>{distanceText}</strong>
            {parts.slice(1).join(distanceText)}
        </>
    );
}

export default function DistanceCard() {
    const storeLat = STORE.coordinates?.lat;
    const storeLng = STORE.coordinates?.lng;
    const cardConfig = STORE.distanceCard;

    const [status, setStatus] = useState<CardStatus>("loading");
    const [lineInfo, setLineInfo] = useState<FormattedLine | null>(null);
    const [fallbackLine, setFallbackLine] = useState<string>("");

    const watchIdRef = useRef<number | null>(null);
    const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
    const activeBandRef = useRef<number | null>(null);
    const activeTemplateRef = useRef<string>("");
    const hasTrackedShownRef = useRef<boolean>(false);

    // Apply distance template
    const interpolateLine = useCallback(
        (template: string, meters: number, bandNum: number): FormattedLine => {
            const distStr = formatDistance(meters);
            const walkStr = formatWalkTime(meters, cardConfig?.walkingSpeedMetersPerMinute || 80);
            let result = template.replace(/\{distance\}/g, distStr);
            if (bandNum <= 5) {
                result = result.replace(/\{walk\}/g, walkStr);
            }
            return {
                text: result,
                distanceText: distStr,
                walkText: bandNum <= 5 ? walkStr : "",
                bandNumber: bandNum,
            };
        },
        [cardConfig?.walkingSpeedMetersPerMinute]
    );

    // Trigger soft fallback state
    const triggerFallback = useCallback(() => {
        if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
        const picked = pickLineWithoutImmediateRepeat(linesData.fallback);
        setFallbackLine(picked);
        setStatus("fallback");
        if (!hasTrackedShownRef.current) {
            trackEvent("distance_card_shown", { band: "fallback" });
            hasTrackedShownRef.current = true;
        }
    }, []);

    // Directly ask the browser for position on load (browser shows native permission dialog)
    useEffect(() => {
        if (!storeLat || !storeLng || !cardConfig?.enabled) {
            return;
        }

        if (typeof window === "undefined" || !navigator.geolocation) {
            triggerFallback();
            return;
        }

        // 8-second safety timeout
        timeoutIdRef.current = setTimeout(() => {
            triggerFallback();
        }, 8000);

        try {
            watchIdRef.current = navigator.geolocation.watchPosition(
                (position) => {
                    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);

                    const accuracy = position.coords.accuracy;
                    const maxAccuracy = cardConfig?.accuracyThresholdMeters || 300;

                    if (accuracy > maxAccuracy) {
                        triggerFallback();
                        return;
                    }

                    const dist = calculateHaversineDistance(
                        storeLat,
                        storeLng,
                        position.coords.latitude,
                        position.coords.longitude
                    );

                    const maxDist = cardConfig?.maxDistanceMeters || 2000;
                    if (dist > maxDist) {
                        triggerFallback();
                        return;
                    }

                    const bandInfo = getBand(dist);
                    if (!bandInfo) {
                        triggerFallback();
                        return;
                    }

                    // Only reshuffle template when entering a new band or on first fix
                    if (activeBandRef.current !== bandInfo.bandNumber) {
                        activeBandRef.current = bandInfo.bandNumber;
                        const candidateLines = linesData[bandInfo.key] as string[];
                        const picked = pickLineWithoutImmediateRepeat(candidateLines);
                        activeTemplateRef.current = picked;

                        if (!hasTrackedShownRef.current) {
                            trackEvent("distance_card_shown", { band: String(bandInfo.bandNumber) });
                            hasTrackedShownRef.current = true;
                        }
                    }

                    const formatted = interpolateLine(activeTemplateRef.current, dist, bandInfo.bandNumber);
                    setLineInfo(formatted);
                    setStatus("located");
                },
                (error) => {
                    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
                    if (error.code === error.PERMISSION_DENIED) {
                        trackEvent("distance_permission_denied");
                    }
                    triggerFallback();
                },
                {
                    enableHighAccuracy: true,
                    timeout: 8000,
                    maximumAge: 10000,
                }
            );
        } catch {
            triggerFallback();
        }

        return () => {
            if (watchIdRef.current !== null && navigator.geolocation) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
        };
    }, [
        storeLat,
        storeLng,
        cardConfig?.enabled,
        cardConfig?.accuracyThresholdMeters,
        cardConfig?.maxDistanceMeters,
        interpolateLine,
        triggerFallback,
    ]);

    // If store coordinates are missing, gracefully hide card without layout jump
    if (!storeLat || !storeLng || !cardConfig?.enabled) {
        return null;
    }

    return (
        <aside className={styles.card} aria-label="Distance to Burger Bhau" aria-live="polite">
            {/* Loading / Checking State */}
            {status === "loading" && (
                <div className={styles.loadingWrap}>
                    <div className={styles.metaRow}>
                        <div className={styles.metaLeft}>
                            <span className={styles.pulseDot} aria-hidden="true" />
                            <span className={styles.metaLabel}>Checking how close you are to Burger Bhau...</span>
                        </div>
                    </div>
                    <div className={styles.skeletonLine} />
                    <div className={styles.skeletonShort} />
                </div>
            )}

            {/* Within 2 km (Located) */}
            {status === "located" && lineInfo && (
                <div className={styles.contentWrap}>
                    <div className={styles.metaRow}>
                        <div className={styles.metaLeft}>
                            <span className={styles.pulseDot} aria-hidden="true" />
                            <span className={styles.metaLabel}>Live Distance · {lineInfo.distanceText}</span>
                        </div>
                        {lineInfo.walkText && (
                            <span className={styles.walkBadge}>
                                <FontAwesomeIcon icon={faPersonWalking} className={styles.badgeIcon} aria-hidden="true" />
                                <span>~{lineInfo.walkText} walk</span>
                            </span>
                        )}
                    </div>

                    <p className={styles.headline}>
                        {renderHighlightedDistance(lineInfo.text, lineInfo.distanceText)}
                    </p>
                </div>
            )}

            {/* Fallback State (Over 2 km, Permission Denied, or Unavailable) */}
            {status === "fallback" && (
                <div className={styles.contentWrap}>
                    <div className={styles.metaRow}>
                        <div className={styles.metaLeft}>
                            <FontAwesomeIcon icon={faLocationDot} className={styles.metaIcon} aria-hidden="true" />
                            <span className={styles.metaLabel}>Burger Bhau · Kothariya, Rajkot</span>
                        </div>
                    </div>

                    <p className={styles.headline}>
                        {fallbackLine || "Aavo ne bhau, Burger Bhau Kothariya ma tamari raah joi rahyu chhe!"}
                    </p>
                </div>
            )}
        </aside>
    );
}
