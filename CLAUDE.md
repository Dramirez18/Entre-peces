# CLAUDE.md — Entre Peces

## Que es este proyecto

**Entre Peces** es un marketplace web de acuariofilia para Colombia. Aplicacion React SPA para buscar, filtrar y comprar peces, plantas, camarones y accesorios de acuario.

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite 6 + Tailwind CSS 4 + Motion (Framer Motion)
- **Icons:** Lucide React + SVGs custom
- **Base de datos:** Supabase PostgreSQL (proyecto `blqvfrqkzaudrdbxjovt`)
- **Auth:** Login por email (tabla Client) + Google OAuth (Supabase Auth)
- **Deploy:** Vercel (https://entre-peces.vercel.app)
- **Repo:** GitHub

## Supabase

- **Project ID:** `blqvfrqkzaudrdbxjovt`
- **URL:** `https://blqvfrqkzaudrdbxjovt.supabase.co`
- **RLS:** Desactivado en todas las tablas (anon key puede leer/escribir)
- **Tablas:** Product, Client, Order, OrderItem, BugReport
- **Enum:** Category (PostgreSQL USER-DEFINED)

### Credenciales
Las keys publicas estan en `.env.local`:
```
VITE_SUPABASE_URL=https://blqvfrqkzaudrdbxjovt.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
```

## Arquitectura

```
src/
  App.tsx              -- Componente principal (~2300 lineas, monolitico)
  HeroCarousel.tsx     -- Carrusel hero con 3 slides
  CompatibilityTable.tsx -- Matriz de compatibilidad 25x25 especies
  UserProfilePage.tsx  -- Pagina de perfil del usuario
  AdminPanel.tsx       -- Panel de administracion (solo role=admin)
  types.ts             -- Product, CartItem, Category, User, BugReport
  constants.ts         -- Catalogo hardcoded (fallback)
  migrations.ts        -- Registro de migraciones SQL
  lib/supabase.ts      -- Cliente Supabase (lee de env vars)
  index.css            -- Theme: brand-blue, brand-dark, brand-light
```

## Auth y Roles

- **Login por email:** Query a tabla `Client` por email
- **Google OAuth:** `supabase.auth.signInWithOAuth({ provider: 'google' })`
- **Roles:** Columna `role` en tabla Client (`'user'` | `'admin'`)
- **Admin access:** Solo `user.role === 'admin'` ve el boton Administrador y accede al panel
- **Admin actual:** `dramirez180929@gmail.com`

## Bug Reports

Tabla `BugReport` en Supabase para tracking interno de bugs.
- Solo usuarios admin pueden crear/ver bugs
- Campos: title, description, status (open/in_progress/resolved/closed), priority (low/medium/high/critical), reportedBy, assignedTo, page, steps, screenshot
- Los agentes IA deben consultar esta tabla para ver bugs pendientes antes de trabajar en el proyecto

## Migraciones SQL

Las migraciones se registran en `src/migrations.ts`. Cada cambio de schema se agrega como entrada.

**Reglas de migraciones:**
- Se ejecutan MANUALMENTE por el admin en el SQL Editor de Supabase
- Cada migracion es INDEPENDIENTE — no debe incluir SQL de migraciones anteriores
- Una vez creada una migracion, se asume que YA FUE ejecutada manualmente
- NUNCA combinar o agrupar migraciones al presentarlas al usuario — cada una va por separado
- Usar `IF NOT EXISTS` / `IF EXISTS` para hacer las migraciones idempotentes

**Historial:**
- 001: Schema inicial + seed data (ejecutada)
- 002/003: Frontend-only (sin SQL)
- 004: Role en Client + tabla BugReport (ejecutada)
- 005: Columnas extra en BugReport para visual bug reporter

## Comandos

```bash
npm run dev          # Vite dev server
npm run build        # Build produccion -> /dist
npm run preview      # Preview del build
npm run lint         # Type check
```

## Convenciones

- WhatsApp de contacto: `+57 312 438 0879`
- Envio gratis desde COP $200,000
- Moneda: COP (pesos colombianos)
- Idioma de la app: Espanol
- Imagenes de productos en postimg.cc
- `referrerPolicy="no-referrer"` en todas las imagenes externas
- App.tsx es monolitico -- toda la UI esta en un solo archivo
- Layout: `max-w-[1400px]` con padding responsivo

## Reglas Operacionales para Agentes IA

### CRITICO — Aislamiento de proyectos
- **NUNCA** usar herramientas MCP/nativas conectadas a otros proyectos sin confirmacion explicita del usuario
- **NUNCA** asumir que un MCP Supabase conectado pertenece a este proyecto
- **SIEMPRE** verificar el project ID de Supabase antes de ejecutar queries
- El proyecto de Entre Peces es `blqvfrqkzaudrdbxjovt` -- cualquier otro ID es de OTRO proyecto
- Pedir credenciales/IDs explicitamente al usuario antes de operar
- Cada proyecto del usuario es completamente aislado a menos que el diga lo contrario

### Lecciones aprendidas
1. **Proyecto Supabase equivocado:** En sesiones anteriores se uso accidentalmente el proyecto `dlqkoclmoeubqqptgznd` (SB Portal de Juan) en lugar del correcto (`blqvfrqkzaudrdbxjovt`). Esto causo que Google OAuth redirigiera al proyecto equivocado con error 403 org_internal. SIEMPRE verificar el project ID.
2. **Google OAuth 403 org_internal:** Si aparece este error, verificar que el Client ID en Supabase corresponde al proyecto GCP correcto y que la pantalla de consentimiento OAuth esta en modo "External" + "Published".
3. **Migraciones SQL son manuales:** El admin ejecuta las migraciones en el SQL Editor de Supabase. No hay migration runner automatico. Cada migracion debe ser independiente y ejecutable por separado.
4. **RLS desactivado:** Todas las tablas usan RLS desactivado. El anon key tiene acceso completo de lectura/escritura.

### Flujo de trabajo recomendado
1. Leer este CLAUDE.md al inicio de cada sesion
2. Consultar tabla `BugReport` para ver bugs pendientes
3. Verificar project ID antes de cualquier operacion Supabase
4. Registrar cambios de schema como nuevas migraciones en `src/migrations.ts`
5. El usuario ejecuta las migraciones manualmente
