-- ============================================
-- Agregar campo 'order' a la tabla services
-- ============================================
-- Ejecuta esto en el SQL Editor de Supabase

-- Agregar columna order con valor por defecto
ALTER TABLE services ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 0;

-- Crear índice para ordenamiento
CREATE INDEX IF NOT EXISTS idx_services_order ON services("order");

-- Actualizar órdenes existentes basados en el orden de inserción
UPDATE services SET "order" = 0 WHERE name = 'Corte Clásico';
UPDATE services SET "order" = 1 WHERE name = 'Corte + Diseño';
UPDATE services SET "order" = 2 WHERE name = 'Barba Completa';
UPDATE services SET "order" = 0 WHERE name = 'Tinte Global';
UPDATE services SET "order" = 1 WHERE name = 'Peinado Especial';
UPDATE services SET "order" = 2 WHERE name = 'Tratamiento Capilar';
UPDATE services SET "order" = 0 WHERE name = 'Limpieza Facial';
UPDATE services SET "order" = 1 WHERE name = 'Manicure + Pedicure';
