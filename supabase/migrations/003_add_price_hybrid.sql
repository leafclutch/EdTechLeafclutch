-- Add hybrid pricing to courses (Training & Internship programs)
ALTER TABLE courses ADD COLUMN IF NOT EXISTS price_hybrid NUMERIC DEFAULT NULL;
