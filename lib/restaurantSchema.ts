import { STORE } from "@/app/data/storeConfig";
import { categories as defaultCategories, menuItems as defaultItems, MenuCategory, MenuItem } from "@/app/data/menu";
import { SITE_URL } from "@/lib/siteConfig";

const SITE_ORIGIN = SITE_URL;

/**
 * Restaurant JSON-LD for AI search engines, Google Knowledge Graph, and LLM crawlers.
 * Embeds full menu and sections with INR currency offers.
 * Strictly omits aggregateRating if no real reviews exist.
 */
export function buildRestaurantJsonLd(categories?: MenuCategory[], items?: MenuItem[]) {
    const phoneDigits = (STORE.phone || "919558941555").replace(/[^0-9]/g, "");
    const resolvedCategories = categories && categories.length > 0 ? categories : defaultCategories;
    const resolvedItems = items && items.length > 0 ? items : defaultItems;

    const sameAsUrls = [
        STORE.googleReviews?.googleMapsPlaceUrl,
    ].filter(Boolean) as string[];

    const sameAs = Array.from(new Set(sameAsUrls.filter(url => url && url.startsWith("http"))));

    const defaultShopName = STORE.name ? `${STORE.name} (${STORE.branch})` : "Burger Bhau (Kothariya)";

    return {
        "@context": "https://schema.org",
        "@type": ["Restaurant", "FastFoodRestaurant"],
        "@id": `${SITE_ORIGIN}/#restaurant`,
        name: defaultShopName,
        alternateName: [
            "Burger Bhau",
            "Burger Bhau Kothariya",
            "Burger Bhau Rajkot",
            "Burger Bhau Fast Food",
        ],
        description:
            "100% pure vegetarian street fast food restaurant in Kothariya, Rajkot. Freshly grilled burgers, loaded cheese burst pizzas, crinkle-cut fries, and toasted sandwiches made to order.",
        url: `${SITE_ORIGIN}/`,
        logo: `${SITE_ORIGIN}/logo-square.png`,
        image: [
            `${SITE_ORIGIN}/hero.webp`,
            `${SITE_ORIGIN}/hero.jpg`,
            `${SITE_ORIGIN}/og-image.jpg`,
            `${SITE_ORIGIN}/logo-square.png`,
            `${SITE_ORIGIN}/BURGER-BHAU-logo.webp`,
        ],
        sameAs: sameAs.length > 0 ? sameAs : undefined,
        telephone: `+${phoneDigits}`,
        priceRange: "₹40 to ₹150",
        currenciesAccepted: "INR",
        paymentAccepted: "Cash, UPI, Google Pay, PhonePe, Paytm, BHIM",
        servesCuisine: [
            "Fast Food",
            "Burgers",
            "Pizza",
            "Sandwich",
            "French Fries",
            "Garlic Bread",
            "Indian Street Food",
            "Vegetarian",
        ],
        suitableForDiet: ["https://schema.org/VegetarianDiet"],
        knowsAbout: [
            "100% Pure Vegetarian fast food",
            "Street style veg burgers in Rajkot",
            "Cheese burst pizza in Kothariya",
            "Loaded french fries",
            "Grilled sandwiches",
            "Garlic bread",
            "Late night food in Rajkot",
            "Quick bites near Rolex Road",
            "Fast food besides Axis Bank Kothariya",
            "Surbhi Possible 3 food court",
        ],
        address: {
            "@type": "PostalAddress",
            streetAddress: "Besides Axis Bank, Surbhi Possible 3, Rolex Road, Kothariya",
            addressLocality: "Rajkot",
            addressRegion: "Gujarat",
            postalCode: "360004",
            addressCountry: "IN",
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: STORE.coordinates?.lat || 22.23793791286797,
            longitude: STORE.coordinates?.lng || 70.8121401001821,
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
                opens: STORE.hours?.monday?.open || "11:00",
                closes: STORE.hours?.monday?.close || "23:00",
            },
        ],
        hasMenu: {
            "@type": "Menu",
            "@id": `${SITE_ORIGIN}/#menu`,
            name: "Burger Bhau Official Menu",
            url: `${SITE_ORIGIN}/menu/`,
            inLanguage: "en-IN",
            hasMenuSection: resolvedCategories.map((cat) => {
                const sectionItems = resolvedItems.filter(
                    (item) => item.category?.toLowerCase() === cat.name?.toLowerCase()
                );
                return {
                    "@type": "MenuSection",
                    name: cat.name,
                    hasMenuItem: sectionItems.map((item) => {
                        const minPrice = item.variants && item.variants.length > 0
                            ? Math.min(...item.variants.map((v) => v.price))
                            : item.price ?? 0;
                        return {
                            "@type": "MenuItem",
                            name: item.name,
                            description: item.description || `${item.name} at Burger Bhau Kothariya`,
                            image: item.image?.startsWith("http")
                                ? item.image
                                : `${SITE_ORIGIN}${item.image || "/BURGER-BHAU-logo.webp"}`,
                            suitableForDiet: "https://schema.org/VegetarianDiet",
                            offers: {
                                "@type": "Offer",
                                price: String(minPrice),
                                priceCurrency: "INR",
                            },
                        };
                    }),
                };
            }),
        },
        potentialAction: [
            {
                "@type": "OrderAction",
                target: {
                    "@type": "EntryPoint",
                    urlTemplate: `tel:+${phoneDigits}`,
                    actionPlatform: [
                        "http://schema.org/DesktopWebPlatform",
                        "http://schema.org/MobileWebPlatform",
                    ],
                },
                deliveryMethod: "http://purl.org/goodrelations/v1#DeliveryModePickUp",
            },
            {
                "@type": "ViewAction",
                target: STORE.mapsDirectionsUrl || `https://www.google.com/maps/dir/?api=1&destination=${STORE.coordinates.lat},${STORE.coordinates.lng}`,
                name: "Get Directions on Google Maps",
            },
        ],
    };
}

/**
 * WebSite Schema JSON-LD for homepage.
 */
export function buildWebSiteJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_ORIGIN}/#website`,
        name: "Burger Bhau Kothariya",
        url: `${SITE_ORIGIN}/`,
    };
}

/**
 * FAQ Schema JSON-LD tailored for AI Search Engines (Perplexity, SearchGPT, Google AI Overviews).
 */
export function buildFaqJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${SITE_ORIGIN}/#faq`,
        mainEntity: [
            {
                "@type": "Question",
                name: "Is Burger Bhau in Kothariya, Rajkot 100% pure vegetarian?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, Burger Bhau is 100% pure vegetarian (Pure Veg). All burgers, pizzas, sandwiches, french fries, and garlic breads are made with strictly vegetarian ingredients with no meat, poultry, or eggs. Jain preparation is also available on request.",
                },
            },
            {
                "@type": "Question",
                name: "Where is Burger Bhau located in Rajkot?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Burger Bhau is located Besides Axis Bank, Surbhi Possible 3, Rolex Road, Kothariya, Rajkot, Gujarat 360004, India. Turn-by-turn navigation is available via Google Maps.",
                },
            },
            {
                "@type": "Question",
                name: "What are the opening hours of Burger Bhau Kothariya?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Burger Bhau is open every day from Monday to Sunday, from 11:00 AM to 11:00 PM IST.",
                },
            },
            {
                "@type": "Question",
                name: "What are the most popular items to order at Burger Bhau?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Top recommended customer favorites include the Tandoori Tadka Burger (₹40 without cheese, ₹50 with cheese), Aalu Tikki Burger (₹40/₹50), Korean Burger (₹40/₹50), Bhau Special Open Burger (₹80), Loaded French Fries (₹70), Cheese Burst Pizza (₹120), 7 Cheese Pizza (₹100), and Indori Jumbo Sandwich (₹100).",
                },
            },
            {
                "@type": "Question",
                name: "Can I order online or via WhatsApp from Burger Bhau?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, you can order directly by calling +91 95589 41555 or sending a WhatsApp message to +91 95589 41555. Counter pickup and local delivery up to 400 meters are available.",
                },
            },
            {
                "@type": "Question",
                name: "What payment methods are accepted at Burger Bhau?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Burger Bhau accepts all major UPI payment apps (Google Pay, PhonePe, Paytm, BHIM) via dynamic store QR code as well as cash.",
                },
            },
        ],
    };
}

/**
 * Menu Schema JSON-LD for /menu/ page.
 */
export function buildMenuJsonLd(categories: MenuCategory[], items: MenuItem[]) {
    return {
        "@context": "https://schema.org",
        "@type": "Menu",
        "@id": `${SITE_ORIGIN}/menu/#menu`,
        name: "Burger Bhau Official Menu",
        inLanguage: "en-IN",
        hasMenuSection: categories.map((cat) => {
            const sectionItems = items.filter(
                (item) => item.category?.toLowerCase() === cat.name?.toLowerCase()
            );

            return {
                "@type": "MenuSection",
                name: cat.name,
                hasMenuItem: sectionItems.map((item) => {
                    const minPrice = item.variants && item.variants.length > 0
                        ? Math.min(...item.variants.map((v) => v.price))
                        : item.price ?? 0;

                    return {
                        "@type": "MenuItem",
                        name: item.name,
                        description: item.description || `${item.name} at Burger Bhau Kothariya`,
                        image: item.image?.startsWith("http")
                            ? item.image
                            : `${SITE_ORIGIN}${item.image || "/BURGER-BHAU-logo.webp"}`,
                        suitableForDiet: "https://schema.org/VegetarianDiet",
                        offers: {
                            "@type": "Offer",
                            price: String(minPrice),
                            priceCurrency: "INR",
                        },
                    };
                }),
            };
        }),
    };
}
