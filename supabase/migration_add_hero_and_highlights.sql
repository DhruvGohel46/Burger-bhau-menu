-- ========================================================
-- BURGER BHAU: HERO PHOTO, HIGHLIGHTS & SPECIAL HOURS MIGRATION
-- Run this in your Supabase Project -> SQL Editor -> Run
-- ========================================================

-- 1. Add hero_image_url to public.shop_settings
ALTER TABLE public.shop_settings
    ADD COLUMN IF NOT EXISTS hero_image_url TEXT DEFAULT '/productimage/burger/burger-tandoori-tadka.jpg';

-- 2. Add highlighted_items to public.shop_settings
ALTER TABLE public.shop_settings
    ADD COLUMN IF NOT EXISTS highlighted_items JSONB DEFAULT '["burger-bhau-special", "burger-tandoori-tadka", "burger-korean", "fries-loaded", "pizza-cheese-burst", "sandwich-indori-jumbo", "garlic-cheesy-7", "burger-african-peri-peri"]'::jsonb;

-- 3. Add special_hours to public.shop_settings
ALTER TABLE public.shop_settings
    ADD COLUMN IF NOT EXISTS special_hours JSONB DEFAULT NULL;

-- 4. Ensure row 1 exists and has defaults
UPDATE public.shop_settings
SET 
    hero_image_url = COALESCE(hero_image_url, '/productimage/burger/burger-tandoori-tadka.jpg'),
    highlighted_items = COALESCE(highlighted_items, '["burger-bhau-special", "burger-tandoori-tadka", "burger-korean", "fries-loaded", "pizza-cheese-burst", "sandwich-indori-jumbo", "garlic-cheesy-7", "burger-african-peri-peri"]'::jsonb)
WHERE id = 1;

-- 5. Reload PostgREST schema cache immediately
NOTIFY pgrst, 'reload schema';
