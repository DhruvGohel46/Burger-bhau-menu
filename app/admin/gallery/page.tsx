"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { uploadImageToSupabase } from "@/lib/storage";
import { triggerNetlifyBuildHook } from "@/lib/netlify";
import { GalleryImage, GalleryCategory } from "@/lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faArrowUp, faArrowDown, faStar, faImages, faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";

export default function AdminGalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedTab, setSelectedTab] = useState<"all" | GalleryCategory>("all");
    const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Form fields
    const [file, setFile] = useState<File | null>(null);
    const [category, setCategory] = useState<GalleryCategory>("food");
    const [title, setTitle] = useState("");
    const [altText, setAltText] = useState("");
    const [caption, setCaption] = useState("");
    const [isFeatured, setIsFeatured] = useState(false);

    useEffect(() => {
        loadGalleryImages();
    }, []);

    async function loadGalleryImages() {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("gallery_images")
                .select("*")
                .order("display_order", { ascending: true });

            if (!error && data) {
                setImages(data as GalleryImage[]);
            }
        } catch (err) {
            console.error("Error loading gallery images:", err);
        } finally {
            setLoading(false);
        }
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg(null);

        if (!file) {
            setMsg({ type: "error", text: "Please select an image file to upload." });
            return;
        }

        if (!title.trim()) {
            setMsg({ type: "error", text: "Image title is required." });
            return;
        }

        if (!altText.trim()) {
            setMsg({ type: "error", text: "Alt text is required for Google SEO compliance." });
            return;
        }

        setUploading(true);

        try {
            const publicUrl = await uploadImageToSupabase(file, "gallery");
            if (!publicUrl) {
                setMsg({ type: "error", text: "Failed to upload image file to storage." });
                setUploading(false);
                return;
            }

            const nextOrder = images.length > 0 ? Math.max(...images.map((i) => i.display_order || 0)) + 1 : 1;

            const { data, error } = await supabase
                .from("gallery_images")
                .insert({
                    storage_path: `gallery/${file.name}`,
                    public_url: publicUrl,
                    category,
                    title: title.trim(),
                    alt_text: altText.trim(),
                    caption: caption.trim() || null,
                    display_order: nextOrder,
                    is_featured: isFeatured,
                })
                .select("*")
                .single();

            if (error) {
                setMsg({ type: "error", text: error.message });
            } else {
                setMsg({ type: "success", text: "Gallery photo uploaded & published successfully!" });
                // Reset form
                setFile(null);
                setTitle("");
                setAltText("");
                setCaption("");
                setIsFeatured(false);
                loadGalleryImages();
                triggerNetlifyBuildHook();
            }
        } catch (err: any) {
            setMsg({ type: "error", text: err?.message || "Unexpected error occurred during upload." });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this photo from the gallery?")) return;

        try {
            const { error } = await supabase.from("gallery_images").delete().eq("id", id);
            if (error) {
                setMsg({ type: "error", text: error.message });
            } else {
                setMsg({ type: "success", text: "Photo removed from gallery." });
                setImages((prev) => prev.filter((item) => item.id !== id));
                triggerNetlifyBuildHook();
            }
        } catch (err: any) {
            setMsg({ type: "error", text: err?.message || "Failed to delete photo." });
        }
    };

    const toggleFeatured = async (img: GalleryImage) => {
        const updatedStatus = !img.is_featured;
        try {
            const { error } = await supabase
                .from("gallery_images")
                .update({ is_featured: updatedStatus })
                .eq("id", img.id);

            if (!error) {
                setImages((prev) =>
                    prev.map((item) => (item.id === img.id ? { ...item, is_featured: updatedStatus } : item))
                );
                triggerNetlifyBuildHook();
            }
        } catch (err) {}
    };

    const moveOrder = async (index: number, direction: "up" | "down") => {
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= filteredImages.length) return;

        const currentImg = filteredImages[index];
        const swapImg = filteredImages[targetIndex];

        const tempOrder = currentImg.display_order;
        currentImg.display_order = swapImg.display_order;
        swapImg.display_order = tempOrder;

        setImages([...images]);

        try {
            await supabase.from("gallery_images").update({ display_order: currentImg.display_order }).eq("id", currentImg.id);
            await supabase.from("gallery_images").update({ display_order: swapImg.display_order }).eq("id", swapImg.id);
            triggerNetlifyBuildHook();
        } catch (err) {}
    };

    const filteredImages = selectedTab === "all"
        ? images
        : images.filter((i) => i.category === selectedTab);

    return (
        <div style={{ maxWidth: "1000px" }}>
            <div style={{ marginBottom: "28px" }}>
                <h1 style={{
                    fontSize: "32px",
                    fontWeight: "700",
                    margin: 0,
                    color: "#F0E8C7",
                    fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                }}>
                    <FontAwesomeIcon icon={faImages} color="#ff8c00" /> Photo Gallery <span style={{ color: "#ff8c00" }}>Management</span>
                </h1>
                <p style={{ fontSize: "14px", color: "rgba(240, 232, 199, 0.7)", marginTop: "6px" }}>
                    Upload shop photos, food dishes, ambience, and events. WebP auto-compression and SEO alt tags are enforced.
                </p>
            </div>

            {msg && (
                <div style={{
                    backgroundColor: msg.type === "success" ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                    border: `1px solid ${msg.type === "success" ? "#22c55e" : "#ef4444"}`,
                    color: msg.type === "success" ? "#4ade80" : "#fca5a5",
                    padding: "14px 18px",
                    borderRadius: "14px",
                    fontSize: "14px",
                    fontWeight: "600",
                    marginBottom: "20px",
                }}>
                    {msg.text}
                </div>
            )}

            {/* Upload Form */}
            <form onSubmit={handleUpload} style={{
                backgroundColor: "rgba(22, 17, 13, 0.85)",
                border: "1px solid rgba(207, 75, 19, 0.25)",
                borderRadius: "20px",
                padding: "26px",
                marginBottom: "32px",
                display: "flex",
                flexDirection: "column",
                gap: "18px",
                boxShadow: "0 12px 32px rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(16px)",
            }}>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#ff8c00", margin: 0, fontFamily: "var(--font-playfair), serif", display: "flex", alignItems: "center", gap: "10px" }}>
                    <FontAwesomeIcon icon={faCloudUploadAlt} /> Add New Gallery Photo
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#aaa", marginBottom: "6px" }}>Select Photo *</label>
                        <input
                            type="file"
                            accept="image/*"
                            required
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            style={{ fontSize: "13px", color: "#aaa", width: "100%" }}
                        />
                        <p style={{ fontSize: "11px", color: "#777", marginTop: "4px" }}>Auto-compressed to WebP format for fast page loads.</p>
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#aaa", marginBottom: "6px" }}>Category *</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value as GalleryCategory)}
                            style={{ width: "100%", padding: "12px", backgroundColor: "#202020", border: "1px solid #333", borderRadius: "8px", color: "#fff", fontSize: "14px" }}
                        >
                            <option value="food">Food & Dishes</option>
                            <option value="shop">Shop & Counter</option>
                            <option value="interior">Interior & Ambience</option>
                            <option value="event">Events & Celebrations</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#aaa", marginBottom: "6px" }}>Photo Title *</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Aalu Tikki Burger"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ width: "100%", padding: "12px", backgroundColor: "#202020", border: "1px solid #333", borderRadius: "8px", color: "#fff", fontSize: "14px" }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#ff8c00", marginBottom: "6px" }}>
                            Google SEO Alt Text * (Required)
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Aalu Tikki Burger with crispy patty at Burger Bhau Kothariya Rajkot"
                            value={altText}
                            onChange={(e) => setAltText(e.target.value)}
                            style={{ width: "100%", padding: "12px", backgroundColor: "#202020", border: "1px solid #ff8c00", borderRadius: "8px", color: "#fff", fontSize: "14px" }}
                        />
                    </div>
                </div>

                <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#aaa", marginBottom: "6px" }}>Caption (Optional)</label>
                    <input
                        type="text"
                        placeholder="Detailed story or description shown in photo lightbox..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        style={{ width: "100%", padding: "12px", backgroundColor: "#202020", border: "1px solid #333", borderRadius: "8px", color: "#fff", fontSize: "14px" }}
                    />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
                    <input
                        type="checkbox"
                        id="featured-check"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        style={{ width: "18px", height: "18px", accentColor: "#ff8c00", cursor: "pointer" }}
                    />
                    <label htmlFor="featured-check" style={{ fontSize: "14px", fontWeight: "600", color: "#fff", cursor: "pointer" }}>
                        Feature on Homepage Teaser Strip
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={uploading}
                    style={{
                        padding: "14px",
                        backgroundColor: "#ff8c00",
                        color: "#000",
                        border: "none",
                        borderRadius: "10px",
                        fontWeight: "800",
                        fontSize: "15px",
                        cursor: uploading ? "not-allowed" : "pointer",
                        opacity: uploading ? 0.7 : 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                    }}
                >
                    <FontAwesomeIcon icon={faPlus} />
                    {uploading ? "Uploading & Compressing..." : "Upload & Publish Photo"}
                </button>
            </form>

            {/* Gallery Category Tabs */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
                {(["all", "food", "shop", "interior", "event"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "20px",
                            border: `1px solid ${selectedTab === tab ? "#ff8c00" : "#333"}`,
                            backgroundColor: selectedTab === tab ? "#ff8c00" : "#1a1a1a",
                            color: selectedTab === tab ? "#000" : "#ccc",
                            fontWeight: "700",
                            fontSize: "13px",
                            cursor: "pointer",
                            textTransform: "capitalize",
                        }}
                    >
                        {tab === "all" ? "All Photos" : tab}
                    </button>
                ))}
            </div>

            {/* Photo Grid */}
            {loading ? (
                <p style={{ color: "#aaa" }}>Loading gallery photos...</p>
            ) : filteredImages.length === 0 ? (
                <p style={{ color: "#888", textAlign: "center", padding: "40px 0" }}>No photos found in this category. Upload your first photo above!</p>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "18px" }}>
                    {filteredImages.map((img, idx) => (
                        <div
                            key={img.id}
                            style={{
                                backgroundColor: "#181818",
                                border: "1px solid #2a2a2a",
                                borderRadius: "12px",
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <div style={{ position: "relative", width: "100%", height: "160px", backgroundColor: "#000" }}>
                                <img
                                    src={img.public_url}
                                    alt={img.alt_text}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                                {img.is_featured && (
                                    <span style={{ position: "absolute", top: "8px", right: "8px", backgroundColor: "#ff8c00", color: "#000", fontSize: "10px", fontWeight: "800", padding: "2px 6px", borderRadius: "4px" }}>
                                        Featured
                                    </span>
                                )}
                            </div>

                            <div style={{ padding: "12px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                <div>
                                    <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#fff", margin: "0 0 4px 0" }}>
                                        {img.title}
                                    </h4>
                                    <span style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", fontWeight: "600" }}>
                                        {img.category}
                                    </span>
                                    <p style={{ fontSize: "11px", color: "#aaa", marginTop: "4px", margin: "4px 0 0 0" }}>
                                        <strong>Alt:</strong> {img.alt_text}
                                    </p>
                                </div>

                                <div style={{ display: "flex", gap: "6px", marginTop: "12px", borderTop: "1px solid #282828", paddingTop: "8px" }}>
                                    <button
                                        onClick={() => moveOrder(idx, "up")}
                                        disabled={idx === 0}
                                        style={{ padding: "6px 8px", backgroundColor: "#262626", border: "1px solid #333", color: "#fff", borderRadius: "6px", cursor: idx === 0 ? "not-allowed" : "pointer" }}
                                        title="Move Up"
                                    >
                                        <FontAwesomeIcon icon={faArrowUp} style={{ fontSize: "11px" }} />
                                    </button>
                                    <button
                                        onClick={() => moveOrder(idx, "down")}
                                        disabled={idx === filteredImages.length - 1}
                                        style={{ padding: "6px 8px", backgroundColor: "#262626", border: "1px solid #333", color: "#fff", borderRadius: "6px", cursor: idx === filteredImages.length - 1 ? "not-allowed" : "pointer" }}
                                        title="Move Down"
                                    >
                                        <FontAwesomeIcon icon={faArrowDown} style={{ fontSize: "11px" }} />
                                    </button>
                                    <button
                                        onClick={() => toggleFeatured(img)}
                                        style={{ padding: "6px 8px", backgroundColor: img.is_featured ? "rgba(255, 140, 0, 0.2)" : "#262626", border: `1px solid ${img.is_featured ? "#ff8c00" : "#333"}`, color: img.is_featured ? "#ff8c00" : "#888", borderRadius: "6px", cursor: "pointer", flex: 1, fontSize: "11px", fontWeight: "700" }}
                                    >
                                        <FontAwesomeIcon icon={faStar} /> {img.is_featured ? "Featured" : "Feature"}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(img.id)}
                                        style={{ padding: "6px 8px", backgroundColor: "rgba(255, 68, 68, 0.2)", border: "1px solid #ff4444", color: "#ff6b6b", borderRadius: "6px", cursor: "pointer" }}
                                        title="Delete Photo"
                                    >
                                        <FontAwesomeIcon icon={faTrash} style={{ fontSize: "11px" }} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
