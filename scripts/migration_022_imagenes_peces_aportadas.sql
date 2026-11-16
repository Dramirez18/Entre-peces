-- ============================================================
-- Migration 022: Fotos aportadas por el propietario (6 peces)
-- ============================================================
-- Asigna foto a 6 productos de peces activos que seguian sin imagen
-- tras la migracion 021. Las imagenes son WebP con fondo transparente
-- en public/peces/ (se sirven desde el propio dominio).
--
-- IMPORTANTE: ejecutar DESPUES de desplegar public/peces/ a produccion,
-- si no las tarjetas caeran a la imagen generica (onError).
-- Ejecutar en el SQL Editor (RLS bloquea escritura anon).
--
-- Queda SIN foto: bailarina_oranda_tricolor_5cm

UPDATE "Product" SET image='/peces/espada_doble_cola.webp', "updatedAt"=NOW() WHERE id='espada_doble_cola_4cm';
UPDATE "Product" SET image='/peces/oscar_albino.webp', "updatedAt"=NOW() WHERE id='oscar_albino_6cm';
UPDATE "Product" SET image='/peces/corydora_decker.webp', "updatedAt"=NOW() WHERE id='corydora_decker_3cm';
UPDATE "Product" SET image='/peces/disco_white_diamond.webp', "updatedAt"=NOW() WHERE id='disco_white_diamond_seleccionado_6_5cm';
UPDATE "Product" SET image='/peces/escalar_de_velo.webp', "updatedAt"=NOW() WHERE id='escalar_de_velo_6cm';
UPDATE "Product" SET image='/peces/escalar_rosado.webp', "updatedAt"=NOW() WHERE id='escalar_rosado_3cm';
