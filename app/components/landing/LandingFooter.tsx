"use client";

import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faDiamondTurnRight } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { STORE } from "@/app/data/storeConfig";
import { trackEvent } from "@/lib/analytics";
import styles from "./LandingFooter.module.css";

export default function LandingFooter() {
    const handleWhatsAppShare = () => {
        trackEvent("whatsapp_share_click", { source: "footer" });
        const shareText = `Check out Burger Bhau (${STORE.branch}, Rajkot)! Freshly made burgers, pizza, and snacks on Rolex Road: ${STORE.websiteUrl}`;
        const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        window.open(waUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <footer className={styles.footer} role="contentinfo">
            <div className={styles.container}>
                <div className={styles.topRow}>
                    {/* Brand Col */}
                    <div className={styles.brandCol}>
                        <div className={styles.logoRow}>
                            <picture>
                                <source type="image/avif" srcSet="/logo-48.avif 1x, /logo-120.avif 2x" />
                                <source type="image/webp" srcSet="/logo-48.webp 1x, /logo-120.webp 2x" />
                                <img
                                    src="/logo-48.webp"
                                    alt="Burger Bhau Logo"
                                    width={44}
                                    height={44}
                                    loading="lazy"
                                    decoding="async"
                                    className={styles.logoImg}
                                />
                            </picture>
                            <div>
                                <span className={styles.brandTitle}>
                                    Burger <span className={styles.brandAccent}>Bhau</span>
                                </span>
                                <span className={styles.branchSub}>{STORE.branch} Branch, Rajkot</span>
                            </div>
                        </div>
                        <p className={styles.brandBio}>
                            Handcrafted street-style burgers, pizzas, grilled sandwiches, and loaded fries made fresh the moment you order.
                        </p>
                    </div>

                    {/* Quick Nav Links */}
                    <div className={styles.linksCol}>
                        <h4 className={styles.colTitle}>Navigation</h4>
                        <ul className={styles.linkList}>
                            <li>
                                <Link href="/" className={styles.navLink}>Home</Link>
                            </li>
                            <li>
                                <Link href="/menu/" className={styles.navLink}>Full Menu</Link>
                            </li>
                            <li>
                                <Link href="/gallery/" className={styles.navLink}>Photo Gallery</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Visit & Contact */}
                    <div className={styles.contactCol}>
                        <h4 className={styles.colTitle}>Visit & Contact</h4>
                        <address className={styles.addressLine}>
                            {STORE.address.street}, {STORE.address.city}, {STORE.address.state} {STORE.address.postalCode}
                        </address>
                        <p className={styles.hoursLine}>
                            Open daily: 11:00 AM to 11:00 PM
                        </p>
                        <p className={styles.phoneLine}>
                            Phone: <a href={`tel:+${STORE.phone}`} className={styles.phoneLink}>{STORE.phoneDisplay || "+91 95589 41555"}</a>
                        </p>
                        <div className={styles.contactActions}>
                            <a
                                href={STORE.mapsDirectionsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackEvent("directions_click", { source: "footer" })}
                                className={styles.actionBtn}
                            >
                                <FontAwesomeIcon icon={faDiamondTurnRight} />
                                <span>Directions</span>
                            </a>
                            <a
                                href={`tel:+${STORE.phone}`}
                                onClick={() => trackEvent("call_click", { source: "footer" })}
                                className={styles.actionBtn}
                            >
                                <FontAwesomeIcon icon={faPhone} />
                                <span>Call</span>
                            </a>
                            <button
                                type="button"
                                onClick={handleWhatsAppShare}
                                className={`${styles.actionBtn} ${styles.waBtn}`}
                                aria-label="Share on WhatsApp"
                            >
                                <FontAwesomeIcon icon={faWhatsapp} />
                                <span>Share</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.bottomBar}>
                    <p className={styles.copyright}>
                        © {new Date().getFullYear()} {STORE.name} ({STORE.branch}). All rights reserved.
                    </p>
                    <p className={styles.colophon}>
                        Besides Axis Bank, Surbhi Possible 3, Rolex Road, Kothariya, Rajkot
                    </p>
                </div>
            </div>
        </footer>
    );
}
