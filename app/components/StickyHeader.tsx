"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { selectCartCount, useCartStore } from "@/app/store/cartStore";
import { SHOP_NAME, WEBSITE_URL } from "@/app/data/shopConfig";
import styles from "./StickyHeader.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping, faShareNodes } from "@fortawesome/free-solid-svg-icons";

export default function StickyHeader() {
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
                    {/* Share */}
                    <button
                        onClick={handleShare}
                        className={styles.actionBtn}
                        aria-label="Share menu"
                    >
                        <FontAwesomeIcon icon={faShareNodes} width={16} height={16} />
                        <span className={styles.actionLabel}>Share</span>
                        {copied && <span className={styles.copiedToast}>Copied!</span>}
                    </button>

                    {/* Cart Icon */}
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className={styles.actionBtn}
                        aria-label="Open cart"
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
                                    className={styles.badge}
                                >
                                    {cartCount > 9 ? '9+' : cartCount}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </div>
        </header>
    );
}
