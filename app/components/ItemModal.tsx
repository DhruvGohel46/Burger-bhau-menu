"use client";

import { AnimatePresence, motion } from "framer-motion";
import styles from "./ItemModal.module.css";
import type { MenuExtra, MenuItem, MenuVariant } from "@/app/data/menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export type ItemModalSelection = {
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

export default function ItemModal({
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
    selection: ItemModalSelection;
    onChange: (next: ItemModalSelection) => void;
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

    const handleBackdrop = () => onClose();

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

    return (
        <AnimatePresence>
            <motion.div
                key="item-modal-backdrop"
                className={styles.backdrop}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                onClick={handleBackdrop}
            />

            <motion.div
                key="item-modal-sheet"
                className={styles.sheet}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.header}>
                    <div style={{ minWidth: 0 }}>
                        <div className={styles.title}>{item.name}</div>
                        <div className={styles.desc}>{item.description}</div>
                    </div>
                    <button className={styles.close} onClick={onClose} aria-label="Close">
                        <FontAwesomeIcon icon={faXmark} width={18} height={18} />
                    </button>
                </div>

                {hasVariants && (
                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>Choose size</div>
                        <div className={styles.options}>
                            {variants.map((v) => {
                                const active = v.id === selectedVariant?.id;
                                return (
                                    <button
                                        key={v.id}
                                        className={styles.option}
                                        onClick={() => setVariant(v.id)}
                                        type="button"
                                    >
                                        <span className={styles.optionLeft}>
                                            <span className={`${styles.dot} ${active ? styles.dotOn : ""}`} />
                                            <span className={styles.optionLabel}>{displayVariantLabel(item.category, v)}</span>
                                        </span>
                                        <span className={styles.optionPrice}>{formatPrice(v.price)}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {availableExtras.length > 0 && (
                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>Extras</div>
                        <div className={styles.options}>
                            {availableExtras.map((e) => {
                                const active = selection.extras.includes(e.id);
                                return (
                                    <button
                                        key={e.id}
                                        className={styles.option}
                                        onClick={() => toggleExtra(e.id)}
                                        type="button"
                                    >
                                        <span className={styles.optionLeft}>
                                            <span className={`${styles.check} ${active ? styles.checkOn : ""}`} />
                                            <span className={styles.optionLabel}>{e.name}</span>
                                        </span>
                                        <span className={styles.optionPrice}>+{formatPrice(e.price)}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className={styles.footer}>
                    <button className={styles.secondary} onClick={onClose} type="button">
                        Cancel
                    </button>
                    <button className={styles.primary} onClick={onConfirm} type="button">
                        Add to Cart <span className={styles.total}>{formatPrice(total)}</span>
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
