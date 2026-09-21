-- ============================================
-- SOLUCIÓN DEFINITIVA: Deshabilitar RLS completamente
-- ============================================
-- Copia y pega TODO esto en el SQL Editor de Supabase y ejecuta

-- 1. Deshabilitar RLS en todas las tablas
ALTER TABLE business_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;

-- 2. Eliminar TODAS las políticas existentes
DROP POLICY IF EXISTS "Public read business info" ON business_info;
DROP POLICY IF EXISTS "Admin write business info" ON business_info;
DROP POLICY IF EXISTS "Public read active categories" ON categories;
DROP POLICY IF EXISTS "Admin all categories" ON categories;
DROP POLICY IF EXISTS "Public read active services" ON services;
DROP POLICY IF EXISTS "Admin all services" ON services;
DROP POLICY IF EXISTS "Admin all appointments" ON appointments;
DROP POLICY IF EXISTS "Admin read appointments" ON appointments;
DROP POLICY IF EXISTS "Admin write categories" ON categories;
DROP POLICY IF EXISTS "Admin write services" ON services;
DROP POLICY IF EXISTS "Admin write appointments" ON appointments;

-- 3. Verificar que se deshabilitó correctamente
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('business_info', 'categories', 'services', 'appointments');

-- Deberías ver rowsecurity = false para todas las tablas
