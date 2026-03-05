"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MenuItem, extras as globalExtras } from "@/app/data/menu";
import { buildCartLineId, useCartStore } from "@/app/store/cartStore";
import styles from "./MenuCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useMemo, useState } from "react";
import ItemModal, { type ItemModalSelection } from "./ItemModal";

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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selection, setSelection] = useState<ItemModalSelection>({
        variantId: item.variants?.[0]?.id,
        extras: [],
    });

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
            setIsModalOpen(true);
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

    const handleModalConfirm = () => {
        const selectedVariant = item.variants?.find((v) => v.id === selection.variantId);
        const basePrice = selectedVariant?.price ?? item.price ?? 0;
        const selectedExtras = allowedExtras.filter((e) => selection.extras.includes(e.id));
        const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);

        const vLabel = selectedVariant
            ? displayVariantLabel(item.category, selectedVariant.id, selectedVariant.label)
            : undefined;

        const lineId = buildCartLineId({
            itemId: item.id,
            variantId: selectedVariant?.id,
            extras: selection.extras,
        });

        addItem({
            id: lineId,
            itemId: item.id,
            name: item.name,
            price: basePrice + extrasTotal,
            image: item.image,
            variantLabel: vLabel,
            extras: selectedExtras,
        });

        setIsModalOpen(false);
        setSelection({ variantId: item.variants?.[0]?.id, extras: [] });
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                whileTap={{ scale: 0.98 }}
                className={styles.card}
            >
                {/* Food Image */}
                <div className={styles.imageWrap}>
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className={""}
                        sizes="90px"
                        loading="lazy"
                    />
                </div>

                {/* Info */}
                <div className={styles.info}>
                    <div>
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
                                onClick={handleAdd}
                                className={styles.addButton}
                                aria-label={`Add ${item.name} to cart`}
                            >
                                + Add
                            </motion.button>
                        ) : (
                            <div className={styles.qty}>
                                <motion.button
                                    whileTap={{ scale: 0.85 }}
                                    onClick={() => setIsModalOpen(true)}
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
                                    onClick={() => {
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

            <ItemModal
                open={isModalOpen}
                item={item}
                availableExtras={allowedExtras}
                selection={selection}
                onChange={setSelection}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleModalConfirm}
            />
        </>
    );
}
