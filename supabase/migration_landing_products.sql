-- ========================================================
-- BURGER BHAU: LANDING PAGE CUSTOMIZATION MIGRATION
-- Run this in your Supabase SQL Editor to support custom
-- hero images and featured food products on the landing page.
-- ========================================================

ALTER TABLE public.shop_settings
    ADD COLUMN IF NOT EXISTS hero_image_url TEXT DEFAULT '/productimage/burger/burger-tandoori-tadka.jpg',
    ADD COLUMN IF NOT EXISTS highlighted_items JSONB DEFAULT '["burger-bhau-special", "burger-tandoori-tadka", "burger-korean", "fries-loaded", "pizza-cheese-burst", "sandwich-indori-jumbo", "garlic-cheesy-7", "burger-african-peri-peri"]'::jsonb;

-- Update row 1 if default is null
UPDATE public.shop_settings
SET 
    hero_image_url = COALESCE(hero_image_url, '/productimage/burger/burger-tandoori-tadka.jpg'),
    highlighted_items = COALESCE(highlighted_items, '["burger-bhau-special", "burger-tandoori-tadka", "burger-korean", "fries-loaded", "pizza-cheese-burst", "sandwich-indori-jumbo", "garlic-cheesy-7", "burger-african-peri-peri"]'::jsonb)
WHERE id = 1;
