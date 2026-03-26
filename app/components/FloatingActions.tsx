"use client";

import { selectCartTotal, useCartStore } from "@/app/store/cartStore";
import { buildWhatsAppUrl, buildCallUrl } from "@/app/data/shopConfig";
import styles from "./FloatingActions.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

export default function FloatingActions() {
    const cartItems = useCartStore((s) => s.cartItems);
    const cartTotal = useCartStore(selectCartTotal);
    const customerName = useCartStore((s) => s.customerName);
    const customerAddress = useCartStore((s) => s.customerAddress);
    const customerPhone = useCartStore((s) => s.customerPhone);

    return (
        <div className={styles.wrap}>
            <a
                href={buildCallUrl()}
                className={`${styles.fab} ${styles.call}`}
                aria-label="Call shop"
            >
                <FontAwesomeIcon icon={faPhone} width={20} height={20} />
            </a>
            <a
                href={buildWhatsAppUrl(cartItems, cartTotal, customerName, customerAddress, customerPhone)}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.fab} ${styles.whatsapp}`}
                aria-label="Order on WhatsApp"
            >
                <FontAwesomeIcon icon={faWhatsapp} width={22} height={22} />
            </a>
        </div>
    );
}
\n// Burger Bhau MenuSite - Auto-documented file\n