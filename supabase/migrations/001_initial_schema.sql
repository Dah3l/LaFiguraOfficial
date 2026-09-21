-- ============================================================
-- La Figura - Database Schema (Supabase / PostgreSQL)
-- ============================================================

-- 1. BUSINESS INFO
CREATE TABLE IF NOT EXISTS business_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'La Figura',
  address TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  whatsapp TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  schedule TEXT DEFAULT '',
  logo_url TEXT,
  instagram TEXT DEFAULT '',
  facebook TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  emoji TEXT NOT NULL DEFAULT '✨',
  description TEXT DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_active ON categories(active);
CREATE INDEX idx_categories_order ON categories("order");

-- 3. SERVICES
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price INTEGER NOT NULL DEFAULT 0,
  duration INTEGER NOT NULL DEFAULT 30,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  image_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_services_active ON services(active);
CREATE INDEX idx_services_category ON services(category_id);
CREATE INDEX idx_services_order ON services("order");

-- 4. APPOINTMENTS
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  notes TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_service ON appointments(service_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE business_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Business Info: public read, admin write
CREATE POLICY "Public read business info" ON business_info
  FOR SELECT USING (true);

CREATE POLICY "Admin write business info" ON business_info
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Categories: public read active, admin CRUD
CREATE POLICY "Public read active categories" ON categories
  FOR SELECT USING (active = true);

CREATE POLICY "Admin all categories" ON categories
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Services: public read active, admin CRUD
CREATE POLICY "Public read active services" ON services
  FOR SELECT USING (active = true);

CREATE POLICY "Admin all services" ON services
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Appointments: admin full access
CREATE POLICY "Admin all appointments" ON appointments
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO business_info (name, address, phone, whatsapp, description, schedule, instagram, facebook)
VALUES (
  'La Figura',
  'Alamar, La Habana, Cuba',
  '+53 5000 0000',
  '5350000000',
  'Tu espacio de belleza y estilo. Peluquería, barbería y estética profesional con los mejores productos y las últimas tendencias.',
  'Lunes a Sábado: 9:00 AM - 7:00 PM',
  '@lafigura.alamar',
  'La Figura Alamar'
) ON CONFLICT DO NOTHING;

-- Categories
INSERT INTO categories (id, name, slug, emoji, description, active, "order") VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Barbería', 'barberia', '💈', 'Cortes, barba y estilos masculinos', true, 0),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Peluquería', 'peluqueria', '💇', 'Cortes, tintes y tratamientos capilares', true, 1),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Estética', 'estetica', '✨', 'Facial, manicure y cuidado personal', true, 2)
ON CONFLICT DO NOTHING;

-- Services
INSERT INTO services (name, description, price, duration, category_id, active) VALUES
  ('Corte Clásico', 'Corte de cabello tradicional con tijera y máquina. Incluye lavado y peinado final.', 300, 30, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', true),
  ('Corte + Diseño', 'Corte personalizado con diseño artístico. Incluye consulta de estilo.', 500, 45, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', true),
  ('Barba Completa', 'Perfilado, afeitado con navaja y aplicación de aceites esenciales.', 200, 25, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', true),
  ('Tinte Global', 'Coloración completa del cabello con productos de alta calidad.', 800, 90, 'b2c3d4e5-f6a7-8901-bcde-f12345678901', true),
  ('Peinado Especial', 'Peinado para eventos especiales: bodas, quinceañeras, graduaciones.', 600, 60, 'b2c3d4e5-f6a7-8901-bcde-f12345678901', true),
  ('Tratamiento Capilar', 'Hidratación profunda, reconstrucción y nutrición del cabello.', 450, 45, 'b2c3d4e5-f6a7-8901-bcde-f12345678901', true),
  ('Limpieza Facial', 'Limpieza profunda con extracción, tónico y mascarilla hidratante.', 500, 50, 'c3d4e5f6-a7b8-9012-cdef-123456789012', true),
  ('Manicure + Pedicure', 'Cuidado completo de manos y pies. Incluye esmaltado.', 400, 60, 'c3d4e5f6-a7b8-9012-cdef-123456789012', true)
ON CONFLICT DO NOTHING;
