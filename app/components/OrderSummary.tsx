"use client";

import { motion, AnimatePresence } from "framer-motion";
import { selectCartTotal, useCartStore } from "@/app/store/cartStore";
import { buildWhatsAppUrl, buildCallUrl } from "@/app/data/shopConfig";
import styles from "./OrderSummary.module.css";
import DeliveryChecker from "./DeliveryChecker";
import ShopMap from "./ShopMap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPhone, faUser, faMapMarkerAlt, faMobileAlt, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

export default function OrderSummary() {
    const cartItems = useCartStore((s) => s.cartItems);
    const cartTotal = useCartStore(selectCartTotal);
    const isOrderSummaryOpen = useCartStore((s) => s.isOrderSummaryOpen);
    const setIsOrderSummaryOpen = useCartStore((s) => s.setIsOrderSummaryOpen);
    
    const customerName = useCartStore((s) => s.customerName);
    const customerAddress = useCartStore((s) => s.customerAddress);
    const customerPhone = useCartStore((s) => s.customerPhone);
    const setCustomerName = useCartStore((s) => s.setCustomerName);
    const setCustomerAddress = useCartStore((s) => s.setCustomerAddress);
    const setCustomerPhone = useCartStore((s) => s.setCustomerPhone);

    if (!isOrderSummaryOpen) return null;

    const handleBackToMenu = () => {
        setIsOrderSummaryOpen(false);
    };

    const whatsappUrl = buildWhatsAppUrl(cartItems, cartTotal, customerName, customerAddress, customerPhone);

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

                {/* Scrollable body */}
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

                        {/* Customer Details */}
                        <div className={styles.customerForm}>
                            <div className={styles.inputGroup}>
                                <label><FontAwesomeIcon icon={faUser} /> Name</label>
                                <input 
                                    type="text" 
                                    value={customerName} 
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label><FontAwesomeIcon icon={faMobileAlt} /> Phone Number</label>
                                <input 
                                    type="tel" 
                                    value={customerPhone} 
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    placeholder="Enter mobile number"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label><FontAwesomeIcon icon={faMapMarkerAlt} /> Delivery Address</label>
                                <textarea 
                                    value={customerAddress} 
                                    onChange={(e) => setCustomerAddress(e.target.value)}
                                    placeholder="Enter your address"
                                    rows={2}
                                />
                            </div>
                        </div>

                        <div className={styles.divider} />

                        {/* Delivery Eligibility */}
                        <div className={styles.deliveryPolicy}>
                            <FontAwesomeIcon icon={faInfoCircle} width={12} height={12} />
                            <span>Free Home Delivery within 400m for orders above ₹500</span>
                        </div>
                        <DeliveryChecker />

                        <div className={styles.divider} />

                        {/* Message */}
                        <div className={styles.message}>
                            Please show this screen to the cashier or order via WhatsApp.
                        </div>
                    </div>

                    {/* Google Maps */}
                    <ShopMap />
                </div>

                {/* Footer Actions: Call + WhatsApp */}
                <div className={`${styles.footer} safe-bottom`}>
                    <a
                        href={buildCallUrl()}
                        className={styles.callBtn}
                    >
                        <FontAwesomeIcon icon={faPhone} width={16} height={16} />
                        Call Now
                    </a>
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.whatsappBtn}
                    >
                        <FontAwesomeIcon icon={faWhatsapp} width={18} height={18} />
                        Order on WhatsApp
                    </a>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
