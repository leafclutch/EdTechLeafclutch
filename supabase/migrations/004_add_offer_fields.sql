-- Add offer/discount fields to courses (Training & Internship programs)
ALTER TABLE courses ADD COLUMN IF NOT EXISTS offer_label TEXT DEFAULT NULL;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS offer_deadline DATE DEFAULT NULL;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS offer_discount_percent NUMERIC DEFAULT NULL;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS offer_discount_flat NUMERIC DEFAULT NULL;

-- Add offer/discount fields to paid_internships
ALTER TABLE paid_internships ADD COLUMN IF NOT EXISTS offer_label TEXT DEFAULT NULL;
ALTER TABLE paid_internships ADD COLUMN IF NOT EXISTS offer_deadline DATE DEFAULT NULL;
ALTER TABLE paid_internships ADD COLUMN IF NOT EXISTS offer_discount_percent NUMERIC DEFAULT NULL;
ALTER TABLE paid_internships ADD COLUMN IF NOT EXISTS offer_discount_flat NUMERIC DEFAULT NULL;
