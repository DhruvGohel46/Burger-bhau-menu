"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MenuItem, getDynamicMenuItems } from "@/app/data/menu";
import { STORE } from "@/app/data/storeConfig";
import { trackEvent } from "@/lib/analytics";
import { supabase } from "@/lib/supabase";
import styles from "./MostLovedSection.module.css";

interface MostLovedProps {
    items: MenuItem[];
}

export default function MostLovedSection({ items }: MostLovedProps) {
    const [highlightedIds, setHighlightedIds] = useState<string[]>(STORE.highlightedItems);
    const [allItems, setAllItems] = useState<MenuItem[]>(items);

    useEffect(() => {
        async function fetchAdminHighlights() {
            try {
                const { data } = await supabase
                    .from("shop_settings")
                    .select("highlighted_items")
                    .eq("id", 1)
                    .single();
                if (data && Array.isArray(data.highlighted_items) && data.highlighted_items.length > 0) {
                    setHighlightedIds(data.highlighted_items);
                }
            } catch {
                // Ignore and check localStorage
            }

            try {
                const local = localStorage.getItem("bb_admin_highlighted_items");
                if (local) {
                    const parsed = JSON.parse(local);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        setHighlightedIds(parsed);
                    }
                }
            } catch {
                // Keep default
            }

            try {
                const dynamicItems = await getDynamicMenuItems();
                if (dynamicItems && dynamicItems.length > 0) {
                    setAllItems(dynamicItems);
                }
            } catch {
                // Keep initial items
            }
        }
        fetchAdminHighlights();
    }, []);

    // Filter items according to active order, or fallback to first 8 items
    const highlighted = highlightedIds
        .map((id) => allItems.find((item) => item.id === id))
        .filter((item): item is MenuItem => Boolean(item));

    const displayItems = highlighted.length >= 2 ? highlighted : allItems.slice(0, 8);

    const handleItemClick = (itemName: string) => {
        trackEvent("menu_item_click", { item_name: itemName, source: "most_loved" });
    };

    return (
        <section className={styles.section} aria-labelledby="most-loved-heading">
            <div className={styles.container}>
                {/* Header Block */}
                <div className={styles.headBlock}>
                    <div>
                        <h2 id="most-loved-heading" className={styles.title}>
                            Most loved in Kothariya
                        </h2>
                        <p className={styles.lead}>
                            Regulars' top picks across burgers, fries, pizza and sandwiches.
                        </p>
                    </div>
                    <Link
                        href="/menu/"
                        onClick={() => trackEvent("menu_viewed", { source: "most_loved_header" })}
                        className={styles.viewAllLink}
                    >
                        <span>View full menu</span>
                    </Link>
                </div>

                {/* Cards Grid */}
                <div className={styles.grid}>
                    {displayItems.map((item) => {
                        const priceText = item.variants && item.variants.length > 0
                            ? `₹${Math.min(...item.variants.map((v) => v.price))} / ₹${Math.max(...item.variants.map((v) => v.price))}`
                            : `₹${item.price ?? 0}`;

                        const rawImg = item.image && item.image.trim() !== "" && !item.image.trim().startsWith("/productimage/")
                            ? item.image.trim()
                            : "/logo-120.webp";
                        const isRemote = rawImg.startsWith("http");
                        const isNetlifyHost = typeof window !== "undefined" && (window.location.hostname.includes("netlify") || window.location.hostname.includes("burgerbhaukothariya.in"));
                        const optimizedSrc = (isRemote && isNetlifyHost) ? `/.netlify/images?url=${encodeURIComponent(rawImg)}&w=400&q=75&fm=webp` : rawImg;
                        const optimizedSrcSet = (isRemote && isNetlifyHost)
                            ? `/.netlify/images?url=${encodeURIComponent(rawImg)}&w=260&q=75&fm=webp 260w, /.netlify/images?url=${encodeURIComponent(rawImg)}&w=400&q=75&fm=webp 400w, /.netlify/images?url=${encodeURIComponent(rawImg)}&w=600&q=75&fm=webp 600w`
                            : undefined;

                        return (
                            <div key={item.id} className={styles.card}>
                                <div className={styles.imageWrap}>
                                    <img
                                        src={optimizedSrc}
                                        srcSet={optimizedSrcSet}
                                        sizes="(max-width: 600px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        alt={`${item.name} at Burger Bhau Kothariya`}
                                        width={300}
                                        height={225}
                                        loading="lazy"
                                        decoding="async"
                                        className={styles.cardImg}
                                        onError={(e) => {
                                            const target = e.currentTarget;
                                            if (!target.src.endsWith("/logo-120.webp")) {
                                                target.srcset = "";
                                                target.src = "/logo-120.webp";
                                            }
                                        }}
                                    />
                                    <div className={styles.vegBadge} title="100% Vegetarian" aria-label="Vegetarian">
                                        <span className={styles.vegDot} />
                                    </div>
                                    <span className={styles.categoryBadge}>{item.category}</span>
                                </div>

                                <div className={styles.cardBody}>
                                    <div className={styles.titlePriceRow}>
                                        <h3 className={styles.itemName}>{item.name}</h3>
                                        <span className={styles.price}>{priceText}</span>
                                    </div>
                                    <p className={styles.itemDesc}>{item.description}</p>
                                    <Link
                                        href={`/menu/#${item.id}`}
                                        onClick={() => handleItemClick(item.name)}
                                        className={styles.orderLink}
                                    >
                                        Order on menu
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA to Full Menu */}
                <div className={styles.bottomCta}>
                    <Link
                        href="/menu/"
                        onClick={() => trackEvent("menu_viewed", { source: "most_loved_footer" })}
                        className={styles.fullMenuBtn}
                    >
                        <span>Explore full menu with 35+ items</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
