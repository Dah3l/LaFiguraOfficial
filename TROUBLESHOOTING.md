# 🔧 Troubleshooting: La app no guarda en Supabase

## ✅ PASO 1: Deshabilitar RLS (OBLIGATORIO)

Ve al **SQL Editor** de Supabase y ejecuta EXACTAMENTE esto:

```sql
-- Deshabilitar RLS en todas las tablas
ALTER TABLE business_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;

-- Eliminar todas las políticas existentes
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

-- Verificar que se deshabilitó
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('business_info', 'categories', 'services', 'appointments');
```

Deberías ver `rls_enabled = false` para todas las tablas.

## 🔍 PASO 2: Verificar en la consola del navegador

1. Abre la app en el navegador
2. Presiona **F12** para abrir las herramientas de desarrollador
3. Ve a la pestaña **Console**
4. Recarga la página (Ctrl+R o Cmd+R)

Deberías ver mensajes como:
```
Loading data from Supabase...
Supabase is configured, fetching data...
Fetching business info from Supabase...
Business info loaded: {...}
Fetching categories from Supabase...
Categories loaded: [...]
Fetching services from Supabase...
Services loaded: [...]
Data loaded successfully
```

Si ves errores, cópialos y envíamelos.

## 🧪 PASO 3: Probar guardar cambios

1. Ve al panel de admin (contraseña: `admin123`)
2. Ve a la pestaña **Negocio**
3. Cambia el nombre a "La Figura Test"
4. Click en **Guardar Cambios**
5. Abre la consola del navegador (F12)

Deberías ver:
```
Updating business info: {...}
Business info updated: [...]
```

6. Ve al **Table Editor** de Supabase
7. Abre la tabla `business_info`
8. Deberías ver el nombre actualizado

## ❌ Si NO funciona

Envíame:
1. Captura de pantalla de la consola del navegador (F12 → Console)
2. Captura de pantalla del resultado del SQL del Paso 1
3. ¿Qué error específico ves en la consola?

## 💡 Posibles causas

### 1. RLS sigue activo
Si el SQL del Paso 1 no se ejecutó correctamente, RLS sigue bloqueando las escrituras.

### 2. Variables de entorno incorrectas
Verifica que `.env` tenga:
```
VITE_SUPABASE_URL=https://smdjkvlxaldariibdyzq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Tablas vacías
Si las tablas están vacías, la app usa datos por defecto. Ejecuta el seed:
```sql
INSERT INTO business_info (id, name, address, phone, whatsapp, description, schedule, instagram, facebook)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'La Figura',
  'Alamar, La Habana, Cuba',
  '+53 5000 0000',
  '5350000000',
  'Tu espacio de belleza y estilo',
  'Lunes a Sábado: 9:00 AM - 7:00 PM',
  '@lafigura.alamar',
  'La Figura Alamar'
);
```

### 4. CORS o red
Si ves errores de CORS o red, verifica que el Project URL sea correcto.
