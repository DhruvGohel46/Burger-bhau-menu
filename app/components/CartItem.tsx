"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useCartStore, type CartItem as CartItemType } from "@/app/store/cartStore";
import styles from "./CartItem.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function CartItem({ item }: { item: CartItemType }) {
    const increaseQty = useCartStore((s) => s.increaseQty);
    const decreaseQty = useCartStore((s) => s.decreaseQty);
    const removeItem = useCartStore((s) => s.removeItem);

    const optionText = [
        item.variantLabel ? `Size: ${item.variantLabel}` : null,
        item.extras && item.extras.length > 0 ? `Extras: ${item.extras.map((e) => e.name).join(", ")}` : null,
    ]
        .filter(Boolean)
        .join(" • ");

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className={styles.row}
        >
            {/* Image */}
            <div className={styles.image}>
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className={""}
                    sizes="64px"
                />
            </div>

            {/* Details */}
            <div className={styles.body}>
                <div className={styles.top}>
                    <h3 className={styles.name}>
                        {item.name}
                    </h3>
                    <button
                        onClick={() => removeItem(item.id)}
                        className={styles.remove}
                        aria-label={`Remove ${item.name}`}
                    >
                        <FontAwesomeIcon icon={faTrash} width={14} height={14} />
                    </button>
                </div>

                <div className={styles.bottom}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                        <span className={styles.price}>
                            ₹{item.price * item.quantity}
                        </span>
                        {optionText ? (
                            <span style={{ fontSize: 11, color: "var(--muted-2)", fontFamily: "var(--font-poppins, inherit)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {optionText}
                            </span>
                        ) : null}
                    </div>

                    <div className={styles.qty}>
                        <button
                            onClick={() => decreaseQty(item.id)}
                            className={styles.qtyBtn}
                            aria-label="Decrease quantity"
                        >
                            <FontAwesomeIcon icon={faMinus} width={13} height={13} />
                        </button>
                        <span className={styles.qtyVal}>
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => increaseQty(item.id)}
                            className={styles.qtyBtn}
                            aria-label="Increase quantity"
                        >
                            <FontAwesomeIcon icon={faPlus} width={13} height={13} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
