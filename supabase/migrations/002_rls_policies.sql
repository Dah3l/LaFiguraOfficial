-- ============================================
-- POLÍTICAS RLS PARA LA FIGURA
-- ============================================
-- Ejecuta esto en el SQL Editor de Supabase
-- para asegurar que la app pueda leer los datos

-- Habilitar RLS en todas las tablas
ALTER TABLE business_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS DE LECTURA PÚBLICA
-- ============================================

-- Business Info: lectura pública
DROP POLICY IF EXISTS "Public read business info" ON business_info;
CREATE POLICY "Public read business info" ON business_info
  FOR SELECT USING (true);

-- Categories: lectura pública solo activas
DROP POLICY IF EXISTS "Public read active categories" ON categories;
CREATE POLICY "Public read active categories" ON categories
  FOR SELECT USING (active = true);

-- Services: lectura pública solo activos
DROP POLICY IF EXISTS "Public read active services" ON services;
CREATE POLICY "Public read active services" ON services
  FOR SELECT USING (active = true);

-- Appointments: solo admin puede leer
DROP POLICY IF EXISTS "Admin read appointments" ON appointments;
CREATE POLICY "Admin read appointments" ON appointments
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- POLÍTICAS DE ESCRITURA (SOLO ADMIN)
-- ============================================

-- Business Info: solo admin puede escribir
DROP POLICY IF EXISTS "Admin write business info" ON business_info;
CREATE POLICY "Admin write business info" ON business_info
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Categories: solo admin puede escribir
DROP POLICY IF EXISTS "Admin write categories" ON categories;
CREATE POLICY "Admin write categories" ON categories
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Services: solo admin puede escribir
DROP POLICY IF EXISTS "Admin write services" ON services;
CREATE POLICY "Admin write services" ON services
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Appointments: solo admin puede escribir
DROP POLICY IF EXISTS "Admin write appointments" ON appointments;
CREATE POLICY "Admin write appointments" ON appointments
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- NOTA IMPORTANTE
-- ============================================
-- Para que las operaciones de escritura funcionen,
-- necesitas autenticarte como admin en Supabase.
-- 
-- Opción 1: Deshabilitar RLS temporalmente para pruebas
-- ALTER TABLE business_info DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE services DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
--
-- Opción 2: Implementar autenticación real con Supabase Auth
-- y asignar el rol 'admin' al usuario en raw_user_meta_data
