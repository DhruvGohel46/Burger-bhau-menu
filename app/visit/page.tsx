import type { Metadata } from "next";
import { SITE_URL } from "@/lib/siteConfig";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faDiamondTurnRight,
    faPhone,
    faLocationDot,
    faClock,
    faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { STORE } from "@/app/data/storeConfig";
import { getDynamicMenuItems } from "@/app/data/menu";
import StoreStatusBadge from "@/app/components/StoreStatusBadge";
import StickyActionBar from "@/app/components/StickyActionBar";
import styles from "./visit.module.css";

export const metadata: Metadata = {
    title: "Visit Burger Bhau Kothariya | Store Location & Directions",
    description:
        "Directions and store details for Burger Bhau (Besides Axis Bank, Surbhi Possible 3, Rolex Road, Kothariya, Rajkot). Open daily 11 AM to 11 PM. Fresh burgers, pizza & fries.",
    alternates: {
        canonical: `${SITE_URL}/visit/`,
    },
};

export default async function VisitPage() {
    const items = await getDynamicMenuItems();
    const topItems = items.filter((item) =>
        ["burger-bhau-special", "burger-tandoori-tadka", "fries-loaded", "pizza-cheese-burst"].includes(item.id)
    ).slice(0, 4);

    return (
        <main className={styles.page}>
            {/* Minimal Header */}
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <Link href="/" className={styles.brandLink}>
                        <Image
                            src="/BURGER-BHAU-logo.webp"
                            alt="Burger Bhau"
                            width={34}
                            height={34}
                            className={styles.brandImg}
                        />
                        <span className={styles.brandName}>
                            Burger <span className={styles.brandAccent}>Bhau</span>
                            <small className={styles.branchName}> · {STORE.branch}</small>
                        </span>
                    </Link>

                    <Link href="/menu/" className={styles.menuLink}>
                        <FontAwesomeIcon icon={faUtensils} />
                        <span>Full Menu</span>
                    </Link>
                </div>
            </header>

            <div className={styles.container}>
                {/* Hero / Action Card */}
                <div className={styles.heroCard}>
                    <div className={styles.statusWrap}>
                        <StoreStatusBadge />
                    </div>

                    <h1 className={styles.heroTitle}>Visit Our Kothariya Store</h1>
                    <p className={styles.heroSub}>
                        Garma-garam burgers, pizzas and snacks made fresh on order. Besides Axis Bank, Surbhi Possible 3, Rolex Road, Rajkot.
                    </p>

                    <div className={styles.actionRow}>
                        <a
                            href={STORE.mapsDirectionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.primaryBtn}
                        >
                            <FontAwesomeIcon icon={faDiamondTurnRight} />
                            <span>Turn-by-Turn Directions</span>
                        </a>
                        <a href={`tel:+${STORE.phone}`} className={styles.secondaryBtn}>
                            <FontAwesomeIcon icon={faPhone} />
                            <span>Call +91 95589 41555</span>
                        </a>
                    </div>
                </div>

                {/* Map & Address Block */}
                <div className={styles.mapGrid}>
                    <div className={styles.mapWrap}>
                        <iframe
                            src={STORE.mapsEmbedUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Burger Bhau Location Map"
                            className={styles.iframe}
                        />
                    </div>

                    <div className={styles.detailsCard}>
                        <div className={styles.cardSection}>
                            <div className={styles.sectionHeader}>
                                <FontAwesomeIcon icon={faLocationDot} className={styles.sectionIcon} />
                                <h3>Location</h3>
                            </div>
                            <address className={styles.address}>
                                <strong>Burger Bhau ({STORE.branch})</strong>
                                <br />
                                {STORE.address.street}
                                <br />
                                {STORE.address.city}, {STORE.address.state} — {STORE.address.postalCode}
                            </address>
                            {STORE.address.landmark && (
                                <p className={styles.landmark}>
                                    <strong>Landmark:</strong> {STORE.address.landmark}
                                </p>
                            )}
                        </div>

                        <div className={styles.cardSection}>
                            <div className={styles.sectionHeader}>
                                <FontAwesomeIcon icon={faClock} className={styles.sectionIcon} />
                                <h3>Store Hours</h3>
                            </div>
                            <p className={styles.hours}>
                                Monday to Sunday: <strong>11:00 AM – 11:00 PM</strong>
                            </p>
                        </div>

                        <Link href="/menu/" className={styles.viewMenuCta}>
                            <span>Explore full menu (35+ items)</span>
                            <span>→</span>
                        </Link>
                    </div>
                </div>

                {/* Quick Favourites preview */}
                {topItems.length > 0 && (
                    <div className={styles.popularSection}>
                        <h2 className={styles.popularTitle}>Popular items at the counter</h2>
                        <div className={styles.popularGrid}>
                            {topItems.map((item) => (
                                <div key={item.id} className={styles.popCard}>
                                    <div className={styles.popImgWrap}>
                                        <Image
                                            src={item.image || "/BURGER-BHAU-logo.webp"}
                                            alt={item.name}
                                            fill
                                            sizes="120px"
                                            className={styles.popImg}
                                        />
                                    </div>
                                    <div className={styles.popInfo}>
                                        <h4 className={styles.popName}>{item.name}</h4>
                                        <span className={styles.popPrice}>
                                            ₹{item.price || (item.variants && item.variants[0]?.price) || 0}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <StickyActionBar />
        </main>
    );
}
