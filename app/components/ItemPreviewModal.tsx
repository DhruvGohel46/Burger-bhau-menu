"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faXmark, faFire, faThumbsUp, faRibbon, faStar } from "@fortawesome/free-solid-svg-icons";
import styles from "./ItemPreviewModal.module.css";
import type { MenuExtra, MenuItem, MenuVariant } from "@/app/data/menu";

export type ItemPreviewSelection = {
    variantId?: string;
    extras: string[];
};

function formatPrice(p: number) {
    return `₹${p}`;
}

function displayVariantLabel(category: string, variant: MenuVariant) {
    const cat = category.toLowerCase();

    if (cat === "pizza") {
        if (variant.id === "regular") return "Dine-in";
        if (variant.id === "jumbo") return "Parcel";
    }

    if (cat === "burger" || cat === "sandwich") {
        if (variant.id === "regular") return "Without Cheese";
        if (variant.id === "jumbo") return "With Cheese";
    }

    return variant.label;
}

function getPrepTime(item: MenuItem) {
    const cat = item.category.toLowerCase();
    if (cat === "pizza") return "12–15 min";
    if (cat === "burger" || cat === "sandwich") return "6–9 min";
    if (cat === "french fries") return "4–6 min";
    if (cat === "garlic bread") return "8–10 min";
    return undefined;
}

export default function ItemPreviewModal({
    open,
    item,
    availableExtras,
    selection,
    onChange,
    onClose,
    onConfirm,
}: {
    open: boolean;
    item: MenuItem | null;
    availableExtras: MenuExtra[];
    selection: ItemPreviewSelection;
    onChange: (next: ItemPreviewSelection) => void;
    onClose: () => void;
    onConfirm: () => void;
}) {
    if (!open || !item) return null;

    const variants: MenuVariant[] = item.variants ?? [];
    const hasVariants = variants.length > 0;

    const selectedVariant = hasVariants
        ? variants.find((v) => v.id === selection.variantId) ?? variants[0]
        : undefined;

    const basePrice = selectedVariant?.price ?? item.price ?? 0;
    const total = basePrice;

    const prep = getPrepTime(item);



    const setVariant = (id: string) => {
        onChange({ ...selection, variantId: id });
    };

    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.y > 120 || info.velocity.y > 900) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                key="preview-backdrop"
                className={styles.backdrop}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                onClick={onClose}
            />

            <motion.div
                key="preview-sheet"
                className={styles.sheet}
                initial={{ opacity: 0, y: 28, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 28, scale: 0.95 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                drag="y"
                dragConstraints={{ top: 0, bottom: 260 }}
                dragElastic={0.12}
                onDragEnd={handleDragEnd}
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.grabber}>
                    <div className={styles.grabberBar} />
                </div>

                <motion.div
                    className={styles.hero}
                    initial={{ scale: 1.02 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.34, ease: "easeOut" }}
                >
                    <Image src={item.image} alt={item.name} fill sizes="(max-width: 430px) 92vw, 420px" priority />
                </motion.div>

                <div className={styles.content}>
                    <div className={styles.headerRow}>
                        <div style={{ minWidth: 0 }}>
                            {(item.is_bestseller || item.is_recommended || item.is_new || item.is_popular) && (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "6px" }}>
                                    {item.is_bestseller && (
                                        <span style={{ padding: "3px 8px", backgroundColor: "rgba(255, 140, 0, 0.15)", border: "1px solid #ff8c00", color: "#ff8c00", fontSize: "11px", fontWeight: "800", borderRadius: "6px", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                                            <FontAwesomeIcon icon={faFire} style={{ fontSize: "11px" }} />
                                            Bestseller
                                        </span>
                                    )}
                                    {item.is_recommended && (
                                        <span style={{ padding: "3px 8px", backgroundColor: "rgba(23, 162, 184, 0.15)", border: "1px solid #17a2b8", color: "#38d39f", fontSize: "11px", fontWeight: "800", borderRadius: "6px", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                                            <FontAwesomeIcon icon={faThumbsUp} style={{ fontSize: "11px" }} />
                                            Recommended
                                        </span>
                                    )}
                                    {item.is_new && (
                                        <span style={{ padding: "3px 8px", backgroundColor: "rgba(40, 167, 69, 0.15)", border: "1px solid #28a745", color: "#5dd579", fontSize: "11px", fontWeight: "800", borderRadius: "6px", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                                            <FontAwesomeIcon icon={faRibbon} style={{ fontSize: "11px" }} />
                                            New
                                        </span>
                                    )}
                                    {item.is_popular && (
                                        <span style={{ padding: "3px 8px", backgroundColor: "rgba(255, 193, 7, 0.15)", border: "1px solid #ffc107", color: "#ffd54f", fontSize: "11px", fontWeight: "800", borderRadius: "6px", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                                            <FontAwesomeIcon icon={faStar} style={{ fontSize: "11px" }} />
                                            Popular
                                        </span>
                                    )}
                                </div>
                            )}
                            <h2 className={styles.title}>{item.name}</h2>
                            {item.description ? <div className={styles.desc}>{item.description}</div> : null}

                            {prep ? (
                                <div className={styles.meta}>
                                    <span className={styles.metaPill}>
                                        <FontAwesomeIcon icon={faClock} width={14} height={14} />
                                        {prep}
                                    </span>
                                </div>
                            ) : null}
                        </div>

                        <button className={styles.close} onClick={onClose} aria-label="Close">
                            <FontAwesomeIcon icon={faXmark} width={18} height={18} />
                        </button>
                    </div>

                    {hasVariants ? (
                        <div className={styles.section}>
                            <div className={styles.sectionTitle}>Price variants</div>
                            <div className={styles.chips}>
                                {variants.map((v) => {
                                    const on = v.id === selectedVariant?.id;
                                    return (
                                        <motion.button
                                            key={v.id}
                                            type="button"
                                            whileTap={{ scale: 0.98 }}
                                            className={`${styles.chip} ${on ? styles.chipOn : ""}`}
                                            onClick={() => setVariant(v.id)}
                                        >
                                            <span className={styles.chipLabel}>{displayVariantLabel(item.category, v)}</span>
                                            <span className={styles.chipPrice}>{formatPrice(v.price)}</span>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className={styles.footer}>
                    <motion.button
                        whileTap={{ scale: 0.99 }}
                        className={styles.primary}
                        type="button"
                        onClick={onConfirm}
                    >
                        Add to Cart – {formatPrice(total)}
                    </motion.button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
