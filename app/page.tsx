"use client";

import { menuItems, categories } from "@/app/data/menu";
import Header from "@/app/components/Header";
import CategoryNav from "@/app/components/CategoryNav";
import MenuSection from "@/app/components/MenuSection";
import FloatingCartBar from "@/app/components/FloatingCartBar";
import CartDrawer from "@/app/components/CartDrawer";
import OrderSummary from "@/app/components/OrderSummary";
import styles from "./page.module.css";

export default function Home() {
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
                {groupedItems.map((group) => (
                    <MenuSection key={group.id} category={group} items={group.items} />
                ))}
            </div>

            {/* Floating Cart Bar */}
            <FloatingCartBar />

            {/* Full-screen Cart Drawer */}
            <CartDrawer />

            {/* Order Summary Screen */}
            <OrderSummary />
        </main>
    );
}
