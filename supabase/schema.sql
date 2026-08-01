-- ========================================================
-- BURGER BHAU SUPABASE DATABASE SCHEMA & RLS POLICIES
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── 1. PROFILES TABLE ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    phone TEXT,
    name TEXT,
    address TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger function to automatically create a customer profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, phone, address, role)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'name', ''),
        COALESCE(new.raw_user_meta_data->>'phone', ''),
        COALESCE(new.raw_user_meta_data->>'address', ''),
        'customer'
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = COALESCE(EXCLUDED.name, public.profiles.name),
        phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
        address = COALESCE(EXCLUDED.address, public.profiles.address);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ─── 2. SHOP SETTINGS TABLE ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.shop_settings (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    shop_name TEXT NOT NULL DEFAULT 'Burger Bhau (Kothariya)',
    shop_phone TEXT NOT NULL DEFAULT '919558941555',
    whatsapp_number TEXT NOT NULL DEFAULT '919558941555',
    address TEXT NOT NULL DEFAULT 'Rolex road, Kothariya, Rajkot',
    google_maps_url TEXT NOT NULL DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12244.891247087276!2d70.79826304398604!3d22.245888415627523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959b530de7af957%3A0x13afca3988e94f96!2sBurger%20Bhau!5e1!3m2!1sen!2sin!4v1774524524083!5m2!1sen!2sin',
    upi_id TEXT NOT NULL DEFAULT 'burgerbhau@upi',
    qr_code_url TEXT NOT NULL DEFAULT '/BURGER-BHAU-logo.webp',
    opening_hours TEXT NOT NULL DEFAULT '11:00 AM - 11:00 PM',
    delivery_radius_meters INT NOT NULL DEFAULT 400,
    min_order_for_delivery NUMERIC NOT NULL DEFAULT 500,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial shop settings if empty
INSERT INTO public.shop_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;


-- ─── 3. CATEGORIES TABLE ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ─── 4. PRODUCTS TABLE ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    image TEXT NOT NULL,
    price NUMERIC DEFAULT 0,
    variants JSONB DEFAULT '[]'::jsonb,
    extras JSONB DEFAULT '[]'::jsonb,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ─── 5. ORDERS TABLE ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    delivery_method TEXT NOT NULL CHECK (delivery_method IN ('pickup', 'rapido', 'contact')),
    payment_status TEXT NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Approved', 'Rejected')),
    status TEXT NOT NULL DEFAULT 'Pending Payment Verification' CHECK (status IN ('Pending Payment Verification', 'Accepted', 'Preparing', 'Ready For Pickup', 'Delivered', 'Cancelled')),
    utr TEXT NOT NULL,
    subtotal NUMERIC NOT NULL,
    delivery_charge NUMERIC NOT NULL DEFAULT 0,
    total NUMERIC NOT NULL,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ─── 6. ORDER ITEMS TABLE ───────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT,
    name TEXT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price NUMERIC NOT NULL,
    variant_label TEXT DEFAULT '',
    extras JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ─── 7. ROW LEVEL SECURITY (RLS) POLICIES ───────────────

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Users can view their own profile or admins can view all"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update their own profile or admins can update all"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can insert their own profile or admins can insert all"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id OR public.is_admin());

-- Public Read / Admin Write Policies (Settings, Categories, Products)
CREATE POLICY "Public read shop settings" ON public.shop_settings FOR SELECT USING (true);
CREATE POLICY "Admin write shop settings" ON public.shop_settings FOR ALL USING (public.is_admin());

CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin write categories" ON public.categories FOR ALL USING (public.is_admin());

CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admin write products" ON public.products FOR ALL USING (public.is_admin());

-- Orders Policies
CREATE POLICY "Customers view own orders or admin views all"
    ON public.orders FOR SELECT
    USING (customer_id = auth.uid() OR public.is_admin());

CREATE POLICY "Authenticated users can create orders"
    ON public.orders FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update orders"
    ON public.orders FOR UPDATE
    USING (public.is_admin());

-- Order Items Policies
CREATE POLICY "View order items if order accessible"
    ON public.order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND (orders.customer_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "Authenticated users can create order items"
    ON public.order_items FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update order items"
    ON public.order_items FOR UPDATE
    USING (public.is_admin());

-- ─── 8. ENABLE REALTIME NOTIFICATIONS ───────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
