"use client";

import { GOOGLE_MAPS_EMBED_URL } from "@/app/data/shopConfig";
import styles from "./ShopMap.module.css";

export default function ShopMap() {
    return (
        <div className={styles.wrap}>
            <h3 className={styles.heading}>Find Us</h3>
            <div className={styles.mapContainer}>
                <iframe
                    src={GOOGLE_MAPS_EMBED_URL}
                    width="100%"
                    height="220"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Burger Bhau Location"
                />
            </div>
        </div>
    );
}
