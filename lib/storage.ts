import { supabase } from "./supabase";

export const BUCKET_NAME = "burger-bhau-assets";

export async function uploadImageToSupabase(
    file: File,
    folder: "products" | "qr" | "branding" = "products"
): Promise<string | null> {
    try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, file, {
                cacheControl: "3600",
                upsert: true,
            });

        if (error) {
            console.error("Supabase Storage Upload Error:", error.message);
            return null;
        }

        const { data: publicUrlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(data.path);

        return publicUrlData.publicUrl;
    } catch (err) {
        console.error("Upload error:", err);
        return null;
    }
}
