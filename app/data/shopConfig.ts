import { CartItem } from "@/app/store/cartStore";

// ─── Shop Details ───────────────────────────────────────
export const SHOP_PHONE = "919998872339"; // Prefix with 91 for India if needed for WhatsApp, but user gave 10 digits. Assuming 91 prefix for WhatsApp.
export const SHOP_NAME = "Burger Bhau";
export const SHOP_TAGLINE = "Premium Street Food";
export const WEBSITE_URL = "https://burger-bhau-menu.netlify.app";

// ─── Shop Location (from Google Maps embed) ─────────────
export const SHOP_LAT = 22.245888;
export const SHOP_LNG = 70.798263;

// ─── Delivery Policy ────────────────────────────────────
export const DELIVERY_RADIUS_METERS = 400;
export const MIN_ORDER_FOR_DELIVERY = 500;

// ─── Google Maps Embed ──────────────────────────────────
export const GOOGLE_MAPS_EMBED_URL =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12244.891247087276!2d70.79826304398604!3d22.245888415627523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959b530de7af957%3A0x13afca3988e94f96!2sBurger%20Bhau!5e1!3m2!1sen!2sin!4v1774524524083!5m2!1sen!2sin";

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
    customerAddress?: string
): string {
    const lines = cartItems.map(
        (item) =>
            `• ${item.quantity}x ${item.name}${item.variantLabel ? ` (${item.variantLabel})` : ""}${item.extras && item.extras.length > 0 ? ` + ${item.extras.map((e) => e.name).join(", ")}` : ""}`
    );

    let msg = `Hello ${SHOP_NAME},\nI want to order the following items:\n\n${lines.join("\n")}\n\nTotal: ₹${cartTotal}`;

    if (customerName) msg += `\nName: ${customerName}`;
    if (customerAddress) msg += `\nAddress: ${customerAddress}`;
    msg += `\n\nPlease confirm the order.`;
    return msg;
}

export function buildWhatsAppUrl(
    cartItems: CartItem[],
    cartTotal: number,
    customerName?: string,
    customerAddress?: string
): string {
    if (cartItems.length === 0) {
        return `https://wa.me/${SHOP_PHONE}?text=${encodeURIComponent(`Hello ${SHOP_NAME}!`)}`;
    }
    const message = buildWhatsAppMessage(cartItems, cartTotal, customerName, customerAddress);
    return `https://wa.me/${SHOP_PHONE}?text=${encodeURIComponent(message)}`;
}

export function buildCallUrl(): string {
    return `tel:+${SHOP_PHONE}`;
}
