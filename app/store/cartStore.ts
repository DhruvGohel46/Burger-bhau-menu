"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
    id: string;
    itemId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    variantLabel?: string;
    extras?: { id: string; name: string; price: number }[];
};

export function buildCartLineId({
    itemId,
    variantId,
    extras,
}: {
    itemId: string;
    variantId?: string;
    extras?: string[];
}) {
    const safeVariant = variantId ?? "single";
    const safeExtras = (extras ?? []).slice().sort().join(",");
    return `${itemId}::${safeVariant}::${safeExtras}`;
}

type CartState = {
    cartItems: CartItem[];
    isCartOpen: boolean;
    isOrderSummaryOpen: boolean;

    addItem: (item: Omit<CartItem, "quantity">) => void;
    removeItem: (lineId: string) => void;
    increaseQty: (lineId: string) => void;
    decreaseQty: (lineId: string) => void;
    clearCart: () => void;

    setIsCartOpen: (isOpen: boolean) => void;
    setIsOrderSummaryOpen: (isOpen: boolean) => void;
};

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cartItems: [],
            isCartOpen: false,
            isOrderSummaryOpen: false,

            addItem: (item) => {
                set((state) => {
                    const existing = state.cartItems.find((c) => c.id === item.id);
                    if (existing) {
                        return {
                            cartItems: state.cartItems.map((c) =>
                                c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
                            ),
                        };
                    }

                    return {
                        cartItems: [...state.cartItems, { ...item, quantity: 1 }],
                    };
                });
            },

            removeItem: (lineId) => {
                set((state) => ({ cartItems: state.cartItems.filter((c) => c.id !== lineId) }));
            },

            increaseQty: (lineId) => {
                set((state) => ({
                    cartItems: state.cartItems.map((c) =>
                        c.id === lineId ? { ...c, quantity: c.quantity + 1 } : c
                    ),
                }));
            },

            decreaseQty: (lineId) => {
                const { cartItems } = get();
                const existing = cartItems.find((c) => c.id === lineId);
                if (!existing) return;

                if (existing.quantity <= 1) {
                    set((state) => ({ cartItems: state.cartItems.filter((c) => c.id !== lineId) }));
                    return;
                }

                set((state) => ({
                    cartItems: state.cartItems.map((c) =>
                        c.id === lineId ? { ...c, quantity: c.quantity - 1 } : c
                    ),
                }));
            },

            clearCart: () => {
                set({ cartItems: [], isCartOpen: false, isOrderSummaryOpen: false });
            },

            setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
            setIsOrderSummaryOpen: (isOpen) => set({ isOrderSummaryOpen: isOpen }),
        }),
        {
            name: "burgerBhauCart",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ cartItems: state.cartItems }),
        }
    )
);

export const selectCartCount = (state: CartState) =>
    state.cartItems.reduce((count, item) => count + item.quantity, 0);

export const selectCartTotal = (state: CartState) =>
    state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
