// Burger Bhau MenuSite - Auto-documented file\nimport { GOOGLE_MAPS_EMBED_URL, SHOP_LAT, SHOP_LNG } from "@/app/data/shopConfig";
import styles from "./ShopMap.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

export default function ShopMap() {
    const mapsLink = `https://www.google.com/maps/dir/?api=1&destination=${SHOP_LAT},${SHOP_LNG}`;

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
            <a 
                href={mapsLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.mapAction}
            >
                <FontAwesomeIcon icon={faExternalLinkAlt} width={14} height={14} />
                Open in Google Maps
            </a>
        </div>
    );
}
