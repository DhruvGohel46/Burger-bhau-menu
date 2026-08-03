"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { MenuItem, extras as globalExtras } from "@/app/data/menu";
import { buildCartLineId, useCartStore } from "@/app/store/cartStore";
import styles from "./MenuCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faFire, faThumbsUp, faRibbon, faStar } from "@fortawesome/free-solid-svg-icons";
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

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" }
    },
};

export default function MenuCard({ item }: { item: MenuItem }) {
    const cartQtyForItem = useCartStore(
        (s) => s.cartItems.filter((c) => c.itemId === item.id).reduce((sum, c) => sum + c.quantity, 0)
    );
    const addItem = useCartStore((s) => s.addItem);
    const decreaseQty = useCartStore((s) => s.decreaseQty);
    const setPreviewItem = useCartStore((s) => s.setPreviewItem);

    const hasVariants = (item.variants?.length ?? 0) > 0;

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
            image: item.image,
        });
    };

    const handleOpenPreview = () => {
        setPreviewItem(item);
    };

    return (
        <>
            <motion.div
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                className={styles.card}
                role="button"
                tabIndex={0}
                onClick={handleOpenPreview}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleOpenPreview();
                }}
            >
                {/* Food Image */}
                <div className={styles.imageWrap}>
                    <Image
                        src={item.image}
                        alt={`${item.name} - Burger Bhau Kothariya`}
                        fill
                        className={""}
                        sizes="90px"
                        loading="lazy"
                    />
                </div>

                {/* Info */}
                <div className={styles.info}>
                    <div>
                        {(item.is_bestseller || item.is_recommended || item.is_new || item.is_popular) && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "6px" }}>
                                {item.is_bestseller && (
                                    <span style={{
                                        padding: "3px 8px",
                                        backgroundColor: "rgba(255, 140, 0, 0.15)",
                                        border: "1px solid #ff8c00",
                                        color: "#ff8c00",
                                        fontSize: "10px",
                                        fontWeight: "800",
                                        borderRadius: "6px",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.04em",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "5px",
                                    }}>
                                        <FontAwesomeIcon icon={faFire} style={{ fontSize: "10px" }} />
                                        Bestseller
                                    </span>
                                )}
                                {item.is_recommended && (
                                    <span style={{
                                        padding: "3px 8px",
                                        backgroundColor: "rgba(23, 162, 184, 0.15)",
                                        border: "1px solid #17a2b8",
                                        color: "#38d39f",
                                        fontSize: "10px",
                                        fontWeight: "800",
                                        borderRadius: "6px",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.04em",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "5px",
                                    }}>
                                        <FontAwesomeIcon icon={faThumbsUp} style={{ fontSize: "10px" }} />
                                        Recommended
                                    </span>
                                )}
                                {item.is_new && (
                                    <span style={{
                                        padding: "3px 8px",
                                        backgroundColor: "rgba(40, 167, 69, 0.15)",
                                        border: "1px solid #28a745",
                                        color: "#5dd579",
                                        fontSize: "10px",
                                        fontWeight: "800",
                                        borderRadius: "6px",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.04em",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "5px",
                                    }}>
                                        <FontAwesomeIcon icon={faRibbon} style={{ fontSize: "10px" }} />
                                        New
                                    </span>
                                )}
                                {item.is_popular && (
                                    <span style={{
                                        padding: "3px 8px",
                                        backgroundColor: "rgba(255, 193, 7, 0.15)",
                                        border: "1px solid #ffc107",
                                        color: "#ffd54f",
                                        fontSize: "10px",
                                        fontWeight: "800",
                                        borderRadius: "6px",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.04em",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "5px",
                                    }}>
                                        <FontAwesomeIcon icon={faStar} style={{ fontSize: "10px" }} />
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

                    <div className={styles.row}>
                        <span className={styles.price}>
                            {priceLabel}
                        </span>

                        {cartQtyForItem === 0 ? (
                            <motion.button
                                whileTap={{ scale: 0.85 }}
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
                                        handleOpenPreview();
                                    }}
                                    className={styles.qtyBtn}
                                    aria-label="Add with options"
                                >
                                    <FontAwesomeIcon icon={faPlus} width={14} height={14} />
                                </motion.button>
                                <span className={styles.qtyVal}>
                                    {cartQtyForItem}
                                </span>
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
                                    <FontAwesomeIcon icon={faMinus} width={14} height={14} />
                                </motion.button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </>
    );
}
