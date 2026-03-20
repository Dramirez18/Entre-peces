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
];
