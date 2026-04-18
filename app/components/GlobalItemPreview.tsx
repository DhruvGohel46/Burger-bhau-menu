"use client";

import { useState, useEffect } from "react";
import { useCartStore, buildCartLineId } from "@/app/store/cartStore";
import { extras as globalExtras } from "@/app/data/menu";
import ItemPreviewModal, { type ItemPreviewSelection } from "./ItemPreviewModal";

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

export default function GlobalItemPreview() {
    const previewItem = useCartStore((s) => s.previewItem);
    const setPreviewItem = useCartStore((s) => s.setPreviewItem);
    const addItem = useCartStore((s) => s.addItem);

    const [selection, setSelection] = useState<ItemPreviewSelection>({
        variantId: undefined,
        extras: [],
    });

    // Reset selection when the preview item changes
    useEffect(() => {
        if (previewItem) {
            setSelection({
                variantId: previewItem.variants?.[0]?.id,
                extras: [],
            });
        }
    }, [previewItem]);

    if (!previewItem) return null;

    const isExtrasAllowed = 
        previewItem.category.toLowerCase() === "burger" || 
        previewItem.category.toLowerCase() === "sandwich";
    const allowedExtras = isExtrasAllowed ? globalExtras : [];

    const handleConfirm = () => {
        const selectedVariant = previewItem.variants?.find((v) => v.id === selection.variantId);
        const basePrice = selectedVariant?.price ?? previewItem.price ?? 0;
        const selectedExtras = allowedExtras.filter((e) => selection.extras.includes(e.id));
        const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);

        const vLabel = selectedVariant
            ? displayVariantLabel(previewItem.category, selectedVariant.id, selectedVariant.label)
            : undefined;

        const lineId = buildCartLineId({
            itemId: previewItem.id,
            variantId: selectedVariant?.id,
            extras: selection.extras,
        });

        addItem({
            id: lineId,
            itemId: previewItem.id,
            name: previewItem.name,
            price: basePrice + extrasTotal,
            image: previewItem.image,
            variantLabel: vLabel,
            extras: selectedExtras,
        });

        setPreviewItem(null);
    };

    return (
        <ItemPreviewModal
            open={!!previewItem}
            item={previewItem}
            availableExtras={allowedExtras}
            selection={selection}
            onChange={setSelection}
            onClose={() => setPreviewItem(null)}
            onConfirm={handleConfirm}
        />
    );
}
