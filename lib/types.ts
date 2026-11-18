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

export type SpecialHoursConfig = {
    enabled: boolean;
    date: string; // "YYYY-MM-DD" in Asia/Kolkata (e.g. "2026-11-18")
    close_time: string; // "02:00" in 24-hr format (e.g. 02:00 = 2:00 AM next morning)
    open_time?: string; // defaults to regular "11:00"
    label?: string; // e.g. "Special Late Night" or "Festival Night"
};

export type ShopSettings = {
    id: number;
    shop_name: string;
    restaurant_name?: string;
    logo_url?: string;
    banner_url?: string;
    hero_image_url?: string;
    highlighted_items?: string[];
    special_hours?: SpecialHoursConfig | SpecialHoursConfig[] | null;
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

export type GalleryCategory = "food" | "shop" | "interior" | "event";

export type GoogleReviewItem = {
    id: string;
    reviewer_name: string;
    reviewer_photo_url?: string;
    rating: number; // 4 or 5
    text: string;
    relative_time_description?: string;
    create_time: string;
    review_url?: string;
};

export type GoogleReviewsData = {
    average_rating: number;
    total_reviews: number;
    last_fetched: string;
    is_placeholder?: boolean;
    note?: string;
    reviews: GoogleReviewItem[];
};

export type GalleryImage = {
    id: string;
    storage_path?: string;
    public_url: string;
    category: GalleryCategory;
    title: string;
    alt_text: string;
    caption?: string;
    display_order: number;
    is_featured: boolean;
    created_at?: string;
};
