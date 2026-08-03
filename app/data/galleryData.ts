import { supabase } from "@/lib/supabase";
import { GalleryImage } from "@/lib/types";

// Empty fallback array as requested — user will upload custom images via Admin Panel
export const fallbackGalleryImages: GalleryImage[] = [];

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
