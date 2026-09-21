# La Figura - Peluquería & Barbería

App web completa para gestión de citas de un negocio de servicios de belleza.

## 🚀 Stack Tecnológico

- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS v4
- **UI:** Lucide Icons + Framer Motion
- **Forms:** React Hook Form + Zod
- **Backend:** Supabase (Postgres + Auth + Storage)
- **Deploy:** Cloudflare Pages

## 📦 Instalación

```bash
npm install
```

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

### Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ejecuta las migraciones SQL en `supabase/migrations/001_initial_schema.sql`
3. Configura Auth (email/password o providers)
4. Crea un usuario admin y asígnale el rol `admin` en `auth.users.raw_user_meta_data`

### Migraciones SQL

```sql
-- Ejecuta en el SQL Editor de Supabase:
-- supabase/migrations/001_initial_schema.sql
```

Esto crea:
- `business_info` - Info del negocio
- `services` - Catálogo de servicios
- `appointments` - Citas/reservas
- `schedules` - Horarios de atención
- `blocked_slots` - Bloqueos de horarios

Con RLS (Row Level Security) configurado:
- Lectura pública: servicios activos, info del negocio, horarios
- Escritura admin: CRUD completo con rol `admin`
- Usuarios pueden crear citas

## 🏃 Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 🏗️ Build

```bash
npm run build
```

## 🌐 Deploy en Cloudflare Pages

1. Conecta tu repo a Cloudflare Pages
2. Configura:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Variables de entorno: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
3. Deploy automático en cada push

### Con Wrangler (CLI)

```bash
npx wrangler pages deploy dist --project-name=la-figura
```

## 📱 PWA

La app es instalable como PWA:
- `manifest.json` configurado
- Service Worker (generado por Vite PWA plugin si se agrega)
- Iconos SVG incluidos

## 🎨 Características

### Mobile-First
- Diseño optimizado para 375px+
- Bottom tab bar tipo app nativa
- Áreas táctiles ≥44px
- Inputs ≥16px (evita zoom en iOS)
- Pickers nativos para fecha/hora

### Páginas
1. **Inicio** - Hero, servicios destacados, testimonios, CTA
2. **Servicios** - Listado con filtros por categoría y búsqueda
3. **Reservar** - Formulario con validación + resumen en vivo + WhatsApp
4. **Admin** - Panel protegido con CRUD de servicios, gestión de citas
5. **Contacto** - Mapa, horarios, redes sociales, formulario

### Admin (demo: contraseña `admin123`)
- Editar info del negocio
- CRUD de servicios
- Gestión de citas con filtros y estados
- Configuración de horarios

### Accesibilidad
- Modo claro/oscuro (auto-detecta preferencia del sistema)
- `prefers-reduced-motion` respetado
- ARIA labels en navegación
- Contraste AA en todos los textos
- Focus visible para navegación por teclado

### Performance
- Lazy loading de componentes
- CSS optimizado con Tailwind
- Animaciones con Framer Motion (respetando reduced-motion)
- Bundle size optimizado (~137KB gzip)

## 📁 Estructura

```
src/
├── App.tsx              # Entry point + routing
├── main.tsx             # React root
├── index.css            # Tailwind + custom styles
├── vite-env.d.ts        # TypeScript env types
├── types/
│   └── index.ts         # All TypeScript types + Zod schemas
├── lib/
│   ├── supabase.ts      # Supabase client
│   └── data.ts          # Mock data + localStorage helpers
├── hooks/
│   ├── useTheme.ts      # Dark/light mode
│   └── useStore.tsx     # Global state (Context + Reducer)
├── components/
│   ├── BottomNav.tsx    # Mobile bottom navigation
│   └── ToastContainer.tsx # Toast notifications
└── pages/
    ├── Home.tsx         # Landing page
    ├── Services.tsx     # Service catalog
    ├── Booking.tsx      # Booking form
    ├── Admin.tsx        # Admin panel
    └── Contact.tsx      # Contact page

supabase/
└── migrations/
    └── 001_initial_schema.sql  # DB schema + RLS + seed

public/
├── manifest.json        # PWA manifest
└── favicon.svg          # App icon
```

## 🔐 Seguridad

- Validación con Zod (client + server)
- RLS en Supabase (solo admin puede modificar datos)
- Variables de entorno para secretos
- Sanitización de inputs
- Rate limiting (implementar en Pages Functions)

## 📄 Licencia

MIT
