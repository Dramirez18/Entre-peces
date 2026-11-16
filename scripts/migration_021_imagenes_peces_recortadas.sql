-- ============================================================
-- Migration 021: Fotos recortadas (sin fondo) para peces sin foto
-- ============================================================
-- Asigna foto a 14 productos de peces activos que tenian la imagen
-- vacia (se veian con la generica de Unsplash). Las imagenes son WebP
-- con fondo transparente y viven en public/peces/ (se sirven desde el
-- propio dominio: /peces/<archivo>.webp).
--
-- IMPORTANTE: ejecutar DESPUES de desplegar public/peces/ a produccion,
-- si no las tarjetas caeran a la imagen generica (onError).
-- Ejecutar en el SQL Editor (RLS bloquea escritura anon).
--
-- Creditos de las fotos de terceros: public/peces/CREDITOS.md
--
-- Quedan SIN foto (pendientes de una foto adecuada):
--   bailarina_oranda_tricolor_5cm, corydora_decker_3cm,
--   disco_white_diamond_seleccionado_6_5cm, escalar_de_velo_6cm,
--   escalar_rosado_3cm, espada_doble_cola_4cm, oscar_albino_6cm

-- Fotos aportadas por el usuario
UPDATE "Product" SET image='/peces/agujones.webp', "updatedAt"=NOW() WHERE id='agujones_10cm';
UPDATE "Product" SET image='/peces/crenicara_de_velo_xl.webp', "updatedAt"=NOW() WHERE id='crenicara_de_velo_xl_4_5cm';
UPDATE "Product" SET image='/peces/disco_blue_diamond.webp', "updatedAt"=NOW() WHERE id='disco_blue_diamond_pequeno_defecto_6cm';
UPDATE "Product" SET image='/peces/disco_blue_diamond.webp', "updatedAt"=NOW() WHERE id='disco_blue_diamond_pequeno_defecto_5cm';

-- Fotos de Wikimedia Commons (recortadas; ver creditos)
UPDATE "Product" SET image='/peces/escalar_altum.webp', "updatedAt"=NOW() WHERE id='escalar_altum_3cm';
UPDATE "Product" SET image='/peces/hemiodo_colirojo.webp', "updatedAt"=NOW() WHERE id='hemiodo_colirojo_8cm';
UPDATE "Product" SET image='/peces/leporino_3_puntos.webp', "updatedAt"=NOW() WHERE id='leporino_3_puntos_3cm';
UPDATE "Product" SET image='/peces/tetra_silver.webp', "updatedAt"=NOW() WHERE id='tetra_silver_2_5cm';
UPDATE "Product" SET image='/peces/colisa_roja_macho.webp', "updatedAt"=NOW() WHERE id='colisa_roja_macho_5cm';
UPDATE "Product" SET image='/peces/moneda.webp', "updatedAt"=NOW() WHERE id='moneda_3_5cm';
UPDATE "Product" SET image='/peces/pez_hoja.webp', "updatedAt"=NOW() WHERE id='pez_hoja_4cm';
UPDATE "Product" SET image='/peces/pez_hoja.webp', "updatedAt"=NOW() WHERE id='pez_hoja_7cm';
UPDATE "Product" SET image='/peces/tetra_neon.webp', "updatedAt"=NOW() WHERE id='tetra_neon_1_5cm';
UPDATE "Product" SET image='/peces/tetra_rojito.webp', "updatedAt"=NOW() WHERE id='tetra_rojito_2cm';
