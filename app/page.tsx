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

            {/* Instant Menu Search Bar */}
            <div style={{
                maxWidth: "1200px",
                margin: "16px auto 0 auto",
                padding: "0 16px",
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
                            color: "#ff8c00",
                            fontSize: "15px",
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Search delicious burgers, pizzas, fries..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "14px 16px 14px 42px",
                            backgroundColor: "#1a1a1a",
                            border: "1px solid #333",
                            borderRadius: "14px",
                            color: "#fff",
                            fontSize: "15px",
                            outline: "none",
                        }}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.content}>
                {groupedItems.length === 0 ? (
                    <div style={{ padding: "40px 16px", textAlign: "center", color: "#aaa" }}>
                        <h3>No items matched your search query</h3>
                        <p style={{ fontSize: "14px", color: "#666" }}>Try searching for another delicious item on the menu.</p>
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
