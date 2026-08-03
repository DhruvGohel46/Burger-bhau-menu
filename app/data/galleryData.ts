import { supabase } from "@/lib/supabase";
import { GalleryImage } from "@/lib/types";

export const fallbackGalleryImages: GalleryImage[] = [
    {
        id: "gal-1",
        public_url: "/productimage/burger/aalu-tikki-burger.jpg",
        category: "food",
        title: "Aalu Tikki Burger",
        alt_text: "Crispy Aalu Tikki Burger at Burger Bhau Kothariya Rajkot",
        caption: "Our signature crispy aloo tikki burger with fresh veggies and tangy sauce.",
        display_order: 1,
        is_featured: true,
    },
    {
        id: "gal-2",
        public_url: "/productimage/burger/burger-tandoori-tadka.jpg",
        category: "food",
        title: "Tandoori Tadka Burger",
        alt_text: "Tandoori Tadka Burger with smoky sauce at Burger Bhau Rajkot",
        caption: "Smoky tandoori masala patty layered with creamy tadka sauce.",
        display_order: 2,
        is_featured: true,
    },
    {
        id: "gal-3",
        public_url: "/productimage/frenchfries/fries-loaded.jpg",
        category: "food",
        title: "Loaded Cheesy Fries",
        alt_text: "Loaded Cheesy French Fries at Burger Bhau Rolex Road Rajkot",
        caption: "Golden crispy fries smothered with melted cheese and signature sauces.",
        display_order: 3,
        is_featured: true,
    },
    {
        id: "gal-4",
        public_url: "/BURGER-BHAU-logo.webp",
        category: "shop",
        title: "Burger Bhau Kothariya Store Front",
        alt_text: "Burger Bhau Rolex Road Kothariya Rajkot Store Front",
        caption: "Visit us at Rolex Road, Kothariya, Rajkot for garma garam fast food!",
        display_order: 4,
        is_featured: true,
    },
    {
        id: "gal-5",
        public_url: "/productimage/sandwich/sandwich-cheese-chilli.jpg",
        category: "food",
        title: "Cheese Chilli Grill Sandwich",
        alt_text: "Cheese Chilli Grill Sandwich at Burger Bhau Kothariya",
        caption: "Crispy toasted sandwich with melty cheese and spicy chilli chutney.",
        display_order: 5,
        is_featured: false,
    },
    {
        id: "gal-6",
        public_url: "/productimage/burger/burger-bhau-special.jpg",
        category: "food",
        title: "Bhau Special Open Burger",
        alt_text: "Bhau Special Open Double Tikki Burger at Burger Bhau Rajkot",
        caption: "Double tikki open burger loaded with cheese and signature dressing.",
        display_order: 6,
        is_featured: true,
    },
];

export async function getDynamicGalleryImages(): Promise<GalleryImage[]> {
    try {
        const { data } = await supabase
            .from("gallery_images")
            .select("*")
            .order("display_order", { ascending: true });

        if (data && data.length > 0) {
            return data as GalleryImage[];
        }
    } catch (err) {
        console.error("Error fetching dynamic gallery images:", err);
    }
    return fallbackGalleryImages;
}
