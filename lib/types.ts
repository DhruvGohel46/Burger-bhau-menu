// Burger Bhau - Extended Production TypeScript Interfaces

export type UserRole = "customer" | "admin";

export type AddressDetail = {
    id?: string;
    label?: "Home" | "Office" | "Other";
    house_flat: string;
    area: string;
    landmark?: string;
    city: string;
    pincode: string;
    latitude?: number;
    longitude?: number;
};

export type UserProfile = {
    id: string;
    email: string;
    phone: string;
    name: string;
    address: string;
    house_flat?: string;
    area?: string;
    landmark?: string;
    city?: string;
    pincode?: string;
    latitude?: number;
    longitude?: number;
    saved_addresses?: AddressDetail[];
    role: UserRole;
    created_at?: string;
    updated_at?: string;
};

export type DeliveryMethod = "pickup" | "rapido" | "contact";

export type PaymentStatus = "Pending" | "Approved" | "Rejected";

export type OrderStatus =
    | "Pending Payment Verification"
    | "Payment Verified"
    | "Accepted"
    | "Preparing"
    | "Ready For Pickup"
    | "Delivered"
    | "Cancelled";

export type OrderItem = {
    id?: string;
    order_id?: string;
    product_id: string;
    name: string;
    quantity: number;
    price: number;
    variant_label?: string;
    extras?: { id: string; name: string; price: number }[];
};

export type Order = {
    id: string;
    order_number?: number;
    customer_id: string;
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    house_flat?: string;
    area?: string;
    landmark?: string;
    city?: string;
    pincode?: string;
    delivery_method: DeliveryMethod;
    payment_status: PaymentStatus;
    status: OrderStatus;
    utr: string;
    subtotal: number;
    delivery_charge: number;
    discount_amount?: number;
    coupon_code?: string;
    total: number;
    notes?: string;
    created_at: string;
    updated_at: string;

    // Timeline transition timestamps (delivered_at removed as requested)
    payment_verified_at?: string;
    accepted_at?: string;
    preparing_at?: string;
    ready_at?: string;
    cancelled_at?: string;

    order_items?: OrderItem[];
};

export type ActivityLog = {
    id: string;
    order_id: string;
    admin_id?: string;
    action: string;
    details?: any;
    created_at: string;
};

export type ShopSettings = {
    id: number;
    shop_name: string;
    restaurant_name?: string;
    logo_url?: string;
    banner_url?: string;
    theme_color?: string;
    gst_number?: string;
    shop_phone: string;
    whatsapp_number: string;
    additional_phones?: string[];
    additional_whatsapps?: string[];
    address: string;
    google_maps_url: string;
    upi_id: string;
    upi_name?: string;
    qr_code_url: string;
    opening_hours: string;
    delivery_radius_meters: number;
    min_order_for_delivery: number;
    instagram_url?: string;
    facebook_url?: string;
    updated_at?: string;
};
