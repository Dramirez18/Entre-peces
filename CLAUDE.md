# CLAUDE.md — Entre Peces

## Qué es este proyecto

**Entre Peces** es un marketplace web de acuariofilia para Colombia. Aplicación React SPA para buscar, filtrar y comprar peces, plantas, camarones y accesorios de acuario.

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite 6 + Tailwind CSS 4 + Motion (Framer Motion)
- **Icons:** Lucide React + SVGs custom
- **Base de datos:** Supabase PostgreSQL
- **Auth:** Login por email (tabla Client) + Google OAuth (Supabase Auth)
- **Deploy:** Vercel (https://entre-peces.vercel.app)

> Las credenciales (URL y anon key de Supabase) viven en `.env.local` y en las variables de
> entorno de Vercel. **No se documentan en el repositorio.**

## Arquitectura

```
src/
  App.tsx               -- Componente principal (~2600 líneas, monolítico)
  HeroCarousel.tsx      -- Carrusel hero con 3 slides (mask radial CSS para fundir imágenes)
  CompatibilityTable.tsx -- Matriz de compatibilidad 25x25 especies
  UserProfilePage.tsx   -- Página de perfil del usuario
  AdminPanel.tsx        -- Panel de administración (solo role=admin, CRUD de productos)
  BugReportWidget.tsx   -- Widget flotante para reportar bugs (solo admin, estilo BugHerd)
  types.ts              -- Product, CartItem, Category, User, BugReport, AunapNews
  constants.ts          -- Catálogo hardcoded (fallback)
  migrations.ts         -- Registro de migraciones SQL
  lib/supabase.ts       -- Cliente Supabase (lee de env vars)
  index.css             -- Theme: brand-blue, brand-dark, brand-light
```

## Auth y Roles

- **Login por email:** Query a tabla `Client` por email
- **Google OAuth:** `supabase.auth.signInWithOAuth({ provider: 'google' })`
- **Roles:** Columna `role` en tabla Client (`'user'` | `'admin'`)
- **Admin access:** Solo `user.role === 'admin'` ve el botón Administrador y accede al panel

## Bug Reports

Tabla `BugReport` en Supabase para tracking interno de bugs.
- Solo usuarios admin pueden crear/ver bugs vía el widget flotante (BugReportWidget.tsx)
- Widget estilo BugHerd: inspector de elementos + screenshot + formulario
- Campos: title, description, status, priority, reportedBy, assignedTo, page, steps, screenshot, elementInfo, viewport, userAgent
- Al reportar un bug, el widget redirige al AdminPanel > Bug Reports

## Noticias (Sección Conocimiento)

- **Noticias:** Provienen de la tabla `AunapNews` en Supabase (fuente: https://aunap.gov.co/noticias/)
- **Datos Curiosos:** Linkea a https://muyinteresante.okdiario.com/temas/peces/
- Las noticias se actualizan manualmente en la tabla AunapNews (2-3 artículos recientes)

## Migraciones SQL

Las migraciones se registran en `src/migrations.ts`. Cada cambio de schema se agrega como entrada.

**Reglas de migraciones:**
- Se ejecutan **manualmente** en el SQL Editor de Supabase
- Cada migración es **independiente** — no debe incluir SQL de migraciones anteriores
- Una vez creada una migración, se asume que ya fue ejecutada manualmente
- Usar `IF NOT EXISTS` / `IF EXISTS` para hacerlas idempotentes

## Comandos

```bash
npm run dev          # Vite dev server
npm run build        # Build producción -> /dist
npm run preview      # Preview del build
npm run lint         # Type check
```

## Admin Panel (AdminPanel.tsx)

- **Dashboard:** Estadísticas generales (productos, clientes, pedidos)
- **Productos:** Tabla con búsqueda, filtro por categoría/estado y ordenamiento
  - Agregar / Editar / Eliminar producto (modal completo con todos los campos)
  - Toggle activo/inactivo
- **Clientes:** Lista de clientes registrados con búsqueda
- **Pedidos:** Historial de órdenes con detalle expandible
- **SQL History:** Registro de migraciones con estado aplicada/pendiente
- **Bug Reports:** CRUD de bugs con prioridad y asignación

## Home Page — Categorías

Todas las categorías usan **cards grandes con imagen** (estilo unificado):
- Cards con foto a pantalla completa (object-contain + bg-slate-900), overlay oscuro y texto blanco
- Constante `CATEGORY_IMAGES` en App.tsx controla todas las categorías
- "Acondicionadores" se muestra como "Seachem" en la UI
- Helper `getCategoryDisplayName()` centraliza el mapeo de nombres

## Convenciones

- Moneda: COP (pesos colombianos); envío gratis desde COP $200,000
- Idioma de la app: Español
- Imágenes de productos en postimg.cc, con `referrerPolicy="no-referrer"`
- App.tsx es monolítico — toda la UI está en un solo archivo
- Layout: `max-w-[1400px]` con padding responsivo
- Navegación SPA integrada con History API (pushState/popState)
- Política de tratamiento de datos en el registro de usuarios (Colombia)

## Notas técnicas

- **html2canvas no soporta oklch():** Tailwind CSS 4 genera colores oklch() que html2canvas no puede parsear. Se usa try/catch + reemplazo de oklch en el DOM clonado.
- **Imágenes del carousel:** Las fotos tienen fondo gris (no transparente); se usa CSS `mask-image` con radial-gradient para difuminar los bordes.
- **Campo `updatedAt` es NOT NULL:** Al crear productos vía REST API, incluir siempre `"updatedAt": "ISO_TIMESTAMP"`.
- **PostgreSQL `ADD VALUE` requiere commit separado:** Al agregar un valor a un enum con `ALTER TYPE ... ADD VALUE`, ejecutar el ALTER TYPE primero y el UPDATE en una segunda ejecución.
- **localStorage por navegador:** Los estados de migraciones aplicadas se guardan en localStorage.
