"use client";

import { motion, AnimatePresence } from "framer-motion";
import { selectCartCount, selectCartTotal, useCartStore } from "@/app/store/cartStore";
import styles from "./FloatingCartBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping, faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function FloatingCartBar() {
    const cartItems = useCartStore((s) => s.cartItems);
    const cartCount = useCartStore(selectCartCount);
    const cartTotal = useCartStore(selectCartTotal);
    const setIsCartOpen = useCartStore((s) => s.setIsCartOpen);

    return (
        <AnimatePresence>
            {cartItems.length > 0 && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`${styles.wrap} safe-bottom`}
                >
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className={styles.bar}
                    >
                        <div className={styles.left}>
                            <div className={styles.iconWrapper}>
                                <FontAwesomeIcon icon={faBagShopping} width={18} height={18} />
                                {cartCount > 0 && (
                                    <span className={styles.countBadge}>{cartCount}</span>
                                )}
                            </div>
                            <span className={styles.itemsText}>
                                {cartCount} {cartCount === 1 ? 'item' : 'items'}
                            </span>
                        </div>

                        <div className={styles.right}>
                            <span className={styles.total}>₹{cartTotal}</span>
                            <span className={styles.view}>
                                View Cart <FontAwesomeIcon icon={faChevronRight} width={12} height={12} />
                            </span>
                        </div>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
