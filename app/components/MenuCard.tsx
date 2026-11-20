"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MenuItem, extras as globalExtras } from "@/app/data/menu";
import { buildCartLineId, useCartStore } from "@/app/store/cartStore";
import styles from "./MenuCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useMemo } from "react";

function displayVariantLabel(category: string, variantId: string | undefined, fallbackLabel: string | undefined) {
    const cat = category.toLowerCase();

    if (cat === "pizza") {
        if (variantId === "regular") return "Dine-in";
        if (variantId === "jumbo") return "Parcel";
    }

    if (cat === "burger" || cat === "sandwich") {
        if (variantId === "regular") return "Without Cheese";
        if (variantId === "jumbo") return "With Cheese";
    }

    return fallbackLabel;
}

export default function MenuCard({ item }: { item: MenuItem }) {
    const cartQtyForItem = useCartStore(
        (s) => s.cartItems.filter((c) => c.itemId === item.id).reduce((sum, c) => sum + c.quantity, 0)
    );
    const addItem = useCartStore((s) => s.addItem);
    const decreaseQty = useCartStore((s) => s.decreaseQty);
    const setPreviewItem = useCartStore((s) => s.setPreviewItem);

    const hasVariants = (item.variants?.length ?? 0) > 0;
    const imageSrc = item.image && item.image.trim() !== "" ? item.image.trim() : "/BURGER-BHAU-logo.webp";

    const isExtrasAllowed = item.category.toLowerCase() === "burger" || item.category.toLowerCase() === "sandwich";
    const allowedExtras = isExtrasAllowed ? globalExtras : [];
    const priceLabel = useMemo(() => {
        if (hasVariants && item.variants) {
            const prices = item.variants.map((v) => v.price);
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            return min === max ? `₹${min}` : `₹${min} / ₹${max}`;
        }
        return `₹${item.price ?? 0}`;
    }, [hasVariants, item.price, item.variants]);

    const handleAdd = () => {
        const needsModal = hasVariants || allowedExtras.length > 0;
        if (needsModal) {
            setPreviewItem(item);
            return;
        }

        const lineId = buildCartLineId({ itemId: item.id });
        addItem({
            id: lineId,
            itemId: item.id,
            name: item.name,
            price: item.price ?? 0,
            image: imageSrc,
        });
    };

    const handleOpenPreview = () => {
        setPreviewItem(item);
    };

    return (
        <>
            <div
                id={item.id}
                className={styles.card}
                role="button"
                tabIndex={0}
                onClick={handleOpenPreview}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleOpenPreview();
                }}
            >
                {/* 1. Left Section: Food Image */}
                <div className={styles.imageWrap}>
                    <Image
                        src={imageSrc}
                        alt={`${item.name} - Burger Bhau Kothariya`}
                        width={76}
                        height={76}
                        loading="lazy"
                        style={{ objectFit: "cover" }}
                    />
                </div>

                {/* 2. Center Section: Title & Text */}
                <div className={styles.centerContent}>
                    {(item.is_bestseller || item.is_recommended || item.is_new || item.is_popular) && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "4px" }}>
                            {item.is_bestseller && (
                                <span style={{
                                    padding: "2px 8px",
                                    backgroundColor: "var(--accent-soft)",
                                    color: "var(--accent)",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    borderRadius: "4px",
                                }}>
                                    Bestseller
                                </span>
                            )}
                            {item.is_recommended && (
                                <span style={{
                                    padding: "2px 8px",
                                    backgroundColor: "var(--bg-secondary)",
                                    color: "var(--text-secondary)",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    borderRadius: "4px",
                                }}>
                                    Recommended
                                </span>
                            )}
                            {item.is_new && (
                                <span style={{
                                    padding: "2px 8px",
                                    backgroundColor: "var(--bg-secondary)",
                                    color: "var(--text-secondary)",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    borderRadius: "4px",
                                }}>
                                    New
                                </span>
                            )}
                            {item.is_popular && (
                                <span style={{
                                    padding: "2px 8px",
                                    backgroundColor: "var(--bg-secondary)",
                                    color: "var(--text-secondary)",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    borderRadius: "4px",
                                }}>
                                    Popular
                                </span>
                            )}
                        </div>
                    )}
                    <h3 className={styles.title}>
                        {item.name}
                    </h3>
                    <p className={styles.desc}>
                        {item.description}
                    </p>
                </div>

                {/* 3. Right Section: Price & Add Button */}
                <div className={styles.actionColumn}>
                    <span className={styles.price}>{priceLabel}</span>

                    {cartQtyForItem === 0 ? (
                        <motion.button
                            whileTap={{ scale: 0.92 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAdd();
                            }}
                            className={styles.addButton}
                            aria-label={`Add ${item.name} to cart`}
                        >
                            + Add
                        </motion.button>
                    ) : (
                        <div className={styles.qty}>
                            <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const firstLine = useCartStore.getState().cartItems.find((c) => c.itemId === item.id);
                                    if (firstLine) decreaseQty(firstLine.id);
                                }}
                                className={styles.qtyBtn}
                                aria-label="Decrease quantity"
                            >
                                <FontAwesomeIcon icon={faMinus} width={10} height={10} />
                            </motion.button>
                            <span className={styles.qtyVal}>{cartQtyForItem}</span>
                            <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenPreview();
                                }}
                                className={styles.qtyBtn}
                                aria-label="Add more"
                            >
                                <FontAwesomeIcon icon={faPlus} width={10} height={10} />
                            </motion.button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
