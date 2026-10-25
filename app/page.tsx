import type { Metadata } from "next";
import { getDynamicCategories, getDynamicMenuItems } from "@/app/data/menu";
import MenuPageClient from "@/app/components/MenuPageClient";
import { buildRestaurantJsonLd } from "@/lib/restaurantSchema";

export const metadata: Metadata = {
    title: "Burger Bhau Kothariya, Rajkot | Official Menu",
    description:
        "Explore the Burger Bhau Kothariya, Rajkot menu, featuring burgers, pizza, sandwiches, French fries and garlic bread. View menu items, prices and shop details.",
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "Burger Bhau Kothariya, Rajkot | Official Menu",
        description:
            "Explore the Burger Bhau Kothariya, Rajkot menu, featuring burgers, pizza, sandwiches, French fries and garlic bread. View menu items, prices and shop details.",
        url: "https://burgerbhau.netlify.app/",
        type: "website",
    },
    twitter: {
        title: "Burger Bhau Kothariya, Rajkot | Official Menu",
        description:
            "Explore the Burger Bhau Kothariya, Rajkot menu, featuring burgers, pizza, sandwiches, French fries and garlic bread.",
    },
};

export default async function Home() {
    const categories = await getDynamicCategories();
    const items = await getDynamicMenuItems();
    const jsonLd = buildRestaurantJsonLd();

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <MenuPageClient initialCategories={categories} initialItems={items} />
        </>
    );
}
