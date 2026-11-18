"use client";

import { useEffect, useState } from "react";
import { getStoreStatus, StoreStatusResult } from "@/app/data/storeConfig";
import { supabase } from "@/lib/supabase";
import styles from "./StoreStatusBadge.module.css";

export default function StoreStatusBadge() {
    const [status, setStatus] = useState<StoreStatusResult>(() => getStoreStatus());

    useEffect(() => {
        // Initial compute
        setStatus(getStoreStatus());

        // Fetch latest special hours from Supabase in background
        async function syncSpecialHours() {
            try {
                const { data } = await supabase
                    .from("shop_settings")
                    .select("special_hours")
                    .eq("id", 1)
                    .single();
                if (data && data.special_hours !== undefined) {
                    try {
                        localStorage.setItem("bb_admin_special_hours", JSON.stringify(data.special_hours));
                    } catch {
                        // ignore
                    }
                    setStatus(getStoreStatus(data.special_hours));
                }
            } catch {
                // Keep current status
            }
        }
        syncSpecialHours();

        // Listen for admin changes dispatched in same or other tabs
        const handleAdminUpdate = (e?: Event) => {
            const detail = (e as CustomEvent)?.detail;
            setStatus(getStoreStatus(detail !== undefined ? detail : undefined));
        };

        window.addEventListener("bb_special_hours_updated", handleAdminUpdate);
        window.addEventListener("storage", handleAdminUpdate);

        // Update every 30 seconds to react to minute rollovers
        const timer = setInterval(() => {
            setStatus(getStoreStatus());
        }, 30000);

        return () => {
            clearInterval(timer);
            window.removeEventListener("bb_special_hours_updated", handleAdminUpdate);
            window.removeEventListener("storage", handleAdminUpdate);
        };
    }, []);

    if (!status.statusText) return null;

    const isSpecial = Boolean(status.isSpecialHours);
    const badgeStyle = `${styles.badge} ${
        status.isOpen
            ? isSpecial
                ? styles.openSpecial
                : styles.open
            : styles.closed
    }`;

    return (
        <div className={badgeStyle} role="status" aria-live="polite">
            {isSpecial && <span className={styles.moonIcon} aria-hidden="true">🌙</span>}
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.text}>{status.statusText}</span>
        </div>
    );
}
