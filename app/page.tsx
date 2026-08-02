"use client";

import { useEffect, useState, useRef } from "react";
import { getDynamicCategories, getDynamicMenuItems, MenuItem, MenuCategory } from "@/app/data/menu";
import Header from "@/app/components/Header";
import CategoryNav from "@/app/components/CategoryNav";
import MenuSection from "@/app/components/MenuSection";
import FloatingCartBar from "@/app/components/FloatingCartBar";
import FloatingActions from "@/app/components/FloatingActions";
import CartDrawer from "@/app/components/CartDrawer";
import GlobalItemPreview from "@/app/components/GlobalItemPreview";
import styles from "./page.module.css";
import { useCartStore } from "@/app/store/cartStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
    const isCartOpen = useCartStore((s) => s.isCartOpen);
    const setIsCartOpen = useCartStore((s) => s.setIsCartOpen);
    const isOrderSummaryOpen = useCartStore((s) => s.isOrderSummaryOpen);
    const setIsOrderSummaryOpen = useCartStore((s) => s.setIsOrderSummaryOpen);
    const previewItem = useCartStore((s) => s.previewItem);
    const setPreviewItem = useCartStore((s) => s.setPreviewItem);

    // Dynamic state from Supabase DB
    const [allCategories, setAllCategories] = useState<MenuCategory[]>([]);
    const [allItems, setAllItems] = useState<MenuItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Refs to track previous overlay states
    const lastOverlayRef = useRef(false);

    useEffect(() => {
        async function loadMenu() {
            const cats = await getDynamicCategories();
            const items = await getDynamicMenuItems();
            setAllCategories(cats);
            setAllItems(items);
        }
        loadMenu();
    }, []);

    // Handle Mobile Back Button interaction
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const isAnyOpen = isCartOpen || isOrderSummaryOpen || !!previewItem;
            if (isAnyOpen && !lastOverlayRef.current) {
                window.history.pushState({ overlay: true }, "");
            } else if (!isAnyOpen && lastOverlayRef.current) {
                if (window.history.state?.overlay) {
                    window.history.back();
                }
            }
            lastOverlayRef.current = isAnyOpen;
        }, 150);

        return () => clearTimeout(timeoutId);
    }, [isCartOpen, isOrderSummaryOpen, previewItem]);

    // Listener for hardware back button
    useEffect(() => {
        const handlePopState = (e: PopStateEvent) => {
            if (!e.state?.overlay) {
                setIsCartOpen(false);
                setIsOrderSummaryOpen(false);
                setPreviewItem(null);
            }
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

    // Group items by category
    const groupedItems = allCategories
        .map((cat) => ({
            ...cat,
            items: filteredItems.filter((item) => item.category === cat.name),
        }))
        .filter((group) => group.items.length > 0);

    return (
        <main className={styles.main}>
            {/* Fixed Header */}
            <Header />

            {/* Sticky Category Nav */}
            <CategoryNav />

            {/* Main Content */}
            <div className={styles.content}>
                {/* Instant Menu Search Bar */}
                <div style={{
                    marginBottom: "20px",
                }}>
                    <div style={{
                        position: "relative",
                        width: "100%",
                    }}>
                        <FontAwesomeIcon
                            icon={faSearch}
                            style={{
                                position: "absolute",
                                left: "16px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#CF4B13",
                                fontSize: "14px",
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Search burgers, fries, sandwiches..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "12px 16px 12px 42px",
                                backgroundColor: "#060504",
                                border: "1px solid rgba(6, 5, 4, 0.15)",
                                borderRadius: "16px",
                                color: "#ffffff",
                                fontSize: "14px",
                                outline: "none",
                                boxShadow: "0 4px 14px rgba(6, 5, 4, 0.08)",
                            }}
                        />
                    </div>
                </div>

                {groupedItems.length === 0 ? (
                    <div style={{ padding: "40px 16px", textAlign: "center", color: "#666" }}>
                        <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#060504", marginBottom: "6px" }}>No items found</h3>
                        <p style={{ fontSize: "14px", color: "#666" }}>Try searching for another item on the menu.</p>
                    </div>
                ) : (
                    groupedItems.map((group, index) => (
                        <MenuSection key={group.id} category={group} items={group.items} index={index} />
                    ))
                )}
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
