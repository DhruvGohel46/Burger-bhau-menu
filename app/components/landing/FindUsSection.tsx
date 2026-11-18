"use client";

import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faLocationDot,
    faClock,
    faPhone,
    faDiamondTurnRight,
    faSquareParking,
} from "@fortawesome/free-solid-svg-icons";
import {
    STORE,
    formatTimeStr,
    getTodayIstDateStr,
    getActiveSpecialHours,
} from "@/app/data/storeConfig";
import { SpecialHoursConfig } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { trackEvent } from "@/lib/analytics";
import { useStoreDistance } from "@/lib/useStoreDistance";
import StoreStatusBadge from "@/app/components/StoreStatusBadge";
import styles from "./FindUsSection.module.css";

const DAY_ORDER = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
];

export default function FindUsSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const hasTrackedRef = useRef(false);
    const distanceInfo = useStoreDistance();

    const [specialHours, setSpecialHours] = useState<SpecialHoursConfig | SpecialHoursConfig[] | null>(() => {
        if (typeof window !== "undefined") {
            try {
                const stored = localStorage.getItem("bb_admin_special_hours");
                return stored ? JSON.parse(stored) : null;
            } catch {
                return null;
            }
        }
        return null;
    });

    useEffect(() => {
        async function fetchSpecialHours() {
            try {
                const { data } = await supabase
                    .from("shop_settings")
                    .select("special_hours")
                    .eq("id", 1)
                    .single();
                if (data && data.special_hours !== undefined) {
                    setSpecialHours(data.special_hours);
                }
            } catch {
                // keep
            }
        }
        fetchSpecialHours();

        const handleUpdate = (e?: Event) => {
            const detail = (e as CustomEvent)?.detail;
            if (detail !== undefined) {
                setSpecialHours(detail);
            } else if (typeof window !== "undefined") {
                try {
                    const stored = localStorage.getItem("bb_admin_special_hours");
                    setSpecialHours(stored ? JSON.parse(stored) : null);
                } catch {
                    // ignore
                }
            }
        };

        window.addEventListener("bb_special_hours_updated", handleUpdate);
        window.addEventListener("storage", handleUpdate);
        return () => {
            window.removeEventListener("bb_special_hours_updated", handleUpdate);
            window.removeEventListener("storage", handleUpdate);
        };
    }, []);

    // Track scroll to Find Us section once
    useEffect(() => {
        const el = sectionRef.current;
        if (!el || typeof IntersectionObserver === "undefined") return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasTrackedRef.current) {
                    hasTrackedRef.current = true;
                    trackEvent("find_us_scroll");
                }
            },
            { threshold: 0.25 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const todayKey = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        weekday: "long",
    })
        .format(new Date())
        .toLowerCase();

    const todayDateStr = getTodayIstDateStr();
    const todaySpecial = getActiveSpecialHours(todayDateStr, specialHours);

    return (
        <section
            id="find-us"
            ref={sectionRef}
            className={styles.section}
            aria-labelledby="find-us-heading"
        >
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.headBlock}>
                    <h2 id="find-us-heading" className={styles.title}>
                        Visit us in Kothariya
                    </h2>
                    <p className={styles.lead}>
                        Located besides Axis Bank, Surbhi Possible 3, Rolex Road, Kothariya, Rajkot. Fresh burgers and snacks ready in minutes.
                    </p>
                    {distanceInfo && (
                        <div className={styles.liveDistanceBadge}>
                            <span className={styles.pulseDot} aria-hidden="true" />
                            <span className={styles.liveDistanceText}>
                                You are currently <strong>{distanceInfo.distanceText}</strong> away from Burger Bhau
                                {distanceInfo.walkText && <span className={styles.walkSub}> · ~{distanceInfo.walkText} walk</span>}
                            </span>
                        </div>
                    )}
                </div>

                <div className={styles.grid}>
                    {/* Left: Map */}
                    <div className={styles.mapCard}>
                        <iframe
                            src={STORE.mapsEmbedUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={`Google Map for ${STORE.name} ${STORE.branch}`}
                            className={styles.mapIframe}
                        />
                    </div>

                    {/* Right: Info, Address, Hours */}
                    <div className={styles.infoCol}>
                        {/* Address Block */}
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.iconCircle} aria-hidden="true">
                                    <FontAwesomeIcon icon={faLocationDot} />
                                </div>
                                <div className={styles.headerTitles}>
                                    <h3 className={styles.cardTitle}>Store Address</h3>
                                    {distanceInfo && (
                                        <span className={styles.distanceChip}>
                                            📍 {distanceInfo.distanceText} away {distanceInfo.walkText && `(~${distanceInfo.walkText} walk)`}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <address className={styles.addressText}>
                                <strong>{STORE.name} ({STORE.branch})</strong>
                                <br />
                                {STORE.address.street}
                                <br />
                                {STORE.address.city}, {STORE.address.state} ({STORE.address.postalCode})
                            </address>

                            {STORE.address.landmark && (
                                <p className={styles.landmark}>
                                    <span className={styles.landmarkLabel}>Landmark:</span> {STORE.address.landmark}
                                </p>
                            )}

                            {STORE.visitNote && (
                                <div className={styles.visitNote}>
                                    <FontAwesomeIcon icon={faSquareParking} className={styles.noteIcon} />
                                    <span>{STORE.visitNote}</span>
                                </div>
                            )}

                            <div className={styles.btnRow}>
                                <a
                                    href={STORE.mapsDirectionsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => trackEvent("directions_click", { source: "find_us_card" })}
                                    className={styles.primaryBtn}
                                >
                                    <FontAwesomeIcon icon={faDiamondTurnRight} />
                                    <span>Get Directions</span>
                                </a>
                                <a
                                    href={`tel:+${STORE.phone}`}
                                    onClick={() => trackEvent("call_click", { source: "find_us_card" })}
                                    className={styles.secondaryBtn}
                                >
                                    <FontAwesomeIcon icon={faPhone} />
                                    <span>Call Store</span>
                                </a>
                            </div>
                        </div>

                        {/* Opening Hours Block */}
                        <div className={styles.card}>
                            <div className={styles.cardHeaderWithBadge}>
                                <div className={styles.cardHeaderLeft}>
                                    <div className={styles.iconCircle} aria-hidden="true">
                                        <FontAwesomeIcon icon={faClock} />
                                    </div>
                                    <h3 className={styles.cardTitle}>Opening Hours</h3>
                                </div>
                                <StoreStatusBadge />
                            </div>

                            <table className={styles.hoursTable}>
                                <tbody>
                                    {DAY_ORDER.map(({ key, label }) => {
                                        const dayHours = STORE.hours[key];
                                        const isToday = key === todayKey;
                                        let timeDisplay = "Closed";
                                        let isDaySpecial = false;

                                        if (isToday && todaySpecial) {
                                            isDaySpecial = true;
                                            const openTime = todaySpecial.open_time || dayHours?.open || "11:00";
                                            timeDisplay = `${formatTimeStr(openTime)} to ${formatTimeStr(todaySpecial.close_time)}`;
                                        } else if (dayHours && dayHours.open && dayHours.close) {
                                            timeDisplay = `${formatTimeStr(dayHours.open)} to ${formatTimeStr(dayHours.close)}`;
                                        }

                                        return (
                                            <tr
                                                key={key}
                                                className={isToday ? styles.todayRow : styles.hourRow}
                                            >
                                                <td className={styles.dayCell}>
                                                    {label}
                                                    {isToday && (
                                                        <span className={styles.todayPill}>Today</span>
                                                    )}
                                                    {isDaySpecial && (
                                                        <span className={styles.specialPill}>
                                                            {todaySpecial?.label || "Special Night"}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className={styles.timeCell}>{timeDisplay}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {todaySpecial && (
                                <div className={styles.specialNotice}>
                                    <span className={styles.specialNoticeIcon} aria-hidden="true">🌙</span>
                                    <span>
                                        <strong>Special Late Night Active Today:</strong> Open until{" "}
                                        <strong>{formatTimeStr(todaySpecial.close_time)}</strong>
                                        {todaySpecial.label ? ` · ${todaySpecial.label}` : ""}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
