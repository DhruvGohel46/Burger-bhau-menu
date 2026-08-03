"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { selectCartCount, useCartStore } from "@/app/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { SHOP_NAME, WEBSITE_URL } from "@/app/data/shopConfig";
import styles from "./StickyHeader.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping, faShareNodes, faUser, faBoxOpen, faCamera } from "@fortawesome/free-solid-svg-icons";

export default function StickyHeader() {
    const { user } = useAuthStore();
    const cartCount = useCartStore(selectCartCount);
    const setIsCartOpen = useCartStore((s) => s.setIsCartOpen);
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const shareData = {
            title: `${SHOP_NAME} Menu`,
            text: `🍔 Check out ${SHOP_NAME} Menu!\n\nDelicious burgers, fries and quick snacks.\n\nOrder here:`,
            url: WEBSITE_URL,
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
                {/* Logo */}
                <div className={styles.logo}>
                    <img
                        src="/BURGER-BHAU-logo.webp"
                        alt="Burger Bhau Logo"
                        className={styles.logoImage}
                    />
                    <h1 className={styles.brand}>
                        BURGER <span className={styles.brandAccent}>BHAU</span>
                    </h1>
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    {/* Gallery Link */}
                    <Link
                        href="/gallery"
                        className={styles.actionBtn}
                        aria-label="Photo Gallery"
                        style={{ display: "flex", alignItems: "center", gap: "6px", textDecoration: "none", color: "#fff" }}
                    >
                        <FontAwesomeIcon icon={faCamera} width={16} height={16} color="var(--accent)" />
                        <span className={styles.actionLabel}>Gallery</span>
                    </Link>

                    {/* Orders / Profile Link */}
                    <Link
                        href={user ? "/profile" : "/login"}
                        className={styles.actionBtn}
                        aria-label="User profile or login"
                        style={{ display: "flex", alignItems: "center", gap: "6px", textDecoration: "none", color: "#fff" }}
                    >
                        <FontAwesomeIcon icon={faUser} width={16} height={16} color="var(--accent)" />
                        <span className={styles.actionLabel}>{user ? "Profile" : "Login"}</span>
                    </Link>

                    {user && (
                        <Link
                            href="/orders"
                            className={styles.actionBtn}
                            aria-label="My orders"
                            style={{ display: "flex", alignItems: "center", gap: "6px", textDecoration: "none", color: "#fff" }}
                        >
                            <FontAwesomeIcon icon={faBoxOpen} width={16} height={16} color="var(--accent)" />
                            <span className={styles.actionLabel}>Orders</span>
                        </Link>
                    )}

                    {/* Share */}
                    <button
                        onClick={handleShare}
                        className={`${styles.actionBtn} ${styles.shareBtn}`}
                        aria-label="Share menu"
                    >
                        <FontAwesomeIcon icon={faShareNodes} width={16} height={16} />
                        <span className={styles.actionLabel}>Share</span>
                        {copied && <span className={styles.copiedToast}>Copied!</span>}
                    </button>
                </div>
            </div>
        </header>
    );
}
