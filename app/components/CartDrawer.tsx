"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { selectCartCount, selectCartTotal, useCartStore } from "@/app/store/cartStore";
import { supabase } from "@/lib/supabase";
import styles from "./CartDrawer.module.css";
import CartItem from "./CartItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping, faXmark, faCartShopping } from "@fortawesome/free-solid-svg-icons";

export default function CartDrawer() {
    const cartItems = useCartStore((s) => s.cartItems);
    const isCartOpen = useCartStore((s) => s.isCartOpen);
    const setIsCartOpen = useCartStore((s) => s.setIsCartOpen);
    const cartTotal = useCartStore(selectCartTotal);
    const cartCount = useCartStore(selectCartCount);

    const router = useRouter();
    const [minOrder, setMinOrder] = useState<number | null>(null);

    useEffect(() => {
        async function loadShopSettings() {
            try {
                const { data } = await supabase.from("shop_settings").select("min_order_for_delivery").eq("id", 1).single();
                if (data && typeof data.min_order_for_delivery === "number") {
                    setMinOrder(data.min_order_for_delivery);
                }
            } catch (err) {}
        }
        loadShopSettings();
    }, []);

    const handleProceedToCheckout = () => {
        setIsCartOpen(false);
        try {
            router.push("/checkout");
        } catch (err) {}
        if (typeof window !== "undefined") {
            window.location.href = "/checkout";
        }
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
                        transition={{ duration: 0.25 }}
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
                            <motion.button
                                onClick={() => setIsCartOpen(false)}
                                className={styles.close}
                                aria-label="Close cart"
                                whileTap={{ scale: 0.88 }}
                            >
                                <FontAwesomeIcon icon={faXmark} width={18} height={18} />
                            </motion.button>
                        </div>

                        {/* Cart Items */}
                        <div className={styles.list}>
                            {cartItems.length === 0 ? (
                                <div className={styles.empty}>
                                    <div className={styles.emptyIcon}>
                                        <FontAwesomeIcon icon={faCartShopping} width={40} height={40} />
                                    </div>
                                    <h3 className={styles.emptyTitle}>Your cart is empty</h3>
                                    <p className={styles.emptyText}>
                                        Browse our menu and add your favourite items to get started
                                    </p>
                                    <motion.button
                                        onClick={() => setIsCartOpen(false)}
                                        className={styles.emptyBtn}
                                        whileTap={{ scale: 0.96 }}
                                    >
                                        Browse Menu
                                    </motion.button>
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

                                {minOrder !== null && cartTotal < minOrder && (
                                    <div style={{ fontSize: "12px", color: "#FF9F1C", marginBottom: "10px", fontWeight: "700", textAlign: "center" }}>
                                        💡 Store min delivery order: ₹{minOrder} (Current: ₹{cartTotal}). Self Pickup is available for all orders!
                                    </div>
                                )}

                                {/* CTA Button */}
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleProceedToCheckout}
                                    className={styles.cta}
                                >
                                    Proceed to Checkout →
                                </motion.button>

                                <p className={styles.note}>
                                    Fast & secure payment via UPI
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
