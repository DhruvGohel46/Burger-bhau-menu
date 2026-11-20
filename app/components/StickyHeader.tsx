"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { STORE } from "@/app/data/storeConfig";
import { trackEvent } from "@/lib/analytics";
import styles from "./StickyHeader.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faDiamondTurnRight,
    faShareNodes,
    faUser,
    faBoxOpen,
} from "@fortawesome/free-solid-svg-icons";

export default function StickyHeader() {
    const { user } = useAuthStore();
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const shareData = {
            title: `${STORE.name} Menu`,
            text: `Check out ${STORE.name} Menu: freshly made burgers, pizzas, and snacks in Kothariya, Rajkot.`,
            url: STORE.websiteUrl,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch {
                // User cancelled share
            }
        } else {
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch {
                // Clipboard failed
            }
        }
    };

    return (
        <header className={`${styles.header} safe-top`}>
            <div className={styles.inner}>
                {/* Left Side: Prominent Back Button & Brand */}
                <div className={styles.leftGroup}>
                    {/* Primary Back Button */}
                    <Link href="/" className={styles.backBtn} aria-label="Back to home page">
                        <FontAwesomeIcon icon={faArrowLeft} className={styles.backIcon} />
                        <span className={styles.backText}>Home</span>
                    </Link>

                    {/* Brand Link matching LandingNav */}
                    <Link href="/" className={styles.brandLink} aria-label="Burger Bhau Kothariya Home">
                        <div className={styles.brandWrap}>
                            <img
                                src="/BURGER-BHAU-logo.webp"
                                alt="Burger Bhau Logo"
                                width={36}
                                height={36}
                                className={styles.logoImage}
                            />
                            <div className={styles.brandText}>
                                <span className={styles.brandName}>
                                    Burger <span className={styles.brandAccent}>Bhau</span>
                                </span>
                                <span className={styles.brandBranch}>{STORE.branch}, Rajkot</span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Right Side Actions */}
                <div className={styles.actions}>
                    {/* Directions link */}
                    <a
                        href={STORE.mapsDirectionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackEvent("directions_click", { source: "menu_header" })}
                        className={styles.directionsBtn}
                        aria-label="Get directions to store"
                    >
                        <FontAwesomeIcon icon={faDiamondTurnRight} className={styles.btnIcon} />
                        <span className={styles.directionsText}>Directions</span>
                    </a>

                    {/* Profile / Login */}
                    <Link
                        href={user ? "/profile/" : "/login/"}
                        className={styles.actionBtn}
                        aria-label={user ? "My profile" : "Customer login"}
                        rel="nofollow"
                    >
                        <FontAwesomeIcon icon={faUser} width={13} height={13} />
                        <span className={styles.actionLabel}>{user ? "Profile" : "Login"}</span>
                    </Link>

                    {user && (
                        <Link
                            href="/orders/"
                            className={styles.actionBtn}
                            aria-label="My orders"
                            rel="nofollow"
                        >
                            <FontAwesomeIcon icon={faBoxOpen} width={13} height={13} />
                            <span className={styles.actionLabel}>Orders</span>
                        </Link>
                    )}

                    {/* Share */}
                    <button
                        type="button"
                        onClick={handleShare}
                        className={`${styles.actionBtn} ${styles.shareBtn}`}
                        aria-label="Share menu"
                    >
                        <FontAwesomeIcon icon={faShareNodes} width={13} height={13} />
                        <span className={styles.actionLabel}>Share</span>
                        {copied && <span className={styles.copiedToast}>Copied</span>}
                    </button>
                </div>
            </div>
        </header>
    );
}
