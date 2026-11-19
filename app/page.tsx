import type { Metadata } from "next";
import { SITE_URL } from "@/lib/siteConfig";
import { STORE } from "@/app/data/storeConfig";
import { getDynamicMenuItems } from "@/app/data/menu";
import { buildRestaurantJsonLd, buildFaqJsonLd } from "@/lib/restaurantSchema";
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
    title: "Burger Bhau Kothariya, Rajkot | Made Fresh When You Order",
    description:
        "Visit Burger Bhau Besides Axis Bank, Surbhi Possible 3, Rolex Road, Kothariya, Rajkot. Freshly grilled street burgers, cheese burst pizza, loaded fries, and grilled sandwiches. Open daily 11 AM to 11 PM.",
    alternates: {
        canonical: `${SITE_URL}/`,
    },
    openGraph: {
        title: "Burger Bhau Kothariya, Rajkot | Made Fresh When You Order",
        description:
            "Visit Burger Bhau Besides Axis Bank, Surbhi Possible 3, Rolex Road, Kothariya, Rajkot. Freshly grilled street burgers, cheese burst pizza, loaded fries, and grilled sandwiches.",
        url: `${SITE_URL}/`,
        type: "website",
        images: [
            {
                url: STORE.heroImage,
                width: 1200,
                height: 800,
                alt: "Burger Bhau in Kothariya",
            },
        ],
    },
    twitter: {
        title: "Burger Bhau Kothariya, Rajkot | Fresh Burgers & Fast Food",
        description:
            "Visit Burger Bhau Besides Axis Bank, Surbhi Possible 3, Rolex Road, Kothariya, Rajkot. Freshly grilled street burgers, pizza & fries.",
        images: [STORE.heroImage],
    },
};

export default async function HomePage() {
    const items = await getDynamicMenuItems();
    const restaurantJsonLd = buildRestaurantJsonLd();
    const faqJsonLd = buildFaqJsonLd();

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
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
