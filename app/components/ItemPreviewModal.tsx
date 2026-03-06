"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faXmark } from "@fortawesome/free-solid-svg-icons";
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
    const extrasById = new Map(availableExtras.map((e) => [e.id, e] as const));
    const extrasTotal = selection.extras.reduce((sum, id) => sum + (extrasById.get(id)?.price ?? 0), 0);
    const total = basePrice + extrasTotal;

    const prep = getPrepTime(item);

    const toggleExtra = (id: string) => {
        const on = selection.extras.includes(id);
        onChange({
            ...selection,
            extras: on ? selection.extras.filter((x) => x !== id) : [...selection.extras, id],
        });
    };

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

                    {availableExtras.length > 0 ? (
                        <div className={styles.section}>
                            <div className={styles.sectionTitle}>Add-ons</div>
                            <div className={styles.addons}>
                                {availableExtras.map((e) => {
                                    const on = selection.extras.includes(e.id);
                                    return (
                                        <motion.button
                                            key={e.id}
                                            type="button"
                                            whileTap={{ scale: 0.99 }}
                                            className={styles.addonRow}
                                            onClick={() => toggleExtra(e.id)}
                                        >
                                            <span className={styles.addonLeft}>
                                                <span className={`${styles.toggle} ${on ? styles.toggleOn : ""}`}
                                                    aria-hidden="true"
                                                >
                                                    <span className={`${styles.toggleKnob} ${on ? styles.toggleKnobOn : ""}`} />
                                                </span>
                                                <span className={styles.addonName}>{e.name}</span>
                                            </span>
                                            <span className={styles.addonPrice}>+{formatPrice(e.price)}</span>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>
                    ) : null}

                    <div className={styles.summary}>
                        <div className={styles.summaryRow}>
                            <span>Base Price</span>
                            <span>{formatPrice(basePrice)}</span>
                        </div>
                        <div className={styles.summaryRow} style={{ marginTop: 8 }}>
                            <span>Add-ons</span>
                            <span>{formatPrice(extrasTotal)}</span>
                        </div>
                        <div className={styles.summaryDivider} />
                        <div className={styles.summaryTotal}>
                            <span>Total</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                    </div>
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
