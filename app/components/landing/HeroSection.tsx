"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiamondTurnRight, faPhone, faUtensils } from "@fortawesome/free-solid-svg-icons";
import { STORE } from "@/app/data/storeConfig";
import { trackEvent } from "@/lib/analytics";
import { supabase } from "@/lib/supabase";
import StoreStatusBadge from "@/app/components/StoreStatusBadge";
import DistanceCard from "./DistanceCard";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
    const [heroImg, setHeroImg] = useState<string>(STORE.heroImage);

    useEffect(() => {
        async function fetchAdminHero() {
            try {
                const { data } = await supabase
                    .from("shop_settings")
                    .select("hero_image_url, banner_url")
                    .eq("id", 1)
                    .single();
                if (data) {
                    const custom = data.hero_image_url || data.banner_url;
                    if (custom && typeof custom === "string" && custom.trim().length > 0) {
                        setHeroImg(custom.trim());
                    }
                }
            } catch {
                // Keep default
            }
        }
        fetchAdminHero();
    }, []);

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
                            <Image
                                src={heroImg}
                                alt="Burger Bhau freshly prepared burger in Kothariya"
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, 560px"
                                className={styles.heroImg}
                            />
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
