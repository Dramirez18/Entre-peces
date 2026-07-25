-- ============================================================
-- Migration 018: Sincronización listado Pedraza (Mayoristas-3.pdf)
-- ============================================================
-- RLS reactivado: la anon key no puede escribir. Ejecutar en el
-- SQL Editor de Supabase (proyecto blqvfrqkzaudrdbxjovt).
-- Mayoristas-3 = listado anterior + adiciones. 1 update de stock
-- (Otocinclo 200->1000) + 5 altas nuevas (4 Disco amazonico
-- silvestre con precio mayorista+30k, + Tetra corazon sangrante).
-- ============================================================

-- ── UPDATE de stock ──
UPDATE "Product" SET stock=1000, active=true, "updatedAt"=NOW() WHERE id='otocinclo';

-- ── ALTAS nuevas (5) ──
INSERT INTO "Product" ("id","name","scientificName","description","price","category","image","stock","size","active","createdAt","updatedAt")
VALUES
  ('disco_amazonico_15cm','Disco amazonico','Symphysodon sp','Disco amazonico - Symphysodon sp. Talla 15 cm.',120000,'Peces','',25,'15 cm',true,NOW(),NOW()),
  ('disco_amazonico_13cm','Disco amazonico','Symphysodon sp','Disco amazonico - Symphysodon sp. Talla 13 cm.',110000,'Peces','',25,'13 cm',true,NOW(),NOW()),
  ('disco_amazonico_10cm','Disco amazonico','Symphysodon sp','Disco amazonico - Symphysodon sp. Talla 10 cm.',100000,'Peces','',10,'10 cm',true,NOW(),NOW()),
  ('disco_amazonico_8cm','Disco amazonico','Symphysodon sp','Disco amazonico - Symphysodon sp. Talla 8 cm.',90000,'Peces','',10,'8 cm',true,NOW(),NOW()),
  ('tetra_corazon_sangrante_2_5cm','Tetra corazon sangrante','Hyphessobrycon erythrostigma','Tetra corazon sangrante - Hyphessobrycon erythrostigma. Talla 2.5 cm.',4600,'Peces','',200,'2.5 cm',true,NOW(),NOW())
ON CONFLICT ("id") DO NOTHING;
