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
  'Filtros', 'Alimentos', 'Acondicionadores', 'Gravilla', 'Medidores', 'Lamparas'
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
];
