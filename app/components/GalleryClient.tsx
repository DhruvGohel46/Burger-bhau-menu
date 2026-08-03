"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { GalleryImage, GalleryCategory } from "@/lib/types";
import Header from "@/app/components/Header";
import FloatingActions from "@/app/components/FloatingActions";
import FloatingCartBar from "@/app/components/FloatingCartBar";
import CartDrawer from "@/app/components/CartDrawer";
import styles from "./GalleryClient.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faXmark,
    faChevronLeft,
    faChevronRight,
    faCamera,
    faUtensils,
    faStore,
    faBuilding,
    faGlassCheers,
} from "@fortawesome/free-solid-svg-icons";

export default function GalleryClient({ initialImages }: { initialImages: GalleryImage[] }) {
    const [images] = useState<GalleryImage[]>(initialImages);
    const [selectedCategory, setSelectedCategory] = useState<"all" | GalleryCategory>("all");
    const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

    // Touch Swipe handling for mobile lightbox
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);

    const filteredImages = selectedCategory === "all"
        ? images
        : images.filter((img) => img.category === selectedCategory);

    const handlePrev = () => {
        if (activeLightboxIndex === null) return;
        setActiveLightboxIndex((prev) => (prev! === 0 ? filteredImages.length - 1 : prev! - 1));
    };

    const handleNext = () => {
        if (activeLightboxIndex === null) return;
        setActiveLightboxIndex((prev) => (prev! === filteredImages.length - 1 ? 0 : prev! + 1));
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;
        const distance = touchStartX.current - touchEndX.current;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            handleNext();
        } else if (isRightSwipe) {
            handlePrev();
        }

        touchStartX.current = null;
        touchEndX.current = null;
    };

    const activeImage = activeLightboxIndex !== null ? filteredImages[activeLightboxIndex] : null;

    const categoryIcons = {
        all: faCamera,
        food: faUtensils,
        shop: faStore,
        interior: faBuilding,
        event: faGlassCheers,
    };

    return (
        <main className={styles.main}>
            <Header />

            <div className={styles.container}>
                {/* Back / Title Header */}
                <div className={styles.titleBar}>
                    <Link href="/" className={styles.backBtn} aria-label="Back to Menu">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </Link>
                    <div>
                        <h1 className={styles.pageTitle}>Photo Gallery</h1>
                        <p className={styles.pageSub}>
                            Explore handcrafted burgers, kitchen ambience & shop highlights at Burger Bhau (Kothariya)
                        </p>
                    </div>
                </div>

                {/* Filter Pills */}
                <div className={styles.pillsRow}>
                    {(["all", "food", "shop", "interior", "event"] as const).map((cat) => {
                        const isActive = selectedCategory === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`${styles.pill} ${isActive ? styles.pillActive : ""}`}
                            >
                                <FontAwesomeIcon icon={categoryIcons[cat]} className={styles.pillIcon} />
                                {cat === "all" ? "All Photos" : cat === "food" ? "Food & Dishes" : cat === "shop" ? "Shop & Counter" : cat === "interior" ? "Interior" : "Events"}
                            </button>
                        );
                    })}
                </div>

                {/* Photo Grid */}
                {filteredImages.length === 0 ? (
                    <div className={styles.empty}>
                        <h3>No photos found in this category</h3>
                        <p>Check back soon for new photos from Burger Bhau!</p>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {filteredImages.map((img, idx) => (
                            <div
                                key={img.id}
                                className={styles.card}
                                onClick={() => setActiveLightboxIndex(idx)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") setActiveLightboxIndex(idx);
                                }}
                            >
                                <div className={styles.imageWrap}>
                                    <img
                                        src={img.public_url}
                                        alt={img.alt_text}
                                        loading={idx < 4 ? "eager" : "lazy"}
                                        className={styles.img}
                                    />
                                    <div className={styles.overlay}>
                                        <span className={styles.categoryBadge}>{img.category}</span>
                                        <h3 className={styles.cardTitle}>{img.title}</h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Mobile Touch & Lightbox Modal */}
            {activeImage && (
                <div
                    className={styles.lightboxBackdrop}
                    onClick={() => setActiveLightboxIndex(null)}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                        <button
                            className={styles.lightboxClose}
                            onClick={() => setActiveLightboxIndex(null)}
                            aria-label="Close Lightbox"
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </button>

                        <button className={styles.lightboxNavLeft} onClick={handlePrev} aria-label="Previous image">
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>

                        <div className={styles.lightboxImageFrame}>
                            <img
                                src={activeImage.public_url}
                                alt={activeImage.alt_text}
                                className={styles.lightboxImg}
                            />
                        </div>

                        <button className={styles.lightboxNavRight} onClick={handleNext} aria-label="Next image">
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>

                        <div className={styles.lightboxMeta}>
                            <div className={styles.lightboxHeader}>
                                <span className={styles.categoryBadge}>{activeImage.category}</span>
                                <span className={styles.counter}>
                                    {activeLightboxIndex! + 1} of {filteredImages.length} (Swipe ↔)
                                </span>
                            </div>
                            <h2 className={styles.lightboxTitle}>{activeImage.title}</h2>
                            {activeImage.caption && <p className={styles.lightboxCaption}>{activeImage.caption}</p>}
                        </div>
                    </div>
                </div>
            )}

            <FloatingActions />
            <FloatingCartBar />
            <CartDrawer />
        </main>
    );
}
