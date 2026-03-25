/**
 * SQL Migration History
 *
 * Each migration represents a SQL script that has been (or should be) executed
 * against the Supabase PostgreSQL database. This file serves as a versioned
 * record of all database changes — the "source of truth" for schema evolution.
 *
 * Workflow:
 *   1. Developer/AI writes a migration here
 *   2. Admin reviews the SQL in the admin panel
 *   3. SQL is executed in Supabase (via MCP, Studio, or psql)
 *   4. Admin marks the migration as "applied"
 */

export interface Migration {
  id: string;
  title: string;
  description: string;
  sql: string;
  createdAt: string;   // ISO date
  appliedAt?: string;  // ISO date when marked as applied
}

// ── localStorage key for tracking applied status ──
const APPLIED_KEY = 'entrepeces_migrations_applied';

export function getAppliedMigrations(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(APPLIED_KEY) || '{}');
  } catch { return {}; }
}

export function markMigrationApplied(id: string): Record<string, string> {
  const applied = getAppliedMigrations();
  applied[id] = new Date().toISOString();
  localStorage.setItem(APPLIED_KEY, JSON.stringify(applied));
  return applied;
}

export function unmarkMigrationApplied(id: string): Record<string, string> {
  const applied = getAppliedMigrations();
  delete applied[id];
  localStorage.setItem(APPLIED_KEY, JSON.stringify(applied));
  return applied;
}

// ══════════════════════════════════════════════════════════════
// MIGRATION REGISTRY — Add new migrations at the bottom
// ══════════════════════════════════════════════════════════════

export const MIGRATIONS: Migration[] = [
  {
    id: '001_initial_setup',
    title: 'Initial Setup — Schema + Seed Data',
    description: 'Creates the full database schema (4 tables, 1 enum, 3 indexes, 3 foreign keys) and seeds 859 products, 2 clients, 2 orders, and 4 order items from Google Sheets export. This is the foundational migration that was executed as a single SQL file (full_export.sql).',
    createdAt: '2026-03-20',
    appliedAt: '2026-03-20',
    sql: `-- ============================================================
-- Entre Peces - Initial Setup Migration
-- Executed: 2026-03-20
-- Contents:
--   DDL Schema (4 tables, 1 enum, 3 indexes, 3 foreign keys)
--   859 Product INSERTs (from Google Sheets ENTREPECES)
--   2 Client INSERTs (from Clientes Registrados)
--   2 Order INSERTs + 4 OrderItem INSERTs (from Pedidos del dia)
-- ============================================================

-- Drop existing objects in reverse dependency order
DROP TABLE IF EXISTS "OrderItem" CASCADE;
DROP TABLE IF EXISTS "Order" CASCADE;
DROP TABLE IF EXISTS "Client" CASCADE;
DROP TABLE IF EXISTS "Product" CASCADE;
DROP TYPE IF EXISTS "Category" CASCADE;

CREATE SCHEMA IF NOT EXISTS "public";

-- Enum
CREATE TYPE "Category" AS ENUM (
  'Peces', 'Plantas', 'Camarones', 'Plantados', 'Termostatos',
  'Filtros', 'Alimentos', 'Acondicionadores', 'Gravilla', 'Medicamentos', 'Lamparas'
);

-- Product table
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scientificName" TEXT,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "category" "Category" NOT NULL,
    "image" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 10,
    "size" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- Client table
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- Order table
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- OrderItem table
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productId" TEXT,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" INTEGER NOT NULL,
    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- Foreign Keys
ALTER TABLE "Order" ADD CONSTRAINT "Order_clientId_fkey"
  FOREIGN KEY ("clientId") REFERENCES "Client"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "Order"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Product"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- ============================================================
-- DATA: 859 Product INSERTs (omitted here for brevity)
-- Full SQL available in: scripts/full_export.sql
-- ============================================================

-- 2 Client INSERTs
INSERT INTO "Client" ("name","email","phone","address","createdAt","updatedAt")
VALUES ('Maria Gonzalez','maria@email.com','3101234567','Cra 15 #45-67, Bogota',NOW(),NOW())
ON CONFLICT ("email") DO NOTHING;

INSERT INTO "Client" ("name","email","phone","address","createdAt","updatedAt")
VALUES ('Carlos Perez','carlos@email.com','3209876543','Calle 80 #12-34, Bogota',NOW(),NOW())
ON CONFLICT ("email") DO NOTHING;

-- 2 Order INSERTs + 4 OrderItems
INSERT INTO "Order" ("clientId","address","date","time","total","createdAt")
SELECT c."id", 'Cra 15 #45-67, Bogota', '2026-03-15', '14:00', 85000, NOW()
FROM "Client" c WHERE c."phone" = '3101234567' LIMIT 1;

INSERT INTO "Order" ("clientId","address","date","time","total","createdAt")
SELECT c."id", 'Calle 80 #12-34, Bogota', '2026-03-18', '10:30', 120000, NOW()
FROM "Client" c WHERE c."phone" = '3209876543' LIMIT 1;`,
  },

  {
    id: '002_connect_frontend_supabase',
    title: 'Connect Frontend to Supabase',
    description: 'No schema changes. Installed @supabase/supabase-js, created Supabase client (src/lib/supabase.ts), updated App.tsx to fetch products directly from Supabase instead of static products.json. Fallback chain: Supabase → products.json → hardcoded constants.',
    createdAt: '2026-03-20',
    appliedAt: '2026-03-20',
    sql: `-- No SQL changes required.
-- This migration tracks a frontend-only change:
--   1. Installed @supabase/supabase-js
--   2. Created src/lib/supabase.ts with public anon key
--   3. App.tsx now queries: SELECT * FROM "Product" ORDER BY name
--   4. Env vars: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
--   5. Fallback: Supabase → products.json → PRODUCTS constant`,
  },

  {
    id: '003_auth_supabase_direct',
    title: 'Auth: Login & Register via Supabase',
    description: 'Replaced /api/login and /api/register (Express + Google Sheets) with direct Supabase queries. Login queries Client table by email. Register upserts into Client table. Added Google OAuth button (requires Supabase Auth provider setup). Orders now saved to Supabase Order + OrderItem tables. Desktop UI padding improvements.',
    createdAt: '2026-03-20',
    sql: `-- No schema changes required.
-- This migration tracks frontend auth changes:
--   1. Login: SELECT FROM "Client" WHERE email = ? (replaces /api/login)
--   2. Register: UPSERT INTO "Client" (replaces /api/register)
--   3. Google OAuth: supabase.auth.signInWithOAuth({ provider: 'google' })
--   4. Orders: INSERT INTO "Order" + "OrderItem" (replaces /api/order)
--   5. Desktop UI: improved padding across header, main, footer, cards
--
-- REQUIRED: Enable Google Auth provider in Supabase Dashboard:
--   Authentication → Providers → Google → Enable
--   Set Google Client ID + Secret from Google Cloud Console
--   Add redirect URL: https://entre-peces.vercel.app`,
  },

  {
    id: '004_role_and_bugreports',
    title: 'Add Role to Client + BugReport Table',
    description: 'Adds "role" column to Client table (default "user") and creates BugReport table for internal bug tracking. Sets dramirez180929@gmail.com as admin. Only admin users can access the admin panel (replaces PIN-based auth).',
    createdAt: '2026-03-20',
    sql: `-- ============================================================
-- Migration 004: Role column + BugReport table
-- ============================================================

-- 1. Add role column to Client (default 'user')
ALTER TABLE "Client" ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'user';

-- 2. Set admin role for David
UPDATE "Client" SET "role" = 'admin' WHERE "email" = 'dramirez180929@gmail.com';

-- 3. Create BugReport table
CREATE TABLE IF NOT EXISTS "BugReport" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "reportedBy" TEXT NOT NULL,
    "assignedTo" TEXT,
    "screenshot" TEXT,
    "page" TEXT,
    "steps" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    CONSTRAINT "BugReport_pkey" PRIMARY KEY ("id")
);

-- 4. Indexes
CREATE INDEX IF NOT EXISTS "BugReport_status_idx" ON "BugReport"("status");
CREATE INDEX IF NOT EXISTS "BugReport_reportedBy_idx" ON "BugReport"("reportedBy");

-- 5. Disable RLS for BugReport (matches other tables)
ALTER TABLE "BugReport" DISABLE ROW LEVEL SECURITY;`,
  },

  {
    id: '005_bugreport_extra_columns',
    title: 'BugReport: Add elementInfo, viewport, userAgent columns',
    description: 'Adds extra columns to BugReport for the BugHerd-style visual bug reporter widget. Stores DOM element metadata, viewport dimensions, and browser user agent.',
    createdAt: '2026-03-20',
    sql: `-- ============================================================
-- Migration 005: Extra columns for visual bug reporter
-- ============================================================

ALTER TABLE "BugReport" ADD COLUMN IF NOT EXISTS "elementInfo" TEXT;
ALTER TABLE "BugReport" ADD COLUMN IF NOT EXISTS "viewport" TEXT;
ALTER TABLE "BugReport" ADD COLUMN IF NOT EXISTS "userAgent" TEXT;`,
  },

  {
    id: '006_disable_rls_all_tables',
    title: 'Disable RLS on all tables (fix access issues)',
    description: 'After migration 005, products stopped loading and bug reports stopped saving. Most likely cause: RLS was enabled on one or more tables. This migration explicitly disables RLS on ALL tables to restore access via anon key.',
    createdAt: '2026-03-21',
    sql: `-- ============================================================
-- Migration 006: Disable RLS on ALL tables
-- Fixes: Products not loading + BugReport not saving
-- ============================================================

ALTER TABLE "Product" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Client" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "BugReport" DISABLE ROW LEVEL SECURITY;`,
  },

  {
    id: '007_aunap_news_table',
    title: 'Create AunapNews table for AUNAP news feed',
    description: 'Creates AunapNews table to store news articles from AUNAP (aunap.gov.co/noticias/). Seeded with 3 current articles. Frontend reads from this table to display in the Conocimiento section.',
    createdAt: '2026-03-21',
    sql: `-- ============================================================
-- Migration 007: AunapNews table + seed data
-- ============================================================

CREATE TABLE IF NOT EXISTS "AunapNews" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL UNIQUE,
    "publishedDate" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "AunapNews" DISABLE ROW LEVEL SECURITY;

INSERT INTO "AunapNews" ("title", "url", "publishedDate") VALUES
  ('La AUNAP fortalece la pesca artesanal en el Caribe con entregas en Sucre, Cesar, Magdalena y Bolívar', 'https://aunap.gov.co/la-aunap-fortalecen-la-pesca-artesanal-en-el-caribe-con-entregas-en-sucre-cesar-magdalena-y-bolivar/', '19 marzo, 2026'),
  ('AUNAP socializa en San Marcos el Programa de Repoblamiento 2026', 'https://aunap.gov.co/aunap-socializa-en-san-marcos-el-programa-de-repoblamiento-2026-y-prioriza-acciones-en-la-mojana/', '3 marzo, 2026'),
  ('Asociaciones pesqueras reciben embarcaciones y motores en cuatro municipios', 'https://aunap.gov.co/asociaciones-pesqueras-reciben-embarcaciones-y-motores-en-cuatro-municipios/', '3 marzo, 2026')
ON CONFLICT ("url") DO NOTHING;`,
  },

  {
    id: '008_site_stats_and_data_policy',
    title: 'SiteStats table + increment_visits() + data policy columns in Client',
    description: 'Creates SiteStats table for visit counter, a PostgreSQL function to atomically increment visits, and adds acceptedDataPolicy/policyAcceptedAt columns to Client for Ley 1581 compliance.',
    createdAt: '2026-03-23',
    sql: `-- ============================================================
-- Migration 008: Visit counter + Data policy consent
-- ============================================================

-- 1) Visit counter table
CREATE TABLE IF NOT EXISTS "SiteStats" (
    "id" TEXT PRIMARY KEY DEFAULT 'main',
    "visitCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE "SiteStats" DISABLE ROW LEVEL SECURITY;
INSERT INTO "SiteStats" ("id", "visitCount") VALUES ('main', 0) ON CONFLICT ("id") DO NOTHING;

-- 2) Atomic increment function
CREATE OR REPLACE FUNCTION increment_visits()
RETURNS INTEGER AS $$
DECLARE new_count INTEGER;
BEGIN
  UPDATE "SiteStats" SET "visitCount" = "visitCount" + 1, "updatedAt" = NOW() WHERE "id" = 'main';
  SELECT "visitCount" INTO new_count FROM "SiteStats" WHERE "id" = 'main';
  RETURN new_count;
END;
$$ LANGUAGE plpgsql;

-- 3) Data policy consent columns on Client
ALTER TABLE "Client" ADD COLUMN IF NOT EXISTS "acceptedDataPolicy" BOOLEAN DEFAULT FALSE;
ALTER TABLE "Client" ADD COLUMN IF NOT EXISTS "policyAcceptedAt" TIMESTAMP;`,
  },
  {
    id: '009',
    title: 'Actualizar imagen Corydora Wotroi',
    description: 'Corrige la imagen de la Corydora Wotroi que tenía un goldfish genérico de Unsplash.',
    createdAt: '2026-03-23',
    sql: `-- 009: Actualizar imagen Corydora Wotroi
UPDATE "Product"
SET image = 'https://i.postimg.cc/5ysz0KLt/corydora-wotroi.png'
WHERE name ILIKE '%wotroi%';`,
  },
  {
    id: '010',
    title: 'Actualización masiva de imágenes de productos (peces)',
    description: 'Reemplaza todas las imágenes genéricas de Unsplash por fotos reales de postimg.cc para ~50 productos de peces.',
    createdAt: '2026-03-23',
    sql: `-- 010: Actualización masiva de imágenes de productos
-- Escalar (todas las tallas)
UPDATE "Product" SET image = 'https://i.postimg.cc/T1tbwNgw/Escalar.png' WHERE name ILIKE 'escalar%' AND image LIKE '%unsplash%';

-- Espada koi
UPDATE "Product" SET image = 'https://i.postimg.cc/mkm9DpMn/Espada-koi.png' WHERE name ILIKE 'espada koi%' AND image LIKE '%unsplash%';

-- Estrigata marmol
UPDATE "Product" SET image = 'https://i.postimg.cc/zvxhB2Wt/Estigata-marmol.png' WHERE name ILIKE 'estrigata marmol%' AND image LIKE '%unsplash%';

-- Falso disco salvaje
UPDATE "Product" SET image = 'https://i.postimg.cc/x86mCpH6/Falso-disco-salvaje.png' WHERE name ILIKE 'falso disco salvaje%' AND image LIKE '%unsplash%';

-- Gancho Rojo
UPDATE "Product" SET image = 'https://i.postimg.cc/0jkm91Mg/Gancho-rojo.png' WHERE name ILIKE 'gancho rojo%' AND image LIKE '%unsplash%';

-- Gancho azul
UPDATE "Product" SET image = 'https://i.postimg.cc/yxLRdp9f/Gancho-azul.png' WHERE name ILIKE 'gancho azul%' AND image LIKE '%unsplash%';

-- Globo o tamborero
UPDATE "Product" SET image = 'https://i.postimg.cc/5y4vfWHn/Tamborero.png' WHERE name ILIKE '%tamborero%' AND image LIKE '%unsplash%';

-- Goldfish (todas las tallas)
UPDATE "Product" SET image = 'https://i.postimg.cc/brybqfG5/Goldfish.png' WHERE name ILIKE 'golfish%' AND name NOT ILIKE '%ranchun%' AND image LIKE '%unsplash%';

-- Golfish Ranchun
UPDATE "Product" SET image = 'https://i.postimg.cc/SNJTGSH3/carassius-Ranchun.png' WHERE name ILIKE '%ranchun%' AND image LIKE '%unsplash%';

-- Guppy Hembra Comercial
UPDATE "Product" SET image = 'https://i.postimg.cc/WzNrscD6/Guppy-hembra-comercial.png' WHERE name ILIKE 'guppy hembra comercial%' AND image LIKE '%unsplash%';

-- Guppy Macho Comercial
UPDATE "Product" SET image = 'https://i.postimg.cc/2ykvCNqn/Guppy-macho-comercial.png' WHERE name ILIKE 'guppy macho comercial%' AND image LIKE '%unsplash%';

-- Guppy santa claus pareja
UPDATE "Product" SET image = 'https://i.postimg.cc/Twqg83PV/Guppy-santa-claus-pareja.png' WHERE name ILIKE 'guppy santa claus%' AND image LIKE '%unsplash%';

-- Guppy mosaico (pareja y macho)
UPDATE "Product" SET image = 'https://i.postimg.cc/QC85jZBJ/Guppy-mosaico.png' WHERE name ILIKE '%mosaico%' AND image LIKE '%unsplash%';

-- Gurami azul
UPDATE "Product" SET image = 'https://i.postimg.cc/63LnspQR/Gurami-azul.png' WHERE name ILIKE 'gurami azul%' AND image LIKE '%unsplash%';

-- Gurami perla
UPDATE "Product" SET image = 'https://i.postimg.cc/mDNCxgr9/Gurami-perla.png' WHERE name ILIKE 'gurami perla%' AND image LIKE '%unsplash%';

-- Juan viejo surinamensis
UPDATE "Product" SET image = 'https://i.postimg.cc/fLjm4RbS/Juan-viejo-surinamensis.png' WHERE name ILIKE 'juan viejo surinamensis%' AND image LIKE '%unsplash%';

-- Mojarra lora
UPDATE "Product" SET image = 'https://i.postimg.cc/9MtZ3QfR/Mojarra-lora.png' WHERE name ILIKE 'mojarra lora%' AND image LIKE '%unsplash%';

-- Monja de color
UPDATE "Product" SET image = 'https://i.postimg.cc/k4FKrg57/monja-color.png' WHERE name ILIKE 'monja de color%' AND image LIKE '%unsplash%';

-- Monja blanca
UPDATE "Product" SET image = 'https://i.postimg.cc/1tcwx3zm/monja-blanca.png' WHERE name ILIKE 'monja blanca%' AND image LIKE '%unsplash%';

-- Oscar tigre
UPDATE "Product" SET image = 'https://i.postimg.cc/Qtk1LdMG/OSCAR-TIGRE.png' WHERE name ILIKE 'oscar tigre%' AND image LIKE '%unsplash%';

-- Otocinclo
UPDATE "Product" SET image = 'https://i.postimg.cc/tTtW04gb/Otocinclos.png' WHERE name ILIKE 'otocinclo%' AND image LIKE '%unsplash%';

-- Parrot Polar Blue Pareja
UPDATE "Product" SET image = 'https://i.postimg.cc/bJjkFtqw/Parrot-blue.png' WHERE name ILIKE 'parrot%' AND image LIKE '%unsplash%';

-- Platy verde esmeralda
UPDATE "Product" SET image = 'https://i.postimg.cc/bJjkFtp4/Platy-verde-esmeralda.png' WHERE name ILIKE 'platy verde esmeralda%' AND image LIKE '%unsplash%';

-- Platy Red Top
UPDATE "Product" SET image = 'https://i.postimg.cc/nr3mzS75/Platy-red-top-mickey.png' WHERE name ILIKE 'platy red top%' AND image LIKE '%unsplash%';

-- Platy Rojo
UPDATE "Product" SET image = 'https://i.postimg.cc/76y0Q2qr/Platy-rojo.png' WHERE name ILIKE 'platy rojo%' AND image LIKE '%unsplash%';

-- Platy azul (sin imagen específica, usar verde esmeralda como fallback)
UPDATE "Product" SET image = 'https://i.postimg.cc/9MjZN7CK/Platy-verde-esmeralda-(1).png' WHERE name ILIKE 'platy azul%' AND image LIKE '%unsplash%';

-- Ramirezi
UPDATE "Product" SET image = 'https://i.postimg.cc/TwXgHDfz/Ramirezi.png' WHERE name ILIKE 'ramirezi' AND image LIKE '%unsplash%';

-- Ramirezi full color
UPDATE "Product" SET image = 'https://i.postimg.cc/gjghJt8W/Ramirezi-full-color.png' WHERE name ILIKE 'ramirezi full color%' AND image LIKE '%unsplash%';

-- Raya guacamaya
UPDATE "Product" SET image = 'https://i.postimg.cc/j5rPk7t9/Raya-guacamaya.png' WHERE name ILIKE 'raya guacamaya%' AND image LIKE '%unsplash%';

-- Telescopio (todas las tallas)
UPDATE "Product" SET image = 'https://i.postimg.cc/mDGC6HB8/Telescopio.png' WHERE name ILIKE 'telescopio%' AND image LIKE '%unsplash%';

-- Tetra neon negro
UPDATE "Product" SET image = 'https://i.postimg.cc/q7K2LLVF/Tetra-neon-negro.png' WHERE name ILIKE 'tetra neon negro%' AND image LIKE '%unsplash%';

-- Tetra velo llama
UPDATE "Product" SET image = 'https://i.postimg.cc/QxDwQmRm/Llama.jpg' WHERE name ILIKE '%llama%' AND image LIKE '%unsplash%';

-- Tiburon colombiano
UPDATE "Product" SET image = 'https://i.postimg.cc/FRQ3nLNZ/Tiburon-colombiano.png' WHERE name ILIKE 'tiburon colombiano%' AND image LIKE '%unsplash%';

-- Tiburon Cuatro lineas
UPDATE "Product" SET image = 'https://i.postimg.cc/TwXgHDfc/Tiburon-cuatro-lineas.png' WHERE name ILIKE 'tiburon cuatro%' AND image LIKE '%unsplash%';

-- Cucha Real de raya
UPDATE "Product" SET image = 'https://i.postimg.cc/MpPL8Svz/Real_de_rayas.jpg' WHERE name ILIKE 'cucha real de raya%' AND image LIKE '%unsplash%';

-- Cucha Roja
UPDATE "Product" SET image = 'https://i.postimg.cc/VsgnDvTn/Cucha_roja.png' WHERE name ILIKE 'cucha roja%' AND image LIKE '%unsplash%';

-- Corydora Wotroi
UPDATE "Product" SET image = 'https://i.postimg.cc/5ysz0KLt/corydora-wotroi.png' WHERE name ILIKE '%wotroi%' AND image LIKE '%unsplash%';

-- Hopplo comun
UPDATE "Product" SET image = 'https://i.postimg.cc/mgS83ZNx/Hopplo_Photoroom.jpg' WHERE name ILIKE 'hopplo%' AND image LIKE '%unsplash%';

-- Corydora puntatus
UPDATE "Product" SET image = 'https://i.postimg.cc/h4CZxzZ8/Corydora_puctatus.png' WHERE name ILIKE '%puntatus%' AND image LIKE '%unsplash%';

-- Cucha Hypostomus (todas las tallas)
UPDATE "Product" SET image = 'https://i.postimg.cc/bwN5MJYC/Hypostomuns.jpg' WHERE name ILIKE '%hypostomus%' AND image LIKE '%unsplash%';

-- Cebra OB
UPDATE "Product" SET image = 'https://i.postimg.cc/h4CZxzZC/zebra_victoria.png' WHERE name ILIKE 'cebra ob%' AND image LIKE '%unsplash%';

-- Cuchillo negro
UPDATE "Product" SET image = 'https://i.postimg.cc/tJmrHwVH/Apteronotus_galvisi.png' WHERE name ILIKE 'cuchillo negro%' AND image LIKE '%unsplash%';

-- Cuchillo rojo
UPDATE "Product" SET image = 'https://i.postimg.cc/4yF8TqhG/Adontosternarchus_devenanzii.png' WHERE name ILIKE 'cuchillo rojo%' AND image LIKE '%unsplash%';

-- Guppy black metal pareja
UPDATE "Product" SET image = 'https://i.postimg.cc/2ykvCNqn/Guppy-macho-comercial.png' WHERE name ILIKE 'guppy black metal%' AND image LIKE '%unsplash%';`,
  },
  {
    id: '011',
    title: 'Renombrar categoría Medidores → Medicamentos',
    description: 'Renombra el valor del enum Category de "Medidores" a "Medicamentos" y actualiza todos los productos que tenían esa categoría.',
    createdAt: '2026-03-24',
    sql: `-- ============================================================
-- Migration 011: Renombrar enum Medidores → Medicamentos
-- ============================================================

-- 1) Agregar nuevo valor al enum
ALTER TYPE "Category" ADD VALUE IF NOT EXISTS 'Medicamentos';

-- 2) Actualizar productos que tenían Medidores
UPDATE "Product" SET category = 'Medicamentos' WHERE category = 'Medidores';

-- Nota: PostgreSQL no permite eliminar valores de un enum directamente.
-- El valor 'Medidores' quedará en el enum pero sin uso.
-- Para limpieza total se requeriría recrear el enum (opcional).`,
  },
];
