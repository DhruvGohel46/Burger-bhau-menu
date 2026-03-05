"use client";

import { motion, AnimatePresence } from "framer-motion";
import { selectCartCount, useCartStore } from "@/app/store/cartStore";
import styles from "./StickyHeader.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping } from "@fortawesome/free-solid-svg-icons";

export default function StickyHeader() {
    const cartCount = useCartStore(selectCartCount);
    const setIsCartOpen = useCartStore((s) => s.setIsCartOpen);

    return (
        <header className={`${styles.header} safe-top`}>
            <div className={styles.inner}>
                {/* Logo */}
                <h1 className={styles.brand}>
                    BURGER <span className={styles.brandAccent}>BHAU</span>
                </h1>

                {/* Cart Icon */}
                <button
                    onClick={() => setIsCartOpen(true)}
                    className={styles.cartButton}
                    aria-label="Open cart"
                >
                    <FontAwesomeIcon icon={faBagShopping} width={20} height={20} />

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
        </header>
    );
}
