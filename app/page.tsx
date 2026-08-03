import { getDynamicCategories, getDynamicMenuItems, MenuItem, MenuCategory } from "@/app/data/menu";
import MenuPageClient from "@/app/components/MenuPageClient";

function generateRestaurantJsonLd(categories: MenuCategory[], items: MenuItem[]) {
    const hasMenuSection = categories.map((cat) => {
        const catItems = items.filter((item) => item.category === cat.name);
        return {
            "@type": "MenuSection",
            "name": cat.name,
            "hasMenuItem": catItems.map((item) => {
                const itemPrice = item.price || item.variants?.[0]?.price || 50;
                return {
                    "@type": "MenuItem",
                    "name": item.name,
                    "description": item.description || `${item.name} at Burger Bhau (Kothariya)`,
                    "offers": {
                        "@type": "Offer",
                        "price": String(itemPrice),
                        "priceCurrency": "INR",
                    },
                };
            }),
        };
    }).filter((s) => s.hasMenuItem.length > 0);

    return {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "name": "Burger Bhau (Kothariya)",
        "image": "https://burgerbhau.netlify.app/BURGER-BHAU-logo.webp",
        "@id": "https://burgerbhau.netlify.app",
        "url": "https://burgerbhau.netlify.app",
        "telephone": "+919558941555",
        "priceRange": "₹50–₹300",
        "servesCuisine": ["Fast Food", "Burgers", "Pizza", "Sandwich"],
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Rolex Road, Kothariya",
            "addressLocality": "Rajkot",
            "addressRegion": "Gujarat",
            "postalCode": "360004",
            "addressCountry": "IN",
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "22.2379",
            "longitude": "70.8121",
        },
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                "opens": "11:00",
                "closes": "23:00",
            },
        ],
        "menu": "https://burgerbhau.netlify.app/#menu",
        "acceptsReservations": "False",
        "hasMenu": {
            "@type": "Menu",
            "name": "Burger Bhau Full Menu",
            "hasMenuSection": hasMenuSection,
        },
    };
}

export default async function Home() {
    const categories = await getDynamicCategories();
    const items = await getDynamicMenuItems();
    const jsonLd = generateRestaurantJsonLd(categories, items);

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
