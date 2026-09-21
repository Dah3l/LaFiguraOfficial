# 🚀 Guía de Deploy: Cloudflare Pages + Supabase

Guía completa para desplegar **La Figura** en producción.

---

## 📋 Resumen del proceso

1. Crear proyecto en Supabase
2. Ejecutar migraciones SQL
3. Configurar autenticación admin
4. Subir código a GitHub
5. Conectar repo con Cloudflare Pages
6. Configurar variables de entorno
7. Deploy automático

---

## 🗄️ PARTE 1: Configurar Supabase

### 1.1 Crear proyecto

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta (o inicia sesión)
2. Click en **"New Project"**
3. Rellena:
   - **Name:** `la-figura`
   - **Database Password:** (guárdala en un gestor de contraseñas)
   - **Region:** selecciona la más cercana (ej: `US East` para Cuba)
   - **Pricing Plan:** Free (suficiente para empezar)
4. Click **"Create new project"** y espera ~2 minutos

### 1.2 Obtener credenciales

Una vez creado el proyecto:

1. Ve a **Settings** (ícono de engranaje en el sidebar) → **API**
2. Copia estos dos valores:
   - **Project URL** → `https://xxxxx.supabase.co`
   - **anon public key** → `eyJhbGciOi...` (la clave larga)

### 1.3 Ejecutar migraciones SQL

1. En el sidebar, ve a **SQL Editor** (ícono `</>`)
2. Click en **"New query"**
3. Copia TODO el contenido de `supabase/migrations/001_initial_schema.sql`
4. Pégalo en el editor
5. Click en **"Run"** (o `Ctrl+Enter`)

✅ Esto crea:
- Tablas: `business_info`, `categories`, `services`, `appointments`
- Políticas RLS (seguridad)
- Índices para performance
- Datos de ejemplo (seed)

### 1.4 Verificar que todo se creó

Ve a **Table Editor** en el sidebar. Deberías ver:
- ✅ `business_info` (1 fila con datos de La Figura)
- ✅ `categories` (3 filas: Barbería, Peluquería, Estética)
- ✅ `services` (8 servicios de ejemplo)
- ✅ `appointments` (vacía)

### 1.5 (Opcional) Configurar Storage para imágenes

Si quieres subir imágenes de servicios:

1. Ve a **Storage** en el sidebar
2. Click **"New bucket"**
3. Nombre: `services`
4. **Public bucket:** ✅ activado
5. Click **"Create bucket"**

### 1.6 (Opcional) Configurar Auth real

Si quieres que el login del admin sea con Supabase Auth (más seguro):

1. Ve a **Authentication** → **Providers**
2. Activa **Email** (mínimo)
3. En **Users** → **"Add user"** → **"Create new user"**
4. Crea un usuario con email y contraseña
5. En **SQL Editor**, ejecuta:

```sql
-- Asignar rol admin al usuario
UPDATE auth.users 
SET raw_user_meta_data = jsonb_build_object('role', 'admin')
WHERE email = 'tu-email@admin.com';
```

> 💡 **Nota:** La versión actual usa una contraseña simple (`admin123`) para demo. Para producción real, implementa Supabase Auth.

---

## ☁️ PARTE 2: Configurar Cloudflare Pages

### 2.1 Subir código a GitHub

Si aún no lo has hecho:

```bash
# Inicializa git (si no lo has hecho)
git init
git add .
git commit -m "Initial commit: La Figura app"

# Crea un repo en GitHub (github.com/new) y luego:
git remote add origin https://github.com/TU-USUARIO/la-figura.git
git branch -M main
git push -u origin main
```

### 2.2 Crear proyecto en Cloudflare Pages

1. Ve a [dash.cloudflare.com](https://dash.cloudflare.com)
2. En el sidebar izquierdo, click **"Workers & Pages"**
3. Click **"Create"** → pestaña **"Pages"** → **"Connect to Git"**

### 2.3 Conectar repo de GitHub

1. Autoriza Cloudflare para acceder a tu cuenta de GitHub
2. Selecciona el repositorio `la-figura`
3. Click **"Begin setup"**

### 2.4 Configurar build

Rellena estos campos:

| Campo | Valor |
|-------|-------|
| **Framework preset** | `Vite` (o "None") |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | `/` (dejar por defecto) |

### 2.5 ⚠️ Agregar variables de entorno (MUY IMPORTANTE)

Antes de hacer el primer deploy, expande la sección **"Environment variables"** y agrega:

| Variable | Valor |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` (el Project URL de Supabase) |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOi...` (la anon key de Supabase) |
| `NODE_VERSION` | `20` |

> ⚠️ **Importante:** Las variables deben empezar con `VITE_` para que Vite las inyecte en el bundle del frontend.

### 2.6 Deploy

1. Click **"Save and Deploy"**
2. Espera ~2-3 minutos
3. Cuando termine, verás: ✅ **Success!**
4. Te dará una URL tipo: `https://la-figura.pages.dev`

### 2.7 (Opcional) Dominio personalizado

Si tienes un dominio (ej: `lafigura.com`):

1. En tu proyecto de Cloudflare Pages, ve a **"Custom domains"**
2. Click **"Set up a custom domain"**
3. Escribe tu dominio
4. Sigue las instrucciones para configurar DNS

---

## ✅ PARTE 3: Verificar el deploy

### 3.1 Checklist post-deploy

Abre tu URL (`https://la-figura.pages.dev`) y verifica:

- [ ] La página de inicio carga correctamente
- [ ] Los servicios se muestran con sus categorías
- [ ] El botón "Reservar por WhatsApp" abre WhatsApp con mensaje preformateado
- [ ] El modo oscuro/claro funciona
- [ ] En móvil se ve la bottom nav
- [ ] El panel admin funciona (contraseña: `admin123`)
- [ ] Puedes crear/editar/eliminar categorías y servicios

### 3.2 Probar conexión con Supabase

Si configuraste Supabase Auth real, verifica que los datos se guardan:

1. En el admin, edita la info del negocio
2. Ve a Supabase → Table Editor → `business_info`
3. Deberías ver los cambios reflejados

> 💡 **Nota:** La versión actual usa `localStorage` como fallback. Para persistencia real en Supabase, necesitas implementar los servicios que llamen a `supabase.from('...').select()`.

---

## 🔄 Deploy automático

Una vez configurado, cada push a `main` disparará un deploy automático:

```bash
# Haz cambios locales
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main

# Cloudflare hace deploy automático en ~2 minutos
```

### Deploy manual (si necesitas)

```bash
# Build local
npm run build

# Deploy con Wrangler CLI
npx wrangler pages deploy dist --project-name=la-figura
```

---

## 🐛 Troubleshooting

### "La app no carga" o "No se ven los datos"

1. Verifica que las variables de entorno en Cloudflare empiecen con `VITE_`
2. Verifica que el Project URL de Supabase no tenga trailing slash
3. Revisa la consola del navegador (F12) por errores

### "No puedo hacer login en admin"

- Contraseña demo: `admin123`
- Si configuraste Supabase Auth, revisa que el usuario tenga `role: admin` en `raw_user_meta_data`

### "Los cambios no se guardan en Supabase"

- La versión actual usa `localStorage` (datos se guardan solo en el navegador del usuario)
- Para persistencia real, necesitas implementar los servicios de Supabase en `src/lib/supabase.ts`

### "WhatsApp no abre correctamente"

- Verifica que el número en `business_info.whatsapp` esté en formato internacional SIN `+` ni espacios
- Ejemplo correcto: `5350000000` (Cuba = 53)

### "Quiero resetear la base de datos"

En Supabase → SQL Editor:

```sql
-- Borrar todo y re-seed
TRUNCATE business_info, categories, services, appointments RESTART IDENTITY;

-- Vuelve a ejecutar el seed del migration file
```

---

## 📊 Costos estimados

| Servicio | Plan Free | Suficiente para |
|----------|-----------|-----------------|
| **Supabase** | 500 MB DB, 1 GB storage, 50K auth users | ~1000 citas/mes |
| **Cloudflare Pages** | Unlimited bandwidth, 500 builds/mes | Tráfico ilimitado |
| **Total** | **$0/mes** | Producción real |

---

## 🔐 Seguridad en producción

Antes de lanzar públicamente:

1. ✅ Cambia la contraseña del admin (o implementa Supabase Auth)
2. ✅ Verifica que RLS esté activo en todas las tablas
3. ✅ No commitees el archivo `.env` (ya está en `.gitignore`)
4. ✅ Usa HTTPS (Cloudflare lo da gratis)
5. ✅ Considera rate limiting en reservas (Cloudflare Workers)

---

## 📞 Soporte

- **Supabase Docs:** https://supabase.com/docs
- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages/
- **Vite Docs:** https://vitejs.dev/

---

**¡Listo! Tu app está en producción 🎉**
