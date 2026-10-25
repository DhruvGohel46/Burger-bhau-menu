import { SHOP_LAT, SHOP_LNG, SHOP_NAME, SHOP_PHONE } from "@/app/data/shopConfig";

const SITE_ORIGIN = "https://burgerbhau.netlify.app";

/** Restaurant JSON-LD for public pages (no per-item menu markup — avoids product snippets on the homepage). */
export function buildRestaurantJsonLd() {
    const phoneDigits = SHOP_PHONE.replace(/[^0-9]/g, "");
    return {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "@id": `${SITE_ORIGIN}/#restaurant`,
        name: SHOP_NAME,
        url: `${SITE_ORIGIN}/`,
        image: `${SITE_ORIGIN}/BURGER-BHAU-logo.webp`,
        telephone: `+${phoneDigits}`,
        priceRange: "₹50–₹300",
        servesCuisine: ["Fast Food", "Burgers", "Pizza", "Sandwich", "Garlic Bread"],
        address: {
            "@type": "PostalAddress",
            streetAddress: "Rolex Road, Kothariya",
            addressLocality: "Rajkot",
            addressRegion: "Gujarat",
            postalCode: "360004",
            addressCountry: "IN",
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: SHOP_LAT,
            longitude: SHOP_LNG,
        },
        openingHoursSpecification: [
            {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                ],
                opens: "11:00",
                closes: "23:00",
            },
        ],
        hasMenu: `${SITE_ORIGIN}/`,
    };
}
