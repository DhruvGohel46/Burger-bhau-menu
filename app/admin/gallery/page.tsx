"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { uploadImageToSupabase } from "@/lib/storage";
import { triggerNetlifyBuildHook } from "@/lib/netlify";
import { GalleryImage, GalleryCategory } from "@/lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faArrowUp, faArrowDown, faStar, faImages, faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import styles from "./galleryAdmin.module.css";

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
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    <FontAwesomeIcon icon={faImages} className={styles.titleAccent} /> Photo Gallery <span className={styles.titleAccent}>Management</span>
                </h1>
                <p className={styles.subtitle}>
                    Upload shop photos, food dishes, ambience, and events. WebP auto-compression and SEO alt tags are enforced.
                </p>
            </div>

            {msg && (
                <div className={msg.type === "success" ? styles.msgSuccess : styles.msgError}>
                    {msg.text}
                </div>
            )}

            {/* Upload Form */}
            <form onSubmit={handleUpload} className={styles.uploadCard}>
                <h3 className={styles.cardHeading}>
                    <FontAwesomeIcon icon={faCloudUploadAlt} /> Add New Gallery Photo
                </h3>

                <div className={styles.formGrid}>
                    <div className={styles.field}>
                        <label className={styles.label}>Select Photo *</label>
                        <input
                            type="file"
                            accept="image/*"
                            required
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className={styles.fileInput}
                        />
                        <p className={styles.fieldHint}>Auto-compressed to WebP format for fast page loads.</p>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Category *</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value as GalleryCategory)}
                            className={styles.select}
                        >
                            <option value="food">Food &amp; Dishes</option>
                            <option value="shop">Shop &amp; Counter</option>
                            <option value="interior">Interior &amp; Ambience</option>
                            <option value="event">Events &amp; Celebrations</option>
                        </select>
                    </div>
                </div>

                <div className={styles.formGrid}>
                    <div className={styles.field}>
                        <label className={styles.label}>Photo Title *</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Aalu Tikki Burger"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={`${styles.label} ${styles.labelAccent}`}>
                            Google SEO Alt Text * (Required)
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Aalu Tikki Burger with crispy patty at Burger Bhau Kothariya Rajkot"
                            value={altText}
                            onChange={(e) => setAltText(e.target.value)}
                            className={`${styles.input} ${styles.inputAccent}`}
                        />
                    </div>
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Caption (Optional)</label>
                    <input
                        type="text"
                        placeholder="Detailed story or description shown in photo lightbox..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className={styles.input}
                    />
                </div>

                <div className={styles.checkboxRow}>
                    <input
                        type="checkbox"
                        id="featured-check"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className={styles.checkbox}
                    />
                    <label htmlFor="featured-check" className={styles.checkboxLabel}>
                        Feature on Homepage Teaser Strip
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={uploading}
                    className={styles.submitBtn}
                >
                    <FontAwesomeIcon icon={faPlus} />
                    {uploading ? "Uploading & Compressing..." : "Upload & Publish Photo"}
                </button>
            </form>

            {/* Gallery Category Tabs */}
            <div className={styles.tabsRow}>
                {(["all", "food", "shop", "interior", "event"] as const).map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setSelectedTab(tab)}
                        className={selectedTab === tab ? styles.tabBtnActive : styles.tabBtn}
                    >
                        {tab === "all" ? "All Photos" : tab}
                    </button>
                ))}
            </div>

            {/* Photo Grid */}
            {loading ? (
                <p className={styles.fieldHint}>Loading gallery photos...</p>
            ) : filteredImages.length === 0 ? (
                <p className={styles.emptyText}>No photos found in this category. Upload your first photo above!</p>
            ) : (
                <div className={styles.photoGrid}>
                    {filteredImages.map((img, idx) => (
                        <div
                            key={img.id}
                            className={styles.photoCard}
                        >
                            <div className={styles.photoThumbWrap}>
                                <img
                                    src={img.public_url}
                                    alt={img.alt_text}
                                    className={styles.photoThumb}
                                />
                                {img.is_featured && (
                                    <span className={styles.featuredBadge}>
                                        Featured
                                    </span>
                                )}
                            </div>

                            <div className={styles.photoDetails}>
                                <div>
                                    <h4 className={styles.photoTitle}>
                                        {img.title}
                                    </h4>
                                    <span className={styles.photoCategory}>
                                        {img.category}
                                    </span>
                                    <p className={styles.photoAlt}>
                                        <strong>Alt:</strong> {img.alt_text}
                                    </p>
                                </div>

                                <div className={styles.photoActions}>
                                    <button
                                        type="button"
                                        onClick={() => moveOrder(idx, "up")}
                                        disabled={idx === 0}
                                        className={styles.actionBtn}
                                        title="Move Up"
                                    >
                                        <FontAwesomeIcon icon={faArrowUp} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveOrder(idx, "down")}
                                        disabled={idx === filteredImages.length - 1}
                                        className={styles.actionBtn}
                                        title="Move Down"
                                    >
                                        <FontAwesomeIcon icon={faArrowDown} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => toggleFeatured(img)}
                                        className={img.is_featured ? styles.featuredBtnActive : styles.featuredBtn}
                                    >
                                        <FontAwesomeIcon icon={faStar} /> {img.is_featured ? "Featured" : "Feature"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(img.id)}
                                        className={styles.deleteBtn}
                                        title="Delete Photo"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
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
