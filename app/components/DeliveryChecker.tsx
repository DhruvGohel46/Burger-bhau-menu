// This component checks user geolocation and compares it against the strict 400m delivery radius policy around the shop.
"use client";

import { useState, useCallback } from "react";
import { selectCartTotal, useCartStore } from "@/app/store/cartStore";
import {
    SHOP_LAT,
    SHOP_LNG,
    DELIVERY_RADIUS_METERS,
    MIN_ORDER_FOR_DELIVERY,
    DELIVERY_RADIUS_NEAR,
    MIN_ORDER_NEAR,
    getHaversineDistance,
} from "@/app/data/shopConfig";
import styles from "./DeliveryChecker.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

type DeliveryStatus = "idle" | "loading" | "available" | "too_far" | "low_cart" | "both_fail" | "error";

export default function DeliveryChecker({ onResult }: { onResult?: (ok: boolean) => void }) {
    const cartTotal = useCartStore(selectCartTotal);
    const [status, setStatus] = useState<DeliveryStatus>("idle");
    const [distance, setDistance] = useState<number | null>(null);

    const checkDelivery = useCallback(() => {
        if (cartTotal <= MIN_ORDER_NEAR) {
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
                setDistance(Math.round(dist));

                const inRangeNear = dist <= DELIVERY_RADIUS_NEAR;
                const meetsMinNear = cartTotal > MIN_ORDER_NEAR;
                const inRangeFar = dist <= DELIVERY_RADIUS_METERS;
                const meetsMinFar = cartTotal >= MIN_ORDER_FOR_DELIVERY;

                const ok = (inRangeNear && meetsMinNear) || (inRangeFar && meetsMinFar);
                if (ok) {
                    setStatus("available");
                } else if (!inRangeFar) {
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
    }, [cartTotal, onResult]);

    if (cartTotal <= MIN_ORDER_NEAR) {
        return (
            <div className={`${styles.badge} ${styles.unavailable}`}>
                <span className={styles.icon}>⚠️</span>
                <div>
                    <strong>Minimum ₹{MIN_ORDER_NEAR + 1} required for shortest distance</strong>
                    <span className={styles.sub}>
                        Add more items to check delivery availability.
                    </span>
                </div>
            </div>
        );
    }

    if (status === "idle") {
        return (
            <button onClick={checkDelivery} className={styles.checkBtn}>
                <FontAwesomeIcon icon={faLocationDot} width={14} height={14} />
                Check Delivery Availability
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

    if (status === "available") {
        return (
            <div className={`${styles.badge} ${styles.available}`}>
                <span className={styles.icon}>✅</span>
                <div>
                    <strong>Home Delivery Available</strong>
                    <span className={styles.sub}>
                        You are {distance}m away. Delivery is eligible based on distance and order total.
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

    // too_far, low_cart, both_fail
    return (
        <div className={`${styles.badge} ${styles.unavailable}`}>
            <span className={styles.icon}>⚠️</span>
            <div>
                <strong>Delivery Unavailable</strong>
                <span className={styles.sub}>
                    {status === "too_far" && `You're ${distance}m away (max ${DELIVERY_RADIUS_METERS}m).`}
                    {status === "low_cart" && `Minimum order for your distance not met (current: ₹${cartTotal}).`}
                    {status === "both_fail" && `You're ${distance}m away & cart total is too low.`}
                    {" "}You can still place a Pickup order.
                </span>
            </div>
        </div>
    );
}
