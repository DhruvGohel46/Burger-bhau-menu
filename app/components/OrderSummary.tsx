"use client";

import { motion, AnimatePresence } from "framer-motion";
import { selectCartTotal, useCartStore } from "@/app/store/cartStore";
import styles from "./OrderSummary.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faRotateLeft } from "@fortawesome/free-solid-svg-icons";

export default function OrderSummary() {
    const cartItems = useCartStore((s) => s.cartItems);
    const cartTotal = useCartStore(selectCartTotal);
    const isOrderSummaryOpen = useCartStore((s) => s.isOrderSummaryOpen);
    const setIsOrderSummaryOpen = useCartStore((s) => s.setIsOrderSummaryOpen);
    const clearCart = useCartStore((s) => s.clearCart);

    if (!isOrderSummaryOpen) return null;

    const handleBackToMenu = () => {
        setIsOrderSummaryOpen(false);
    };

    const handleStartNewOrder = () => {
        clearCart();
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`${styles.screen} safe-top`}
            >
                {/* Header */}
                <div className={styles.header}>
                    <button
                        onClick={handleBackToMenu}
                        className={styles.back}
                        aria-label="Back to menu"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} width={16} height={16} />
                        <span>Back</span>
                    </button>
                    <h2 className={styles.title}>
                        Your Order
                    </h2>
                    <div style={{ width: 64 }} /> {/* Spacer */}
                </div>

                {/* Receipt-style content */}
                <div className={styles.body}>
                    <div className={styles.receipt}>
                        {/* Brand */}
                        <div>
                            <h3 className={styles.receiptTitle}>
                                Burger Bhau
                            </h3>
                            <p className={styles.receiptSub}>
                                Premium Street Food
                            </p>
                        </div>

                        <div className={styles.divider} />

                        {/* Order Items */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {cartItems.map((item) => (
                                <div key={item.id} className={styles.line}>
                                    <div className={styles.left}>
                                        <span className={styles.qty}>
                                            {item.quantity}x
                                        </span>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                                            <span className={styles.name}>
                                                {item.name}
                                            </span>
                                            {(item.variantLabel || (item.extras && item.extras.length > 0)) ? (
                                                <span style={{ fontSize: 11, fontFamily: "var(--font-poppins, inherit)", color: "rgba(0, 0, 0, 0.55)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                    {item.variantLabel ? `Size: ${item.variantLabel}` : null}
                                                    {item.variantLabel && item.extras && item.extras.length > 0 ? " • " : null}
                                                    {item.extras && item.extras.length > 0 ? `Extras: ${item.extras.map((e) => e.name).join(", ")}` : null}
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>
                                    <span className={styles.amount}>
                                        ₹{item.price * item.quantity}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className={styles.divider} />

                        {/* Total */}
                        <div className={styles.totalRow}>
                            <span className={styles.totalLabel}>Total</span>
                            <span className={styles.totalValue}>₹{cartTotal}</span>
                        </div>

                        <div className={styles.divider} />

                        {/* Message */}
                        <div className={styles.message}>
                            Please show this screen to the cashier.
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className={`${styles.footer} safe-bottom`}>
                    <button
                        onClick={handleBackToMenu}
                        className={styles.secondary}
                    >
                        Back to Menu
                    </button>
                    <button
                        onClick={handleStartNewOrder}
                        className={styles.primary}
                    >
                        <FontAwesomeIcon icon={faRotateLeft} width={16} height={16} />
                        New Order
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
