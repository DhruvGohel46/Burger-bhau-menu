"use client";

import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiamondTurnRight, faUtensils } from "@fortawesome/free-solid-svg-icons";
import { STORE } from "@/app/data/storeConfig";
import { trackEvent } from "@/lib/analytics";
import styles from "./LandingNav.module.css";

export default function LandingNav() {
    const handleDirectionsClick = () => {
        trackEvent("directions_click", { source: "nav" });
    };

    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                {/* Brand */}
                <Link href="/" className={styles.brandLink} aria-label="Burger Bhau Kothariya">
                    <div className={styles.brandWrap}>
                        <picture>
                            <source type="image/avif" srcSet="/logo-36.avif 1x, /logo-48.avif 2x" />
                            <source type="image/webp" srcSet="/logo-36.webp 1x, /logo-48.webp 2x" />
                            <img
                                src="/logo-36.webp"
                                alt="Burger Bhau Logo"
                                width={36}
                                height={36}
                                loading="eager"
                                decoding="async"
                                className={styles.logoImage}
                            />
                        </picture>
                        <div className={styles.brandText}>
                            <span className={styles.brandName}>
                                Burger <span className={styles.brandAccent}>Bhau</span>
                            </span>
                            <span className={styles.brandBranch}>{STORE.branch}, Rajkot</span>
                        </div>
                    </div>
                </Link>

                {/* Actions */}
                <nav className={styles.navActions} aria-label="Main navigation">
                    <Link href="/menu/" className={styles.menuLink}>
                        <FontAwesomeIcon icon={faUtensils} className={styles.btnIcon} />
                        <span>Menu</span>
                    </Link>
                    <a
                        href={STORE.mapsDirectionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleDirectionsClick}
                        className={styles.directionsBtn}
                    >
                        <FontAwesomeIcon icon={faDiamondTurnRight} className={styles.btnIcon} />
                        <span>Directions</span>
                    </a>
                </nav>
            </div>
        </header>
    );
}
