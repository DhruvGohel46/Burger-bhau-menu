import type { Metadata } from 'next';
import { getDynamicGalleryImages } from "@/app/data/galleryData";
import GalleryClient from "@/app/components/GalleryClient";

export const metadata: Metadata = {
    title: "Photo Gallery | Burger Bhau (Kothariya) - Real Food & Shop Photos",
    description: "Browse authentic photos of handcrafted burgers, garlic bread, fries, and store ambience at Burger Bhau (Kothariya) in Rajkot.",
    openGraph: {
        title: "Photo Gallery – Burger Bhau (Kothariya)",
        description: "Explore real food photos, burgers, pizzas, and store ambience at Burger Bhau Rajkot.",
        url: "https://burgerbhau.netlify.app/gallery",
        images: [
            {
                url: "/productimage/burger/aalu-tikki-burger.jpg",
                width: 800,
                height: 600,
                alt: "Aalu Tikki Burger - Burger Bhau Kothariya",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Photo Gallery – Burger Bhau (Kothariya)",
        description: "Browse authentic photos of handcrafted burgers and shop highlights.",
        images: ["/productimage/burger/aalu-tikki-burger.jpg"],
    },
};

export default async function GalleryPage() {
    const images = await getDynamicGalleryImages();

    const jsonLd = images.map((img) => ({
        "@context": "https://schema.org",
        "@type": "ImageObject",
        "contentUrl": img.public_url.startsWith("http") ? img.public_url : `https://burgerbhau.netlify.app${img.public_url}`,
        "name": img.title,
        "description": img.alt_text || img.caption || img.title,
        "representativeOfPage": false,
    }));

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <GalleryClient initialImages={images} />
        </>
    );
}
