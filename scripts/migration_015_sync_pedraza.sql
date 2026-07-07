-- ============================================================
-- Migration 015: Sincronización listado Pedraza (MAYORISTA-1.pdf)
-- ============================================================
-- RLS reactivado: la anon key no puede escribir. Ejecutar TODO este
-- bloque en el SQL Editor de Supabase (proyecto blqvfrqkzaudrdbxjovt).
-- 73 updates de stock + 9 agotar + 5 reactivar/resize (variantes de
-- talla, no se crean duplicados) + 5 altas nuevas reales.
-- ============================================================

-- ── UPDATES de stock (solo cambios reales; reactiva si estaba inactivo) ──
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='arawuana_plateada_8cm';
UPDATE "Product" SET stock=20, active=true, "updatedAt"=NOW() WHERE id='bailarina';
UPDATE "Product" SET stock=36, active=true, "updatedAt"=NOW() WHERE id='bailarina_2';
UPDATE "Product" SET stock=18, active=true, "updatedAt"=NOW() WHERE id='bailarina_7_cm';
UPDATE "Product" SET stock=15, active=true, "updatedAt"=NOW() WHERE id='bailarina_8_cm';
UPDATE "Product" SET stock=8, active=true, "updatedAt"=NOW() WHERE id='bailarina_9_cm';
UPDATE "Product" SET stock=9, active=true, "updatedAt"=NOW() WHERE id='bailarina_10_cm';
UPDATE "Product" SET stock=15, active=true, "updatedAt"=NOW() WHERE id='bailarina_pelota_de_golf_5cm';
UPDATE "Product" SET stock=5, active=true, "updatedAt"=NOW() WHERE id='bailarina_ojo_de_burbuja_4cm';
UPDATE "Product" SET stock=20, active=true, "updatedAt"=NOW() WHERE id='bailarina_ojo_de_burbuja_5cm';
UPDATE "Product" SET stock=20, active=true, "updatedAt"=NOW() WHERE id='barbo_rojo';
UPDATE "Product" SET stock=5, active=true, "updatedAt"=NOW() WHERE id='barbus_rossy_3cm';
UPDATE "Product" SET stock=3, active=true, "updatedAt"=NOW() WHERE id='betta_multicolor_pareja_4cm';
UPDATE "Product" SET stock=6, active=true, "updatedAt"=NOW() WHERE id='betta_dumbo_pareja_4cm';
UPDATE "Product" SET stock=200, active=true, "updatedAt"=NOW() WHERE id='danio_cebra_3cm';
UPDATE "Product" SET stock=80, active=true, "updatedAt"=NOW() WHERE id='corydora_concolor';
UPDATE "Product" SET stock=20, active=true, "updatedAt"=NOW() WHERE id='corydora_loxozono';
UPDATE "Product" SET stock=50, active=true, "updatedAt"=NOW() WHERE id='corydora_melanistus';
UPDATE "Product" SET stock=20, active=true, "updatedAt"=NOW() WHERE id='corydora_melini';
UPDATE "Product" SET stock=250, active=true, "updatedAt"=NOW() WHERE id='corydora_olga_2cm';
UPDATE "Product" SET stock=300, active=true, "updatedAt"=NOW() WHERE id='crenicara';
UPDATE "Product" SET stock=100, active=true, "updatedAt"=NOW() WHERE id='cucha_albina_lisa_5cm';
UPDATE "Product" SET stock=20, active=true, "updatedAt"=NOW() WHERE id='cucha_cebra_fina';
UPDATE "Product" SET stock=15, active=true, "updatedAt"=NOW() WHERE id='cucha_cebra_fina_2';
UPDATE "Product" SET stock=15, active=true, "updatedAt"=NOW() WHERE id='cucha_guacacebra_5cm';
UPDATE "Product" SET stock=30, active=true, "updatedAt"=NOW() WHERE id='cucha_hypsotomo';
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='cucha_mariposa_10cm';
UPDATE "Product" SET stock=50, active=true, "updatedAt"=NOW() WHERE id='cucha_pina';
UPDATE "Product" SET stock=20, active=true, "updatedAt"=NOW() WHERE id='cucha_xenocara';
UPDATE "Product" SET stock=5, active=true, "updatedAt"=NOW() WHERE id='cucha_xenocara_azul_5cm';
UPDATE "Product" SET stock=5, active=true, "updatedAt"=NOW() WHERE id='cucha_xenocara_azul_8cm';
UPDATE "Product" SET stock=20, active=true, "updatedAt"=NOW() WHERE id='cucha_xenocara_negra_4cm';
UPDATE "Product" SET stock=30, active=true, "updatedAt"=NOW() WHERE id='cuchillo_falso_negro_7cm';
UPDATE "Product" SET stock=50, active=true, "updatedAt"=NOW() WHERE id='dora_de_punto_5cm';
UPDATE "Product" SET stock=50, active=true, "updatedAt"=NOW() WHERE id='dora_de_raya_6cm';
UPDATE "Product" SET stock=25, active=true, "updatedAt"=NOW() WHERE id='escalar';
UPDATE "Product" SET stock=6, active=true, "updatedAt"=NOW() WHERE id='escalar_leopard_4cm';
UPDATE "Product" SET stock=5, active=true, "updatedAt"=NOW() WHERE id='escalar_red_devil_4cm';
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='espada_tuxedo_4cm';
UPDATE "Product" SET stock=50, active=true, "updatedAt"=NOW() WHERE id='estrigata_gallo_2cm';
UPDATE "Product" SET stock=15, active=true, "updatedAt"=NOW() WHERE id='gancho_azul';
UPDATE "Product" SET stock=3, active=true, "updatedAt"=NOW() WHERE id='garra_rufa_4_5cm';
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='golfish_2';
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='golfish_4';
UPDATE "Product" SET stock=8, active=true, "updatedAt"=NOW() WHERE id='guppy_dragon_pareja_3cm';
UPDATE "Product" SET stock=8, active=true, "updatedAt"=NOW() WHERE id='guppy_full_black_pareja_2cm';
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='guppy_pareja_gama_media';
UPDATE "Product" SET stock=8, active=true, "updatedAt"=NOW() WHERE id='guppy_santa_claus_pareja';
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='hemiodo_colinegro_9cm';
UPDATE "Product" SET stock=100, active=true, "updatedAt"=NOW() WHERE id='juan_viejo_surinamensis_4cm';
UPDATE "Product" SET stock=20, active=true, "updatedAt"=NOW() WHERE id='juan_viejo_surinamensis_6cm';
UPDATE "Product" SET stock=6, active=true, "updatedAt"=NOW() WHERE id='labeo_albino_5cm';
UPDATE "Product" SET stock=20, active=true, "updatedAt"=NOW() WHERE id='loricaria_7cm';
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='luminosa_7cm';
UPDATE "Product" SET stock=100, active=true, "updatedAt"=NOW() WHERE id='monja_de_color';
UPDATE "Product" SET stock=25, active=true, "updatedAt"=NOW() WHERE id='oscar_cobre_5cm';
UPDATE "Product" SET stock=200, active=true, "updatedAt"=NOW() WHERE id='otocinclo';
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='platy_azul';
UPDATE "Product" SET stock=50, active=true, "updatedAt"=NOW() WHERE id='platy_red_top_2cm';
UPDATE "Product" SET stock=15, active=true, "updatedAt"=NOW() WHERE id='platy_verde_esmeralda';
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='pulcher_o_kribensis_3_5cm';
UPDATE "Product" SET stock=5, active=true, "updatedAt"=NOW() WHERE id='ramirezi_azul_electrico_3_5cm';
UPDATE "Product" SET stock=5, active=true, "updatedAt"=NOW() WHERE id='ramirezi_gold_de_velo_4cm';
UPDATE "Product" SET stock=150, active=true, "updatedAt"=NOW() WHERE id='telescopio_3';
UPDATE "Product" SET stock=20, active=true, "updatedAt"=NOW() WHERE id='telescopio_4';
UPDATE "Product" SET stock=50, active=true, "updatedAt"=NOW() WHERE id='tetra_aleman_3cm';
UPDATE "Product" SET stock=200, active=true, "updatedAt"=NOW() WHERE id='tetra_cardenal_jumbo_3cm';
UPDATE "Product" SET stock=50, active=true, "updatedAt"=NOW() WHERE id='tetra_cola_de_tijera_3cm';
UPDATE "Product" SET stock=100, active=true, "updatedAt"=NOW() WHERE id='tetra_dos_puntos_4cm';
UPDATE "Product" SET stock=900, active=true, "updatedAt"=NOW() WHERE id='tetra_pencil';
UPDATE "Product" SET stock=100, active=true, "updatedAt"=NOW() WHERE id='tetra_rojito_fino_2_cm';
UPDATE "Product" SET stock=100, active=true, "updatedAt"=NOW() WHERE id='tetra_rubi_fino_2cm';
UPDATE "Product" SET stock=80, active=true, "updatedAt"=NOW() WHERE id='tiburon_cuatro_lineas';

-- ── AGOTAR (9) ──
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='acara_azul';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='bailarina_4cm';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='danio_perla_6cm';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='disco_turquesa';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='escalar_4cm';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='labeo_arcoiris_6cm';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='ramirezi_jumbo_full_color_4cm';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='raya_histrix_20cm';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='tetra_neon_1_5cm';

-- ── Variantes de solo-talla: reactivar existente + cambiar talla (5) ──
UPDATE "Product" SET size='2 cm', stock=50, price=8000, active=true, name='Apistogramma viejita', "updatedAt"=NOW() WHERE id='apistogramma_viejita2';
UPDATE "Product" SET size='3 cm', stock=50, price=11000, active=true, name='Apistogramma viejita', "updatedAt"=NOW() WHERE id='apistogramma_viejita_3';
UPDATE "Product" SET size='3.5 cm', stock=50, price=27000, active=true, "updatedAt"=NOW() WHERE id='cucha_diamante_azul_l_128';
UPDATE "Product" SET size='5 cm', stock=40, price=11000, active=true, "updatedAt"=NOW() WHERE id='juan_viejo_daemon_special_18cm';
UPDATE "Product" SET size='4 cm', stock=50, price=7000, active=true, "updatedAt"=NOW() WHERE id='oscar_tigre';

-- ── ALTAS nuevas reales (5) ──
INSERT INTO "Product" ("id","name","scientificName","description","price","category","image","stock","size","active","createdAt","updatedAt")
VALUES
  ('espada_comun_4cm','Espada comun','Xiphophorus hellerii sp','Espada comun - Xiphophorus hellerii sp. Talla 4 cm.',6000,'Peces','',50,'4 cm',true,NOW(),NOW()),
  ('gancho_brujita_5cm','Gancho brujita','','Gancho brujita. Talla 5 cm.',5000,'Peces','',30,'5 cm',true,NOW(),NOW()),
  ('juan_viejo_jurupari_6cm','Juan viejo jurupari','Satanoperca jurupari','Juan viejo jurupari - Satanoperca jurupari. Talla 6 cm.',7000,'Peces','',30,'6 cm',true,NOW(),NOW()),
  ('sapoara_3cm','Sapoara','Semaprochilodus laticeps','Sapoara - Semaprochilodus laticeps. Talla 3 cm.',21000,'Peces','',50,'3 cm',true,NOW(),NOW()),
  ('tiburon_tigrito_6cm','Tiburon Tigrito','Pimelodus pictus','Tiburon Tigrito - Pimelodus pictus. Talla 6 cm.',11000,'Peces','',90,'6 cm',true,NOW(),NOW())
ON CONFLICT ("id") DO NOTHING;
