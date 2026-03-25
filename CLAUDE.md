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
- **Tablas:** Product, Client, Order, OrderItem, BugReport, AunapNews, VisitCounter
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
  App.tsx              -- Componente principal (~2600 lineas, monolitico)
  HeroCarousel.tsx     -- Carrusel hero con 3 slides (mask radial CSS para fundir imagenes)
  CompatibilityTable.tsx -- Matriz de compatibilidad 25x25 especies
  UserProfilePage.tsx  -- Pagina de perfil del usuario
  AdminPanel.tsx       -- Panel de administracion (solo role=admin, CRUD completo de productos)
  BugReportWidget.tsx  -- Widget flotante para reportar bugs (solo admin, estilo BugHerd)
  types.ts             -- Product, CartItem, Category, User, BugReport, AunapNews
  constants.ts         -- Catalogo hardcoded (fallback)
  migrations.ts        -- Registro de migraciones SQL (001-011)
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
- Solo usuarios admin pueden crear/ver bugs via el widget flotante (BugReportWidget.tsx)
- Widget estilo BugHerd: inspector de elementos + screenshot + formulario
- Campos: title, description, status, priority, reportedBy, assignedTo, page, steps, screenshot, elementInfo, viewport, userAgent
- Al reportar un bug, el widget redirige al AdminPanel > Bug Reports
- Los agentes IA deben consultar esta tabla para ver bugs pendientes antes de trabajar en el proyecto
- html2canvas tiene limitacion con colores oklch() de Tailwind CSS 4 — se usa mascara radial como workaround

## Noticias (Seccion Conocimiento)

- **Noticias:** Provienen de la tabla `AunapNews` en Supabase (fuente: https://aunap.gov.co/noticias/)
- **Datos Curiosos:** Linkea a https://muyinteresante.okdiario.com/temas/peces/
- Las noticias se actualizan manualmente en la tabla AunapNews (2-3 articulos recientes)
- Click en "Proximamente" o en el bloque de Noticias redirige al sitio de AUNAP

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
- 005: Columnas extra en BugReport: elementInfo, viewport, userAgent (ejecutada)
- 006: Disable RLS en TODAS las tablas (ejecutada)
- 007: Tabla AunapNews + seed data con 3 noticias (ejecutada)
- 008: Tabla VisitCounter + columna dataPolicyConsent en Client (ejecutada)
- 009: Actualizar imagen Corydora Wotroi en Product (ejecutada via REST API)
- 010: Actualizar imagenes masivas ~60 productos en Product (ejecutada via REST API)
- 011: Renombrar enum Medidores → Medicamentos (ejecutada — ALTER TYPE + UPDATE en 2 pasos separados)

## Comandos

```bash
npm run dev          # Vite dev server
npm run build        # Build produccion -> /dist
npm run preview      # Preview del build
npm run lint         # Type check
```

## Admin Panel (AdminPanel.tsx)

- **Dashboard:** Estadisticas generales (productos, clientes, pedidos)
- **Productos:** Tabla con busqueda, filtro por categoria/estado, ordenamiento
  - **Agregar producto:** Boton verde → modal completo con todos los campos (nombre, cientifico, descripcion, categoria, talla, precio, stock, imagen URL con preview)
  - **Editar producto:** Boton amarillo → modal completo (mismos campos que agregar), guarda todos los cambios en Supabase
  - **Eliminar producto:** Boton rojo con confirmacion
  - **Toggle activo/inactivo:** Badge clickeable en columna Estado
- **Clientes:** Lista de clientes registrados con busqueda
- **Pedidos:** Historial de ordenes con detalle expandible
- **SQL History:** Registro de migraciones con estado aplicada/pendiente
- **Bug Reports:** CRUD de bugs con prioridad y asignacion

## Home Page — Categorias

Zona de categorias en inicio con **dos niveles**:
- **Nivel A (con imagen):** Cards grandes con foto a pantalla completa (object-contain + bg-slate-900)
  - Peces (Disco Heckel), Plantas (acuario plantado), Camarones (Langosta roja), Gravilla (blanca), Seachem (productos Seachem), Plantados (Flourite black)
- **Nivel B (sin imagen):** Cards compactas con icono + nombre + conteo
  - Termostatos, Filtros, Alimentos, Medicamentos, Lamparas
- Constante `CATEGORY_IMAGES` en App.tsx controla cuales tienen foto
- Nota: "Acondicionadores" fue renombrado a "Seachem" en la UI (la categoria en BD sigue siendo Acondicionadores)
- Nota: "Medidores" fue renombrado a "Medicamentos" en BD y UI (enum Category actualizado en Supabase)
- Helper `getCategoryDisplayName()` centraliza mapeo de nombres: Acondicionadores→Seachem, Lamparas→Lámparas

## HeroCarousel

3 slides con imagenes de postimg.cc:
1. Betta dumbo (Photoroom) — "Tu pasion por el agua"
2. Pareja Discos — "Peces tropicales de todo el mundo"
3. Procambarus blanca — "Acuarios plantados llenos de vida"

## Convenciones

- WhatsApp de contacto: `+57 312 438 0879`
- Envio gratis desde COP $200,000
- Moneda: COP (pesos colombianos)
- Idioma de la app: Espanol
- Imagenes de productos en postimg.cc
- `referrerPolicy="no-referrer"` en todas las imagenes externas
- App.tsx es monolitico -- toda la UI esta en un solo archivo
- Layout: `max-w-[1400px]` con padding responsivo
- Boton ← "Volver" en header junto a hamburguesa para navegacion entre paginas
- Navegacion SPA integrada con History API (pushState/popState) para que el boton atras del navegador funcione
- Barra CTA de Tabla de Compatibilidad removida del home (acceso via seccion Conocimiento)
- Contador de visitas dinamico al final del inicio
- Politica de tratamiento de datos en registro de usuarios (Colombia)

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
4. **RLS desactivado:** Todas las tablas usan RLS desactivado. El anon key tiene acceso completo de lectura/escritura. Si productos dejan de cargar, lo primero es verificar que RLS siga desactivado.
5. **html2canvas no soporta oklch():** Tailwind CSS 4 genera colores oklch() que html2canvas no puede parsear. Se usa try/catch + reemplazo de oklch en el DOM clonado.
6. **Imagenes del carousel:** Las fotos de peces tienen fondo gris (no transparente). Se usa CSS mask-image con radial-gradient para difuminar los bordes.
7. **Vercel env vars:** Las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY deben estar configuradas en Vercel Dashboard > Settings > Environment Variables. Sin ellas, produccion no conecta a Supabase.
8. **localStorage es por navegador:** Los estados de migraciones aplicadas (verde/pendiente) se guardan en localStorage, asi que cada navegador tiene su propio estado.
9. **Productos se cargan desde Supabase, no archivos locales:** `products.json` y `constants.ts` son solo fallback. Para actualizar imagenes/datos de productos, hay que hacer UPDATE directo en Supabase (via REST API con anon key o desde el Admin Panel).
10. **Supabase REST API para bulk updates:** Se puede usar curl con el anon key para actualizar productos masivamente: `curl -X PATCH "$URL/rest/v1/Product?name=ilike.*keyword*" -H "apikey: $KEY" -d '{"image":"url"}'`. RLS desactivado permite esto.
11. **Campo updatedAt es NOT NULL:** Al crear productos via REST API, incluir siempre `"updatedAt": "ISO_TIMESTAMP"`.
12. **NO crear archivos en .claude/commands/ ni skills personalizadas:** El usuario lo ha indicado explicitamente.
13. **PostgreSQL ADD VALUE requiere commit separado:** Al agregar un nuevo valor a un enum con `ALTER TYPE ... ADD VALUE`, no se puede usar el nuevo valor en la misma transaccion. Hay que ejecutar el ALTER TYPE primero, y luego en una segunda ejecucion hacer el UPDATE. El SQL Editor de Supabase hace auto-commit entre ejecuciones.

### Flujo de trabajo recomendado
1. Leer este CLAUDE.md al inicio de cada sesion
2. Consultar tabla `BugReport` para ver bugs pendientes
3. Verificar project ID antes de cualquier operacion Supabase
4. Registrar cambios de schema como nuevas migraciones en `src/migrations.ts`
5. El usuario ejecuta las migraciones manualmente
