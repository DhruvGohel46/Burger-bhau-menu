"use client";

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiamondTurnRight, faPhone, faUtensils } from "@fortawesome/free-solid-svg-icons";
import { STORE } from "@/app/data/storeConfig";
import { trackEvent } from "@/lib/analytics";
import StoreStatusBadge from "@/app/components/StoreStatusBadge";
import DistanceCard from "./DistanceCard";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
    const handleDirectionsClick = () => {
        trackEvent("directions_click", { source: "hero" });
    };

    const handleCallClick = () => {
        trackEvent("call_click", { source: "hero" });
    };

    return (
        <section className={styles.hero} aria-labelledby="hero-heading">
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Left: Headline & Actions */}
                    <div className={styles.contentCol}>
                        <div className={styles.statusWrap}>
                            <StoreStatusBadge />
                        </div>

                        <h1 id="hero-heading" className={styles.headline}>
                            <span className="sr-only">Burger Bhau Kothariya — </span>
                            {STORE.heroHeadline}
                        </h1>

                        <p className={styles.subline}>
                            {STORE.heroSubline}
                        </p>

                        <DistanceCard />

                        <div className={styles.actions}>
                            <a
                                href={STORE.mapsDirectionsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={handleDirectionsClick}
                                className={styles.primaryBtn}
                            >
                                <FontAwesomeIcon icon={faDiamondTurnRight} className={styles.btnIcon} />
                                <span>Get Directions</span>
                            </a>
                            <a
                                href={`tel:+${STORE.phone}`}
                                onClick={handleCallClick}
                                className={styles.secondaryBtn}
                            >
                                <FontAwesomeIcon icon={faPhone} className={styles.btnIcon} />
                                <span>Call the Store</span>
                            </a>
                        </div>

                        <div className={styles.menuHint}>
                            <Link href="/menu/" className={styles.menuHintLink}>
                                <FontAwesomeIcon icon={faUtensils} className={styles.hintIcon} />
                                <span>Explore our full 35+ item menu</span>
                            </Link>
                        </div>
                    </div>

                    {/* Right: Appetizing Hero Image */}
                    <div className={styles.visualCol}>
                        <div className={styles.imageCard}>
                            <picture>
                                <source
                                    type="image/avif"
                                    srcSet="/hero-400.avif 400w, /hero-600.avif 600w, /hero-800.avif 800w, /hero-1200.avif 1200w"
                                    sizes="(max-width: 768px) 100vw, 560px"
                                />
                                <source
                                    type="image/webp"
                                    srcSet="/hero-400.webp 400w, /hero-600.webp 600w, /hero-800.webp 800w, /hero-1200.webp 1200w"
                                    sizes="(max-width: 768px) 100vw, 560px"
                                />
                                <img
                                    src="/hero.webp"
                                    alt="Burger Bhau freshly prepared burger in Kothariya"
                                    width={560}
                                    height={420}
                                    fetchPriority="high"
                                    loading="eager"
                                    decoding="async"
                                    className={styles.heroImg}
                                />
                            </picture>
                            <div className={styles.imageOverlay}>
                                <span className={styles.branchTag}>Besides Axis Bank, Rolex Road</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
