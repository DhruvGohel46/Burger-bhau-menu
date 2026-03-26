"use client";

import { motion, AnimatePresence } from "framer-motion";
import { selectCartCount, selectCartTotal, useCartStore } from "@/app/store/cartStore";
import styles from "./CartDrawer.module.css";
import CartItem from "./CartItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function CartDrawer() {
    const cartItems = useCartStore((s) => s.cartItems);
    const isCartOpen = useCartStore((s) => s.isCartOpen);
    const setIsCartOpen = useCartStore((s) => s.setIsCartOpen);
    const cartTotal = useCartStore(selectCartTotal);
    const cartCount = useCartStore(selectCartCount);
    const setIsOrderSummaryOpen = useCartStore((s) => s.setIsOrderSummaryOpen);

    const handleShowToCashier = () => {
        setIsCartOpen(false);
        setTimeout(() => setIsOrderSummaryOpen(true), 100);
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setIsCartOpen(false)}
                        className={styles.backdrop}
                    />

                    {/* Slide-up Panel */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 28, stiffness: 300 }}
                        className={`${styles.panel} safe-top`}
                    >
                        {/* Header */}
                        <div className={styles.header}>
                            <div className={styles.headerLeft}>
                                <FontAwesomeIcon icon={faBagShopping} width={18} height={18} color="var(--accent)" />
                                <h2 className={styles.title}>
                                    Your Order
                                </h2>
                                <span className={styles.sub}>
                                    ({cartCount} {cartCount === 1 ? 'item' : 'items'})
                                </span>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className={styles.close}
                                aria-label="Close cart"
                            >
                                <FontAwesomeIcon icon={faXmark} width={18} height={18} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className={styles.list}>
                            {cartItems.length === 0 ? (
                                <div className={styles.empty}>
                                    Your cart is empty.
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <CartItem key={item.id} item={item} />
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className={`${styles.footer} safe-bottom`}>
                                {/* Subtotal */}
                                <div className={styles.subtotalRow}>
                                    <span className={styles.subtotalLabel}>
                                        Subtotal
                                    </span>
                                    <span className={styles.subtotalValue}>
                                        ₹{cartTotal}
                                    </span>
                                </div>

                                {/* CTA Button */}
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleShowToCashier}
                                    className={styles.cta}
                                >
                                    Show Order to Cashier
                                </motion.button>

                                <p className={styles.note}>
                                    Pay at the counter via Cash or UPI
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
