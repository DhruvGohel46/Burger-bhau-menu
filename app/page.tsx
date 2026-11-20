import type { Metadata } from "next";
import { SITE_URL } from "@/lib/siteConfig";
import { STORE } from "@/app/data/storeConfig";
import { getDynamicCategories, getDynamicMenuItems } from "@/app/data/menu";
import { buildRestaurantJsonLd, buildFaqJsonLd, buildWebSiteJsonLd } from "@/lib/restaurantSchema";
import LandingNav from "@/app/components/landing/LandingNav";
import HeroSection from "@/app/components/landing/HeroSection";
import TrustStrip from "@/app/components/landing/TrustStrip";
import MostLovedSection from "@/app/components/landing/MostLovedSection";
import FindUsSection from "@/app/components/landing/FindUsSection";
import FaqSection from "@/app/components/landing/FaqSection";
import ReviewsSection from "@/app/components/landing/ReviewsSection";
import LandingFooter from "@/app/components/landing/LandingFooter";
import StickyActionBar from "@/app/components/StickyActionBar";

export const metadata: Metadata = {
    title: "Burger Bhau Kothariya | Burgers, Pizza & Fast Food in Rajkot",
    description:
        "Order fresh handcrafted burgers, pizzas and sandwiches from Burger Bhau, Kothariya, Rajkot. See the full menu, prices and call or WhatsApp to order.",
    alternates: {
        canonical: "https://burgerbhaukothariya.in/",
    },
    openGraph: {
        title: "Burger Bhau Kothariya | Burgers, Pizza & Fast Food in Rajkot",
        description:
            "Order fresh handcrafted burgers, pizzas and sandwiches from Burger Bhau, Kothariya, Rajkot. See the full menu, prices and call or WhatsApp to order.",
        url: "https://burgerbhaukothariya.in/",
        type: "website",
        locale: "en_IN",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Burger Bhau Kothariya | Burgers, Pizza & Fast Food in Rajkot",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Burger Bhau Kothariya | Burgers, Pizza & Fast Food in Rajkot",
        description:
            "Order fresh handcrafted burgers, pizzas and sandwiches from Burger Bhau, Kothariya, Rajkot. See the full menu, prices and call or WhatsApp to order.",
        images: ["/og-image.jpg"],
    },
};

export default async function HomePage() {
    const categories = await getDynamicCategories();
    const items = await getDynamicMenuItems();
    const restaurantJsonLd = buildRestaurantJsonLd(categories, items);
    const webSiteJsonLd = buildWebSiteJsonLd();
    const faqJsonLd = buildFaqJsonLd();

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <main>
                <LandingNav />
                <HeroSection />
                <TrustStrip />
                <MostLovedSection items={items} />
                <ReviewsSection />
                <FindUsSection />
                <FaqSection />
                <LandingFooter />
                <StickyActionBar />
            </main>
        </>
    );
}
