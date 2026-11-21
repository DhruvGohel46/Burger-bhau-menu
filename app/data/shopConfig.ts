// Burger Bhau MenuSite — Shop configuration
// Core values come from storeConfig.ts (the single file you edit).
// This file re-exports them for backward compatibility and adds business logic.
import { STORE } from "./storeConfig";
import type { CartItem } from "@/app/store/cartStore";

// ─── Shop Details (from storeConfig.ts) ─────────────────
export const SHOP_PHONE = STORE.phone;
export const SHOP_NAME = `${STORE.name} (${STORE.branch})`;
export const SHOP_TAGLINE = STORE.tagline;
export const WEBSITE_URL = STORE.websiteUrl;

// ─── Shop Location ──────────────────────────────────────
export const SHOP_LAT = STORE.coordinates.lat;
export const SHOP_LNG = STORE.coordinates.lng;

// ─── Delivery Policy ────────────────────────────────────
export const DELIVERY_RADIUS_METERS = 400;
export const MIN_ORDER_FOR_DELIVERY = 500;
export const DELIVERY_RADIUS_NEAR = 100;
export const MIN_ORDER_NEAR = 299;

// ─── Google Maps Embed ──────────────────────────────────
export const GOOGLE_MAPS_EMBED_URL = STORE.mapsEmbedUrl;

// ─── Haversine Distance (meters) ────────────────────────
export function getHaversineDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    const R = 6371000; // Earth radius in meters
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── WhatsApp Message Builder ───────────────────────────
export function buildWhatsAppMessage(
    cartItems: CartItem[],
    cartTotal: number,
    customerName?: string,
    customerAddress?: string,
    customerPhone?: string
): string {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    const itemLines = cartItems.map((item) => {
        const line = `• *${item.quantity}x* ${item.name}`;
        const sub = item.variantLabel ? ` _(${item.variantLabel})_ ` : "";
        const price = ` ... *₹${item.price * item.quantity}*`;
        return `${line}${sub}${price}`;
    });

    let msg = `━━━━━━━━━━━━━━━\n`;
    msg += `      🍔 *NEW ORDER*      \n`;
    msg += `━━━━━━━━━━━━━━━\n\n`;
    
    msg += `🏢 *${SHOP_NAME.toUpperCase()}*\n`;
    msg += `📅 *Date:* ${dateStr}\n`;
    msg += `⏰ *Time:* ${timeStr}\n\n`;

    msg += `📜 *ORDER SUMMARY:*\n`;
    msg += `──────────────────\n`;
    msg += `${itemLines.join("\n")}\n`;
    msg += `──────────────────\n`;
    msg += `💰 *TOTAL AMOUNT: ₹${cartTotal}*\n\n`;
    
    msg += `👤 *CUSTOMER DETAILS:*\n`;
    msg += `──────────────────\n`;
    if (customerName) msg += `👤 *Name:* ${customerName}\n`;
    if (customerPhone) msg += `📱 *Phone:* ${customerPhone}\n`;
    if (customerAddress) msg += `📍 *Address:* ${customerAddress}\n`;
    
    msg += `\n──────────────────\n`;
    msg += `🚀 *Please confirm my order. Thank you!*`;
    
    return msg;
}

export function buildWhatsAppUrl(
    cartItems: CartItem[],
    cartTotal: number,
    customerName?: string,
    customerAddress?: string,
    customerPhone?: string,
    whatsappNumber?: string
): string {
    const targetNum = (whatsappNumber || SHOP_PHONE).replace(/[^0-9]/g, "");
    if (cartItems.length === 0) {
        return `https://wa.me/${targetNum}?text=${encodeURIComponent(`Hello ${SHOP_NAME}!`)}`;
    }
    const message = buildWhatsAppMessage(cartItems, cartTotal, customerName, customerAddress, customerPhone);
    return `https://wa.me/${targetNum}?text=${encodeURIComponent(message)}`;
}

export function buildCallUrl(phoneNumber?: string): string {
    const targetNum = (phoneNumber || SHOP_PHONE).replace(/[^0-9]/g, "");
    return `tel:+${targetNum}`;
}
