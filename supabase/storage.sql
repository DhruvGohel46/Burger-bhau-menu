-- ========================================================
-- BURGER BHAU SUPABASE STORAGE BUCKET & RLS POLICIES
-- ========================================================

-- 1. Create the public storage bucket 'burger-bhau-assets'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'burger-bhau-assets',
  'burger-bhau-assets',
  true,
  10485760, -- 10 MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;


-- 2. Drop existing policies if any to prevent duplicate errors
DROP POLICY IF EXISTS "Public Read Access for Assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload Access for Assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update Access for Assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete Access for Assets" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Access for Assets" ON storage.objects;


-- 3. Policy: Anyone can view public files in 'burger-bhau-assets'
CREATE POLICY "Public Read Access for Assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'burger-bhau-assets');


-- 4. Policy: Authenticated users can upload files into 'burger-bhau-assets'
CREATE POLICY "Authenticated Upload Access for Assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'burger-bhau-assets');


-- 5. Policy: Authenticated users can update files in 'burger-bhau-assets'
CREATE POLICY "Authenticated Update Access for Assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'burger-bhau-assets');


-- 6. Policy: Authenticated users can delete files in 'burger-bhau-assets'
CREATE POLICY "Authenticated Delete Access for Assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'burger-bhau-assets');


-- 7. Policy (Optional fallback): Allow anon/public uploads if admin is uploading without auth headers
CREATE POLICY "Public Upload Access for Assets"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'burger-bhau-assets');
