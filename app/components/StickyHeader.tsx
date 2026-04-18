"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { selectCartCount, useCartStore } from "@/app/store/cartStore";
import { SHOP_NAME, WEBSITE_URL } from "@/app/data/shopConfig";
import styles from "./StickyHeader.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping, faShareNodes, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

export default function StickyHeader() {
    const cartCount = useCartStore(selectCartCount);
    const setIsCartOpen = useCartStore((s) => s.setIsCartOpen);
    const [copied, setCopied] = useState(false);
    const [isDark, setIsDark] = useState(true);
    const [mounted, setMounted] = useState(false);

    // Sync theme state on mount
    useEffect(() => {
        setMounted(true);
        const isDarkMode = document.documentElement.classList.contains('dark');
        setIsDark(isDarkMode);
    }, []);

    const toggleTheme = useCallback(() => {
        const next = !isDark;
        setIsDark(next);
        if (next) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('bb-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('bb-theme', 'light');
        }
    }, [isDark]);

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
                    {/* Theme Toggle */}
                    {mounted && (
                        <motion.button
                            onClick={toggleTheme}
                            className={styles.actionBtn}
                            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                            whileTap={{ scale: 0.88 }}
                        >
                            <motion.div
                                key={isDark ? 'moon' : 'sun'}
                                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                <FontAwesomeIcon icon={isDark ? faMoon : faSun} width={16} height={16} />
                            </motion.div>
                        </motion.button>
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

                    {/* Cart Icon */}
                    <motion.button
                        onClick={() => setIsCartOpen(true)}
                        className={styles.actionBtn}
                        aria-label="Open cart"
                        whileTap={{ scale: 0.88 }}
                    >
                        <FontAwesomeIcon icon={faBagShopping} width={16} height={16} />
                        <span className={styles.actionLabel}>Cart</span>

                        <AnimatePresence>
                            {cartCount > 0 && (
                                <motion.span
                                    key="badge"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                                    className={styles.badge}
                                >
                                    {cartCount > 9 ? '9+' : cartCount}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>
            </div>
        </header>
    );
}
