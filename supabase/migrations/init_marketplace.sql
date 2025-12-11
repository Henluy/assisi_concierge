-- Create experiences table
CREATE TABLE IF NOT EXISTS experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL, -- Price in EUR
    duration_min INTEGER,
    category TEXT CHECK (category IN ('food', 'art', 'tour', 'religion')),
    image_url TEXT,
    merchant_id UUID REFERENCES merchants(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone
CREATE POLICY "Public experiences are viewable by everyone" 
ON experiences FOR SELECT 
USING (true);

-- Allow write access only to service role (admin) for now
-- (In a real app, authenticated merchants would manage their own experiences)

-- Seed some initial data
INSERT INTO experiences (title, description, price, duration_min, category, merchant_id, image_url)
VALUES 
    ('Dégustation de Vins Ombriens', 'Découvrez les saveurs du Sagrantino et du Grechetto avec un sommelier expert.', 35.00, 90, 'food', (SELECT id FROM merchants LIMIT 1), 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3'),
    ('Atelier Mosaïque Médiévale', 'Apprenez les techniques ancestrales des maîtres mosaïstes d''Assise.', 50.00, 120, 'art', (SELECT id FROM merchants LIMIT 1), 'https://images.unsplash.com/photo-1596435017124-e1d52184ae66'),
    ('Visite Guidée "Assise Secrète"', 'Explorez les ruelles cachées et les légendes oubliées de la cité.', 20.00, 60, 'tour', (SELECT id FROM merchants LIMIT 1), 'https://images.unsplash.com/photo-1620329383670-cc3335db4386');
