-- Migration: Add special_hours JSONB column to shop_settings
-- Allows store admin to configure extended late-night hours or festival hours

ALTER TABLE public.shop_settings
    ADD COLUMN IF NOT EXISTS special_hours JSONB DEFAULT NULL;

COMMENT ON COLUMN public.shop_settings.special_hours IS 'Stores active special operating hours overrides (date, open_time, close_time, label, enabled)';
