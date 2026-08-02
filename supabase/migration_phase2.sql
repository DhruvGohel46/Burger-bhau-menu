-- ========================================================
-- BURGER BHAU PHASE 2 MIGRATION SCRIPT
-- ========================================================

-- ─── 1. ENUM TYPES ──────────────────────────────────────
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'delivery_method_enum') THEN
        CREATE TYPE delivery_method_enum AS ENUM ('pickup', 'rapido', 'contact');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status_enum') THEN
        CREATE TYPE payment_status_enum AS ENUM ('Pending', 'Approved', 'Rejected');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status_enum') THEN
        CREATE TYPE order_status_enum AS ENUM (
            'Pending Payment Verification',
            'Payment Verified',
            'Accepted',
            'Preparing',
            'Ready For Pickup',
            'Delivered',
            'Cancelled'
        );
    END IF;
END $$;


-- ─── 2. EXTEND PROFILES TABLE ────────────────────────────
ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS house_flat TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS area TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS landmark TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Rajkot',
    ADD COLUMN IF NOT EXISTS pincode TEXT DEFAULT '360004',
    ADD COLUMN IF NOT EXISTS latitude NUMERIC,
    ADD COLUMN IF NOT EXISTS longitude NUMERIC,
    ADD COLUMN IF NOT EXISTS saved_addresses JSONB DEFAULT '[]'::jsonb;


-- ─── 3. EXTEND SHOP SETTINGS TABLE ───────────────────────
ALTER TABLE public.shop_settings
    ADD COLUMN IF NOT EXISTS restaurant_name TEXT DEFAULT 'Burger Bhau (Kothariya)',
    ADD COLUMN IF NOT EXISTS logo_url TEXT DEFAULT '/BURGER-BHAU-logo.webp',
    ADD COLUMN IF NOT EXISTS banner_url TEXT DEFAULT '/BURGER-BHAU-logo.webp',
    ADD COLUMN IF NOT EXISTS theme_color TEXT DEFAULT '#ff8c00',
    ADD COLUMN IF NOT EXISTS gst_number TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS upi_name TEXT DEFAULT 'Burger Bhau Fast Food',
    ADD COLUMN IF NOT EXISTS instagram_url TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS facebook_url TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS additional_phones JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS additional_whatsapps JSONB DEFAULT '[]'::jsonb;


-- ─── 4. EXTEND PRODUCTS TABLE ────────────────────────────
ALTER TABLE public.products
    ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS is_bestseller BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS is_recommended BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 4.8;


-- ─── 5. EXTEND ORDERS TABLE (ORDER NUMBERS & TIMESTAMPS) ──
ALTER TABLE public.orders
    ADD COLUMN IF NOT EXISTS order_number BIGINT GENERATED ALWAYS AS IDENTITY (START WITH 1001 INCREMENT BY 1),
    ADD COLUMN IF NOT EXISTS house_flat TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS area TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS landmark TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Rajkot',
    ADD COLUMN IF NOT EXISTS pincode TEXT DEFAULT '360004',
    ADD COLUMN IF NOT EXISTS coupon_code TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS discount_amount NUMERIC DEFAULT 0,
    ADD COLUMN IF NOT EXISTS payment_verified_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS preparing_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS ready_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;


-- ─── 6. AUDIT / ACTIVITY LOGS TABLE ──────────────────────
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read activity logs"
    ON public.activity_logs FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Admins insert activity logs"
    ON public.activity_logs FOR INSERT
    WITH CHECK (public.is_admin());

-- Realtime notification for activity logs
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_logs;
