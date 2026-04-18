"use client";

import { menuItems, categories } from "@/app/data/menu";
import Header from "@/app/components/Header";
import CategoryNav from "@/app/components/CategoryNav";
import MenuSection from "@/app/components/MenuSection";
import FloatingCartBar from "@/app/components/FloatingCartBar";
import FloatingActions from "@/app/components/FloatingActions";
import CartDrawer from "@/app/components/CartDrawer";
import OrderSummary from "@/app/components/OrderSummary";
import GlobalItemPreview from "@/app/components/GlobalItemPreview";
import styles from "./page.module.css";

import { useCartStore } from "@/app/store/cartStore";
import { useEffect, useRef } from "react";

export default function Home() {
    const isCartOpen = useCartStore((s) => s.isCartOpen);
    const setIsCartOpen = useCartStore((s) => s.setIsCartOpen);
    const isOrderSummaryOpen = useCartStore((s) => s.isOrderSummaryOpen);
    const setIsOrderSummaryOpen = useCartStore((s) => s.setIsOrderSummaryOpen);
    const previewItem = useCartStore((s) => s.previewItem);
    const setPreviewItem = useCartStore((s) => s.setPreviewItem);

    // Refs to track previous states and prevent redundant pushState
    const lastOverlayRef = useRef(false);

    // Handle Mobile Back Button interaction
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const isAnyOpen = isCartOpen || isOrderSummaryOpen || !!previewItem;
            
            // If an overlay just opened, push a state
            if (isAnyOpen && !lastOverlayRef.current) {
                window.history.pushState({ overlay: true }, "");
            } 
            // If all overlays closed, and we had pushed a state, go back
            else if (!isAnyOpen && lastOverlayRef.current) {
                if (window.history.state?.overlay) {
                    window.history.back();
                }
            }

            lastOverlayRef.current = isAnyOpen;
        }, 150); // Small 150ms buffer to catch transitions (like Cart -> Summary)

        return () => clearTimeout(timeoutId);
    }, [isCartOpen, isOrderSummaryOpen, previewItem]);

    // Global listener for popstate (Hardware back button)
    useEffect(() => {
        const handlePopState = (e: PopStateEvent) => {
            // If the user went back to a state without an overlay, close all modals
            if (!e.state?.overlay) {
                setIsCartOpen(false);
                setIsOrderSummaryOpen(false);
                setPreviewItem(null);
            }
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [setIsCartOpen, setIsOrderSummaryOpen, setPreviewItem]);

    // Group items by category
    const groupedItems = categories
        .map((cat) => ({
            ...cat,
            items: menuItems.filter((item) => item.category === cat.name),
        }))
        .filter((group) => group.items.length > 0);

    return (
        <main className={styles.main}>
            {/* Fixed Header */}
            <Header />

            {/* Sticky Category Nav */}
            <CategoryNav />

            {/* Main Content — padded for fixed header + category bar */}
            <div className={styles.content}>
                {groupedItems.map((group, index) => (
                    <MenuSection key={group.id} category={group} items={group.items} index={index} />
                ))}
            </div>

            {/* Floating Action Buttons (Call + WhatsApp) */}
            <FloatingActions />

            {/* Floating Cart Bar */}
            <FloatingCartBar />

            {/* Full-screen Cart Drawer */}
            <CartDrawer />

            {/* Order Summary Screen */}
            <OrderSummary />

            {/* Global Item Preview Modal */}
            <GlobalItemPreview />
        </main>
    );
}
