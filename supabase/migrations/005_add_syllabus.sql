-- Add syllabus PDF URL to courses
ALTER TABLE courses ADD COLUMN IF NOT EXISTS syllabus_url TEXT DEFAULT NULL;

-- Create public storage bucket for syllabi
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('syllabi', 'syllabi', true, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Allow public read on syllabi bucket
DROP POLICY IF EXISTS "Public read syllabi" ON storage.objects;
CREATE POLICY "Public read syllabi" ON storage.objects
  FOR SELECT USING (bucket_id = 'syllabi');

-- Allow anyone to upload (admin uses anon key in browser)
DROP POLICY IF EXISTS "Auth upload syllabi" ON storage.objects;
CREATE POLICY "Auth upload syllabi" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'syllabi');

DROP POLICY IF EXISTS "Auth update syllabi" ON storage.objects;
CREATE POLICY "Auth update syllabi" ON storage.objects
  FOR UPDATE USING (bucket_id = 'syllabi');

DROP POLICY IF EXISTS "Auth delete syllabi" ON storage.objects;
CREATE POLICY "Auth delete syllabi" ON storage.objects
  FOR DELETE USING (bucket_id = 'syllabi');
