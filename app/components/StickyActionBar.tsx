"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiamondTurnRight, faPhone } from "@fortawesome/free-solid-svg-icons";
import { STORE } from "@/app/data/storeConfig";
import { trackEvent } from "@/lib/analytics";
import styles from "./StickyActionBar.module.css";

export default function StickyActionBar() {
    const handleDirectionsClick = () => {
        trackEvent("directions_click", { source: "sticky_bar" });
    };

    const handleCallClick = () => {
        trackEvent("call_click", { source: "sticky_bar" });
    };

    return (
        <aside className={styles.bar} aria-label="Quick store actions">
            <div className={styles.inner}>
                <a
                    href={STORE.mapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleDirectionsClick}
                    className={styles.primaryBtn}
                >
                    <FontAwesomeIcon icon={faDiamondTurnRight} className={styles.icon} />
                    <span>Get Directions</span>
                </a>
                <a
                    href={`tel:+${STORE.phone}`}
                    onClick={handleCallClick}
                    className={styles.secondaryBtn}
                >
                    <FontAwesomeIcon icon={faPhone} className={styles.icon} />
                    <span>Call Store</span>
                </a>
            </div>
        </aside>
    );
}
