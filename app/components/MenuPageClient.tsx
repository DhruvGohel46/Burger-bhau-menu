"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { getDynamicCategories, getDynamicMenuItems, MenuItem, MenuCategory } from "@/app/data/menu";
import Header from "@/app/components/Header";
import CategoryNav from "@/app/components/CategoryNav";
import MenuSection from "@/app/components/MenuSection";
import FloatingCartBar from "@/app/components/FloatingCartBar";
import FloatingActions from "@/app/components/FloatingActions";
import CartDrawer from "@/app/components/CartDrawer";
import GlobalItemPreview from "@/app/components/GlobalItemPreview";
import styles from "@/app/page.module.css";
import { useCartStore } from "@/app/store/cartStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCamera, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function MenuPageClient({
    initialCategories,
    initialItems,
}: {
    initialCategories: MenuCategory[];
    initialItems: MenuItem[];
}) {
    const isCartOpen = useCartStore((s) => s.isCartOpen);
    const setIsCartOpen = useCartStore((s) => s.setIsCartOpen);
    const isOrderSummaryOpen = useCartStore((s) => s.isOrderSummaryOpen);
    const setIsOrderSummaryOpen = useCartStore((s) => s.setIsOrderSummaryOpen);
    const previewItem = useCartStore((s) => s.previewItem);
    const setPreviewItem = useCartStore((s) => s.setPreviewItem);

    // Initialized from build-time SSR server props
    const [allCategories, setAllCategories] = useState<MenuCategory[]>(initialCategories);
    const [allItems, setAllItems] = useState<MenuItem[]>(initialItems);
    const [searchQuery, setSearchQuery] = useState("");

    // Refs to track previous overlay states
    const lastOverlayRef = useRef(false);

    // Silent background refresh for real-time Supabase updates without blocking initial static render
    useEffect(() => {
        async function refreshMenu() {
            try {
                const cats = await getDynamicCategories();
                const items = await getDynamicMenuItems();
                if (cats && cats.length > 0) setAllCategories(cats);
                if (items && items.length > 0) setAllItems(items);
            } catch (e) {
                // Ignore refresh errors, initial static items are already rendered
            }
        }
        refreshMenu();
    }, []);

    // Handle Mobile Hardware Back Button safely without triggering programmatic router conflicts
    useEffect(() => {
        const isAnyOpen = isCartOpen || isOrderSummaryOpen || !!previewItem;
        if (isAnyOpen && !lastOverlayRef.current) {
            try {
                window.history.pushState({ overlay: true }, "");
            } catch (e) {}
            lastOverlayRef.current = true;
        } else if (!isAnyOpen) {
            lastOverlayRef.current = false;
        }
    }, [isCartOpen, isOrderSummaryOpen, previewItem]);

    // Listener for hardware back button popstate
    useEffect(() => {
        const handlePopState = () => {
            setIsCartOpen(false);
            setIsOrderSummaryOpen(false);
            setPreviewItem(null);
            lastOverlayRef.current = false;
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [setIsCartOpen, setIsOrderSummaryOpen, setPreviewItem]);

    // Filter items based on Search Query
    const filteredItems = allItems.filter((item) => {
        return (
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    // Group items by category (case-insensitive & trimmed)
    const categoriesMap = new Map<string, MenuCategory>();
    allCategories.forEach((c) => categoriesMap.set(c.name.trim().toLowerCase(), c));

    // Ensure any category attached to items is recognized
    allItems.forEach((item) => {
        const catKey = item.category?.trim().toLowerCase();
        if (catKey && !categoriesMap.has(catKey)) {
            categoriesMap.set(catKey, {
                id: item.category.trim().toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
                name: item.category.trim(),
                icon: item.category.trim().toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
            });
        }
    });

    const activeCategories = Array.from(categoriesMap.values());

    const groupedItems = activeCategories
        .map((cat) => ({
            ...cat,
            items: filteredItems.filter(
                (item) => item.category?.trim().toLowerCase() === cat.name?.trim().toLowerCase()
            ),
        }))
        .filter((group) => group.items.length > 0);

    return (
        <main className={styles.main}>
            {/* Fixed Top Stack (Header + Categories + Search & Gallery) */}
            <div className={styles.topFixedStack}>
                <Header />
                <CategoryNav categories={activeCategories} />
                <div className={styles.searchFixedWrap}>
                    <div className={styles.searchRow}>
                        <div className={styles.searchBox}>
                            <FontAwesomeIcon
                                icon={faSearch}
                                width={15}
                                height={15}
                                className={styles.searchIcon}
                            />
                            <input
                                type="text"
                                placeholder="Search burgers, pizzas, snacks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                                aria-label="Search menu"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className={styles.searchClear}
                                    aria-label="Clear search"
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            )}
                        </div>

                        <Link
                            href="/gallery/"
                            className={styles.galleryBtn}
                            aria-label="Explore Photo Gallery"
                        >
                            <div className={styles.galleryIconWrap}>
                                <FontAwesomeIcon icon={faCamera} />
                            </div>
                            <span className={styles.galleryText}>Gallery</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.content}>
                {groupedItems.length === 0 ? (
                    <div style={{ padding: "60px 16px", textAlign: "center", color: "#666" }}>
                        <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#060504", marginBottom: "6px" }}>No items found</h3>
                        <p style={{ fontSize: "14px", color: "#666666" }}>Try searching for another item on the menu.</p>
                    </div>
                ) : (
                    groupedItems.map((group, index) => (
                        <MenuSection key={group.id} category={group} items={group.items} index={index} />
                    ))
                )}

                {/* Homepage Featured Photo Gallery Teaser */}
                <div className={styles.galleryTeaser}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                        <div>
                            <h3 style={{
                                fontSize: "20px",
                                fontWeight: "800",
                                color: "#FF9F1C",
                                margin: 0,
                                fontFamily: "var(--font-claude-serif), Georgia, serif",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "10px",
                            }}>
                                <FontAwesomeIcon icon={faCamera} style={{ fontSize: "20px", color: "#FF9F1C" }} />
                                <span>Photo Gallery</span>
                            </h3>
                            <p style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.70)", margin: "4px 0 0 0", fontFamily: "var(--font-claude-sans), Inter, sans-serif" }}>
                                Authentic photos of our burgers, kitchen & store
                            </p>
                        </div>
                        <Link href="/gallery/" style={{ fontSize: "13px", fontWeight: "700", color: "#ffffff", textDecoration: "none", padding: "8px 18px", backgroundColor: "var(--accent)", borderRadius: "99px", boxShadow: "0 4px 12px rgba(207, 75, 19, 0.30)", transition: "all 0.2s ease", whiteSpace: "nowrap" }}>
                            Explore Gallery →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Floating Action Buttons (Call + WhatsApp) */}
            <FloatingActions />

            {/* Floating Cart Bar */}
            <FloatingCartBar />

            {/* Full-screen Cart Drawer */}
            <CartDrawer />

            {/* Global Item Preview Modal */}
            <GlobalItemPreview />
        </main>
    );
}
