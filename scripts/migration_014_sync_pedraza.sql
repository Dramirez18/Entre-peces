-- ============================================================
-- Migration 014: Sincronización listado Pedraza (MAYORISTA.pdf)
-- ============================================================
-- RLS reactivado (commit "security: acceso solo-Google"): la anon key
-- no puede escribir. Ejecutar TODO este bloque en el SQL Editor de
-- Supabase (proyecto blqvfrqkzaudrdbxjovt) — el service role bypassa RLS.
-- 68 updates de stock + 2 updates especiales + 15 agotar + 6 altas.
-- ============================================================

-- ── 68 actualizaciones de stock (reactiva si estaba inactivo) ──
UPDATE "Product" SET stock=40, active=true, "updatedAt"=NOW() WHERE id='arawuana_plateada_8cm';
UPDATE "Product" SET stock=100, active=true, "updatedAt"=NOW() WHERE id='bailarina_4cm';
UPDATE "Product" SET stock=50, active=true, "updatedAt"=NOW() WHERE id='bailarina';
UPDATE "Product" SET stock=25, active=true, "updatedAt"=NOW() WHERE id='barbo_rojo';
UPDATE "Product" SET stock=80, active=true, "updatedAt"=NOW() WHERE id='barbos_tigre';
UPDATE "Product" SET stock=6, active=true, "updatedAt"=NOW() WHERE id='barbus_rossy_3cm';
UPDATE "Product" SET stock=5, active=true, "updatedAt"=NOW() WHERE id='betta_multicolor_pareja_4cm';
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='betta_dumbo_pareja_4cm';
UPDATE "Product" SET stock=20, active=true, "updatedAt"=NOW() WHERE id='carpa_koi_2';
UPDATE "Product" SET stock=7, active=true, "updatedAt"=NOW() WHERE id='carpa_koi_11cm';
UPDATE "Product" SET stock=3, active=true, "updatedAt"=NOW() WHERE id='carpa_koi_13cm';
UPDATE "Product" SET stock=200, active=true, "updatedAt"=NOW() WHERE id='catalinas_3cm';
UPDATE "Product" SET stock=450, active=true, "updatedAt"=NOW() WHERE id='danio_cebra_3cm';
UPDATE "Product" SET stock=40, active=true, "updatedAt"=NOW() WHERE id='corydora_loxozono';
UPDATE "Product" SET stock=350, active=true, "updatedAt"=NOW() WHERE id='corydora_melanistus';
UPDATE "Product" SET stock=50, active=true, "updatedAt"=NOW() WHERE id='corydora_melini';
UPDATE "Product" SET stock=150, active=true, "updatedAt"=NOW() WHERE id='cucha_albina_lisa_5cm';
UPDATE "Product" SET stock=15, active=true, "updatedAt"=NOW() WHERE id='cucha_cebra_4cm';
UPDATE "Product" SET stock=30, active=true, "updatedAt"=NOW() WHERE id='cucha_cebra_fina';
UPDATE "Product" SET stock=20, active=true, "updatedAt"=NOW() WHERE id='cucha_cebra_fina_2';
UPDATE "Product" SET stock=30, active=true, "updatedAt"=NOW() WHERE id='cucha_guacacebra_5cm';
UPDATE "Product" SET stock=5, active=true, "updatedAt"=NOW() WHERE id='cucha_guacamaya_8cm';
UPDATE "Product" SET stock=4, active=true, "updatedAt"=NOW() WHERE id='cucha_guacamaya_13cm';
UPDATE "Product" SET stock=70, active=true, "updatedAt"=NOW() WHERE id='cucha_hypsotomo';
UPDATE "Product" SET stock=20, active=true, "updatedAt"=NOW() WHERE id='cucha_mariposa_10cm';
UPDATE "Product" SET stock=200, active=true, "updatedAt"=NOW() WHERE id='cucha_pina';
UPDATE "Product" SET stock=20, active=true, "updatedAt"=NOW() WHERE id='cucha_roja';
UPDATE "Product" SET stock=40, active=true, "updatedAt"=NOW() WHERE id='cucha_xenocara';
UPDATE "Product" SET stock=50, active=true, "updatedAt"=NOW() WHERE id='cucha_xenocara_negra_4cm';
UPDATE "Product" SET stock=40, active=true, "updatedAt"=NOW() WHERE id='cuchillo_falso_negro_7cm';
UPDATE "Product" SET stock=15, active=true, "updatedAt"=NOW() WHERE id='cuchillo_negro';
UPDATE "Product" SET stock=15, active=true, "updatedAt"=NOW() WHERE id='cuchillo_negro_12cm';
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='danio_perla_6cm';
UPDATE "Product" SET stock=80, active=true, "updatedAt"=NOW() WHERE id='dora_de_punto_5cm';
UPDATE "Product" SET stock=20, active=true, "updatedAt"=NOW() WHERE id='escalar_4cm';
UPDATE "Product" SET stock=15, active=true, "updatedAt"=NOW() WHERE id='escalar';
UPDATE "Product" SET stock=15, active=true, "updatedAt"=NOW() WHERE id='espada_tuxedo_4cm';
UPDATE "Product" SET stock=8, active=true, "updatedAt"=NOW() WHERE id='falso_disco_salvaje_2';
UPDATE "Product" SET stock=6, active=true, "updatedAt"=NOW() WHERE id='festivum_7cm';
UPDATE "Product" SET stock=4, active=true, "updatedAt"=NOW() WHERE id='garra_rufa_4_5cm';
UPDATE "Product" SET stock=20, active=true, "updatedAt"=NOW() WHERE id='golfish_2';
UPDATE "Product" SET stock=35, active=true, "updatedAt"=NOW() WHERE id='golfish_4';
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='guppy_dragon_pareja_3cm';
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='guppy_full_black_pareja_2cm';
UPDATE "Product" SET stock=20, active=true, "updatedAt"=NOW() WHERE id='guppy_pareja_gama_media';
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='guppy_santa_claus_pareja';
UPDATE "Product" SET stock=50, active=true, "updatedAt"=NOW() WHERE id='hemiodo_colinegro_9cm';
UPDATE "Product" SET stock=2, active=true, "updatedAt"=NOW() WHERE id='juan_viejo_surinamensis';
UPDATE "Product" SET stock=2, active=true, "updatedAt"=NOW() WHERE id='juan_viejo_surinamensis_2';
UPDATE "Product" SET stock=3, active=true, "updatedAt"=NOW() WHERE id='juan_viejo_winimirelli_20cm';
UPDATE "Product" SET stock=30, active=true, "updatedAt"=NOW() WHERE id='loricaria_7cm';
UPDATE "Product" SET stock=15, active=true, "updatedAt"=NOW() WHERE id='luminosa_7cm';
UPDATE "Product" SET stock=20, active=true, "updatedAt"=NOW() WHERE id='monja_blanca';
UPDATE "Product" SET stock=200, active=true, "updatedAt"=NOW() WHERE id='monja_de_color';
UPDATE "Product" SET stock=20, active=true, "updatedAt"=NOW() WHERE id='monja_negra_3cm';
UPDATE "Product" SET stock=40, active=true, "updatedAt"=NOW() WHERE id='oscar_cobre_5cm';
UPDATE "Product" SET stock=70, active=true, "updatedAt"=NOW() WHERE id='platy_red_top_2cm';
UPDATE "Product" SET stock=30, active=true, "updatedAt"=NOW() WHERE id='platy_verde_esmeralda';
UPDATE "Product" SET stock=8, active=true, "updatedAt"=NOW() WHERE id='ramirezi_azul_electrico_3_5cm';
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='ramirezi_jumbo_full_color_4cm';
UPDATE "Product" SET stock=6, active=true, "updatedAt"=NOW() WHERE id='ramirezi_gold_de_velo_4cm';
UPDATE "Product" SET stock=100, active=true, "updatedAt"=NOW() WHERE id='tetra_cola_de_tijera_3cm';
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='tetra_colombiano_3cm';
UPDATE "Product" SET stock=200, active=true, "updatedAt"=NOW() WHERE id='tetra_hilo_negro_2cm';
UPDATE "Product" SET stock=8, active=true, "updatedAt"=NOW() WHERE id='tetra_llama_4cm';
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='tetra_pinguino_6cm';
UPDATE "Product" SET stock=300, active=true, "updatedAt"=NOW() WHERE id='tetra_rojito_fino_2_cm';
UPDATE "Product" SET stock=200, active=true, "updatedAt"=NOW() WHERE id='tetra_rubi_fino_2cm';

-- ── 2 updates especiales (reactivar + cambiar talla/precio) ──
UPDATE "Product" SET size='2 cm', stock=600, active=true, "updatedAt"=NOW() WHERE id='otocinclo';
UPDATE "Product" SET size='2 cm', stock=2000, price=21120, active=true, "updatedAt"=NOW() WHERE id='tetra_cardenal_mediano';

-- ── 15 productos a agotar (no vienen en el PDF) ──
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='ciclido_damazoni';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='corydora_concolor';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='cucha_hypostomo';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='cucha_lapicero_6cm';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='cucha_lapicero';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='cucha_xenocara_2';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='disco_checkboard';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='disco_red_golden_diamond';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='disco_white_butterfly_4cm';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='dragon_chino_20cm';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='guppy_pareja_mosaico_2cm';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='juan_viejo_surinamensis_6cm';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='melanochromis_auratus_4cm';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='ramirezi_german_blue_3_5cm';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='tetra_characidium_4cm';

-- ── 6 altas nuevas ──
INSERT INTO "Product" ("id","name","scientificName","description","price","category","image","stock","size","active","createdAt","updatedAt")
VALUES
  ('corydora_olga_2cm','Corydora olga','Corydoras simulatus','Corydora olga - Corydoras simulatus. Talla 2 cm.',4000,'Peces','',300,'2 cm',true,NOW(),NOW()),
  ('cuchillo_transparente_8cm','Cuchillo transparente','Eigenmannia virescens','Cuchillo transparente - Eigenmannia virescens. Talla 8 cm.',4600,'Peces','',40,'8 cm',true,NOW(),NOW()),
  ('estrigata_gallo_2cm','Estrigata gallo','Thoracocharax stellatus','Estrigata gallo - Thoracocharax stellatus. Talla 2 cm.',2700,'Peces','',80,'2 cm',true,NOW(),NOW()),
  ('tetra_aleman_3cm','Tetra Aleman','Hyphessobrycon peruvianus','Tetra Aleman - Hyphessobrycon peruvianus. Talla 3 cm.',5000,'Peces','',200,'3 cm',true,NOW(),NOW()),
  ('tetra_neon_1_5cm','Tetra Neon','Paracheirodon innesi','Tetra Neon - Paracheirodon innesi. Talla 1.5 cm.',1760,'Peces','',2000,'1.5 cm',true,NOW(),NOW()),
  ('tetra_cardenal_jumbo_3cm','Tetra Cardenal Jumbo x 12 und','Paracheirodon axelrodi','Tetra Cardenal Jumbo x 12 und - Paracheirodon axelrodi. Talla 3 cm.',22800,'Peces','https://i.postimg.cc/52wJWYbC/cardenal.jpg',5200,'3 cm',true,NOW(),NOW())
ON CONFLICT ("id") DO NOTHING;
