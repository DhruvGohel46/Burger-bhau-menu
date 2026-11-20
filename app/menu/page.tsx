import type { Metadata } from "next";
import { SITE_URL } from "@/lib/siteConfig";
import { getDynamicCategories, getDynamicMenuItems } from "@/app/data/menu";
import MenuPageClient from "@/app/components/MenuPageClient";
import { buildRestaurantJsonLd, buildMenuJsonLd } from "@/lib/restaurantSchema";

export const metadata: Metadata = {
    title: "Official Menu | Burger Bhau Kothariya, Rajkot",
    description:
        "Full menu with prices for Burger Bhau (Kothariya, Rajkot). Fresh burgers, loaded fries, cheese burst pizza, grilled sandwiches, and garlic bread. Order or visit our store.",
    alternates: {
        canonical: `${SITE_URL}/menu/`,
    },
    openGraph: {
        title: "Official Menu | Burger Bhau Kothariya, Rajkot",
        description:
            "Full menu with prices for Burger Bhau (Kothariya, Rajkot). Fresh burgers, loaded fries, cheese burst pizza, grilled sandwiches, and garlic bread.",
        url: `${SITE_URL}/menu/`,
        type: "website",
        locale: "en_IN",
    },
    twitter: {
        card: "summary_large_image",
        title: "Official Menu | Burger Bhau Kothariya, Rajkot",
        description:
            "Full menu with prices for Burger Bhau (Kothariya, Rajkot). Fresh burgers, loaded fries, cheese burst pizza, grilled sandwiches, and garlic bread.",
    },
};

export default async function MenuPage() {
    const categories = await getDynamicCategories();
    const items = await getDynamicMenuItems();
    const restaurantJsonLd = buildRestaurantJsonLd(categories, items);
    const menuJsonLd = buildMenuJsonLd(categories, items);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd) }}
            />
            <MenuPageClient initialCategories={categories} initialItems={items} />
        </>
    );
}
