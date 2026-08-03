-- =========================================================
-- Burger Bhau - Photo Gallery Supabase Database Migration
-- Execute this SQL script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new
-- =========================================================

-- 1. Create public.gallery_images table
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    storage_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('shop', 'food', 'interior', 'event')),
    title TEXT NOT NULL,
    alt_text TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create index on (category, display_order) for fast ordered queries
CREATE INDEX IF NOT EXISTS idx_gallery_cat_order ON public.gallery_images (category, display_order);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- 4. Allow public read access to gallery_images table
CREATE POLICY "Public read gallery_images" ON public.gallery_images
    FOR SELECT USING (true);

-- 5. Allow full access to authenticated admin
CREATE POLICY "Admin full access gallery_images" ON public.gallery_images
    FOR ALL USING (auth.role() = 'authenticated');

-- =========================================================
-- 6. Supabase Storage Bucket Setup ("burger-bhau-assets")
-- If not already created, create a public storage bucket named "burger-bhau-assets"
-- =========================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('burger-bhau-assets', 'burger-bhau-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public access to storage assets
CREATE POLICY "Public Read Assets" ON storage.objects
    FOR SELECT USING (bucket_id = 'burger-bhau-assets');

-- Policy to allow authenticated admin uploads
CREATE POLICY "Admin Insert Assets" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'burger-bhau-assets');

