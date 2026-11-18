"use client";

import { useState, useEffect } from "react";
import { STORE } from "@/app/data/storeConfig";

export interface StoreDistanceInfo {
    meters: number;
    distanceText: string;
    walkText: string;
    isWithinReach: boolean;
}

/**
 * Calculates straight-line distance on client device using Haversine formula.
 */
export function calculateHaversineDistance(
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

export function formatDistanceString(meters: number): string {
    if (meters < 1000) {
        const rounded = Math.max(10, Math.round(meters / 10) * 10);
        return `${rounded} meters`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
}

export function formatWalkTimeString(meters: number, speed = 80): string {
    const mins = Math.max(1, Math.ceil(meters / speed));
    return `${mins} minute${mins === 1 ? "" : "s"}`;
}

/**
 * Shared React hook to observe live distance from visitor to Burger Bhau store.
 */
export function useStoreDistance() {
    const [distanceInfo, setDistanceInfo] = useState<StoreDistanceInfo | null>(null);

    useEffect(() => {
        if (typeof window === "undefined" || !navigator.geolocation) return;
        const storeLat = STORE.coordinates?.lat;
        const storeLng = STORE.coordinates?.lng;
        if (!storeLat || !storeLng) return;

        const maxAccuracy = STORE.distanceCard?.accuracyThresholdMeters || 300;
        const walkingSpeed = STORE.distanceCard?.walkingSpeedMetersPerMinute || 80;
        const maxDist = STORE.distanceCard?.maxDistanceMeters || 2000;

        let watchId: number | null = null;
        try {
            watchId = navigator.geolocation.watchPosition(
                (pos) => {
                    if (pos.coords.accuracy > maxAccuracy) return;

                    const meters = calculateHaversineDistance(
                        storeLat,
                        storeLng,
                        pos.coords.latitude,
                        pos.coords.longitude
                    );

                    const dText = formatDistanceString(meters);
                    const wText = meters < 500 ? formatWalkTimeString(meters, walkingSpeed) : "";

                    setDistanceInfo({
                        meters,
                        distanceText: dText,
                        walkText: wText,
                        isWithinReach: meters <= maxDist,
                    });
                },
                () => {},
                { enableHighAccuracy: true, maximumAge: 10000, timeout: 8000 }
            );
        } catch {
            // Geolocation blocked or not available
        }

        return () => {
            if (watchId !== null && navigator.geolocation) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, []);

    return distanceInfo;
}
