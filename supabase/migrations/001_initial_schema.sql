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
  email TEXT DEFAULT '',
  description TEXT DEFAULT '',
  schedule TEXT DEFAULT '',
  logo_url TEXT,
  instagram TEXT DEFAULT '',
  facebook TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SERVICES
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price INTEGER NOT NULL DEFAULT 0,
  duration INTEGER NOT NULL DEFAULT 30,
  category TEXT NOT NULL CHECK (category IN ('peluqueria', 'barberia', 'estetica')),
  image_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_services_active ON services(active);
CREATE INDEX idx_services_category ON services(category);

-- 3. APPOINTMENTS
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

-- 4. SCHEDULES
CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  open_time TIME NOT NULL DEFAULT '09:00',
  close_time TIME NOT NULL DEFAULT '19:00',
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE UNIQUE INDEX idx_schedules_day ON schedules(day_of_week);

-- 5. BLOCKED SLOTS
CREATE TABLE IF NOT EXISTS blocked_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  time TIME NOT NULL,
  reason TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_blocked_date ON blocked_slots(date);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE business_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_slots ENABLE ROW LEVEL SECURITY;

-- Business Info: public read, admin write
CREATE POLICY "Public read business info" ON business_info
  FOR SELECT USING (true);

CREATE POLICY "Admin write business info" ON business_info
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Services: public read active, admin CRUD
CREATE POLICY "Public read active services" ON services
  FOR SELECT USING (active = true);

CREATE POLICY "Admin all services" ON services
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Appointments: admin full access, users can create
CREATE POLICY "Public create appointments" ON appointments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin all appointments" ON appointments
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Schedules: public read, admin write
CREATE POLICY "Public read schedules" ON schedules
  FOR SELECT USING (true);

CREATE POLICY "Admin write schedules" ON schedules
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Blocked slots: admin only
CREATE POLICY "Admin all blocked slots" ON blocked_slots
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO business_info (name, address, phone, whatsapp, email, description, schedule, instagram, facebook)
VALUES (
  'La Figura',
  'Alamar, La Habana, Cuba',
  '+53 5000 0000',
  '5350000000',
  'lafigura@email.com',
  'Tu espacio de belleza y estilo. Peluquería, barbería y estética profesional con los mejores productos y las últimas tendencias.',
  'Lunes a Sábado: 9:00 AM - 7:00 PM',
  '@lafigura.alamar',
  'La Figura Alamar'
) ON CONFLICT DO NOTHING;

INSERT INTO services (name, description, price, duration, category, active) VALUES
  ('Corte Clásico', 'Corte de cabello tradicional con tijera y máquina. Incluye lavado y peinado final.', 300, 30, 'barberia', true),
  ('Corte + Diseño', 'Corte personalizado con diseño artístico. Incluye consulta de estilo.', 500, 45, 'barberia', true),
  ('Barba Completa', 'Perfilado, afeitado con navaja y aplicación de aceites esenciales.', 200, 25, 'barberia', true),
  ('Tinte Global', 'Coloración completa del cabello con productos de alta calidad.', 800, 90, 'peluqueria', true),
  ('Peinado Especial', 'Peinado para eventos especiales: bodas, quinceañeras, graduaciones.', 600, 60, 'peluqueria', true),
  ('Tratamiento Capilar', 'Hidratación profunda, reconstrucción y nutrición del cabello.', 450, 45, 'peluqueria', true),
  ('Limpieza Facial', 'Limpieza profunda con extracción, tónico y mascarilla hidratante.', 500, 50, 'estetica', true),
  ('Manicure + Pedicure', 'Cuidado completo de manos y pies. Incluye esmaltado.', 400, 60, 'estetica', true)
ON CONFLICT DO NOTHING;

INSERT INTO schedules (day_of_week, open_time, close_time, is_active) VALUES
  (0, '00:00', '00:00', false), -- Domingo
  (1, '09:00', '19:00', true),  -- Lunes
  (2, '09:00', '19:00', true),
  (3, '09:00', '19:00', true),
  (4, '09:00', '19:00', true),
  (5, '09:00', '19:00', true),
  (6, '09:00', '14:00', true)   -- Sábado
ON CONFLICT DO NOTHING;
