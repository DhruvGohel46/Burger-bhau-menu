// This component checks user geolocation and compares it against dynamic store delivery area and minimum order value settings.
"use client";

import { useState, useCallback, useEffect } from "react";
import { selectCartTotal, useCartStore } from "@/app/store/cartStore";
import {
    SHOP_LAT,
    SHOP_LNG,
    getHaversineDistance,
} from "@/app/data/shopConfig";
import { supabase } from "@/lib/supabase";
import { ShopSettings } from "@/lib/types";
import styles from "./DeliveryChecker.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

type DeliveryStatus = "idle" | "loading" | "available" | "too_far" | "low_cart" | "error";

export default function DeliveryChecker({
    settings: initialSettings,
    onResult,
}: {
    settings?: ShopSettings | null;
    onResult?: (ok: boolean) => void;
}) {
    const cartTotal = useCartStore(selectCartTotal);
    const [status, setStatus] = useState<DeliveryStatus>("idle");
    const [distance, setDistance] = useState<number | null>(null);
    const [settings, setSettings] = useState<ShopSettings | null>(initialSettings || null);

    useEffect(() => {
        if (initialSettings) {
            setSettings(initialSettings);
            return;
        }

        async function loadShopSettings() {
            try {
                const { data } = await supabase.from("shop_settings").select("*").eq("id", 1).single();
                if (data) setSettings(data as ShopSettings);
            } catch (err) {}
        }
        loadShopSettings();
    }, [initialSettings]);

    const maxRadiusMeters = settings?.delivery_radius_meters ?? 400;
    const minOrderAmount = settings?.min_order_for_delivery ?? 500;

    const formatDist = (meters: number) => {
        if (meters >= 1000) {
            return `${(meters / 1000).toFixed(1)} km`;
        }
        return `${meters} m`;
    };

    const checkDelivery = useCallback(() => {
        if (cartTotal < minOrderAmount) {
            setStatus("low_cart");
            onResult?.(false);
            return;
        }

        if (!navigator.geolocation) {
            setStatus("error");
            onResult?.(false);
            return;
        }

        setStatus("loading");

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const dist = getHaversineDistance(
                    pos.coords.latitude,
                    pos.coords.longitude,
                    SHOP_LAT,
                    SHOP_LNG
                );
                const roundedDist = Math.round(dist);
                setDistance(roundedDist);

                const inRange = roundedDist <= maxRadiusMeters;
                const meetsMinOrder = cartTotal >= minOrderAmount;

                const ok = inRange && meetsMinOrder;
                if (ok) {
                    setStatus("available");
                } else if (!inRange) {
                    setStatus("too_far");
                } else {
                    setStatus("low_cart");
                }
                onResult?.(ok);
            },
            () => {
                setStatus("error");
                onResult?.(false);
            },
            { enableHighAccuracy: false, timeout: 15000 }
        );
    }, [cartTotal, maxRadiusMeters, minOrderAmount, onResult]);

    // Update status if cartTotal changes below minOrderAmount
    useEffect(() => {
        if (cartTotal < minOrderAmount) {
            onResult?.(false);
        }
    }, [cartTotal, minOrderAmount, onResult]);

    if (cartTotal < minOrderAmount) {
        return (
            <div className={`${styles.badge} ${styles.unavailable}`}>
                <span className={styles.icon}>⚠️</span>
                <div>
                    <strong>Minimum ₹{minOrderAmount} cart required for delivery</strong>
                    <span className={styles.sub}>
                        Current cart: ₹{cartTotal}. Add ₹{minOrderAmount - cartTotal} more to check delivery eligibility.
                    </span>
                </div>
            </div>
        );
    }

    if (status === "idle") {
        return (
            <button onClick={checkDelivery} className={styles.checkBtn}>
                <FontAwesomeIcon icon={faLocationDot} width={14} height={14} />
                Check Delivery Availability ({formatDist(maxRadiusMeters)} area radius)
            </button>
        );
    }

    if (status === "loading") {
        return (
            <div className={styles.badge}>
                <span className={styles.spinner} />
                Checking your location…
            </div>
        );
    }

    if (status === "available" && distance !== null) {
        return (
            <div className={`${styles.badge} ${styles.available}`}>
                <span className={styles.icon}>✅</span>
                <div>
                    <strong>Home Delivery Available</strong>
                    <span className={styles.sub}>
                        You are {formatDist(distance)} away (within {formatDist(maxRadiusMeters)} delivery area & cart meets min ₹{minOrderAmount}).
                    </span>
                </div>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className={`${styles.badge} ${styles.unavailable}`}>
                <span className={styles.icon}>📍</span>
                <div>
                    <strong>Location unavailable</strong>
                    <span className={styles.sub}>
                        Please enable location access and try again.
                    </span>
                    <button onClick={checkDelivery} className={styles.retryBtn}>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.badge} ${styles.unavailable}`}>
            <span className={styles.icon}>⚠️</span>
            <div>
                <strong>Delivery Unavailable</strong>
                <span className={styles.sub}>
                    {status === "too_far" && distance !== null && `You're ${formatDist(distance)} away (max delivery radius: ${formatDist(maxRadiusMeters)}).`}
                    {status === "low_cart" && `Minimum order value of ₹${minOrderAmount} not met (current: ₹${cartTotal}).`}
                    {" "}You can still place a Self Pickup order.
                </span>
            </div>
        </div>
    );
}
