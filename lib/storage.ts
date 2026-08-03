import { supabase } from "./supabase";

export const BUCKET_NAME = "burger-bhau-assets";

export async function compressAndConvertToWebp(file: File): Promise<Blob> {
    return new Promise((resolve) => {
        const img = new Image();
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };
        reader.onerror = () => resolve(file);
        img.onload = () => {
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;

            const MAX_DIM = 1600;
            if (width > MAX_DIM || height > MAX_DIM) {
                if (width > height) {
                    height = Math.round((height * MAX_DIM) / width);
                    width = MAX_DIM;
                } else {
                    width = Math.round((width * MAX_DIM) / height);
                    height = MAX_DIM;
                }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
                resolve(file);
                return;
            }
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        resolve(file);
                    }
                },
                "image/webp",
                0.85
            );
        };
        reader.readAsDataURL(file);
    });
}

export async function uploadImageToSupabase(
    file: File,
    folder: "products" | "qr" | "branding" | "gallery" = "products"
): Promise<string | null> {
    try {
        // Convert to WebP for maximum performance & small payload size
        const webpBlob = await compressAndConvertToWebp(file);
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.webp`;

        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, webpBlob, {
                contentType: "image/webp",
                cacheControl: "31536000",
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
