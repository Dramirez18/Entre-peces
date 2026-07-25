-- ============================================================
-- Migration 019: Sincronización listado Pedraza (MAYORISTAS-4.pdf)
-- ============================================================
-- RLS reactivado: la anon key no puede escribir. Ejecutar en el
-- SQL Editor de Supabase (proyecto blqvfrqkzaudrdbxjovt).
-- Listado corto: 66 updates de stock + 33 agotados + 2 altas
-- (Escalar Altum silvestre 2.5/3cm, fórmula retail ×2+1000).
-- ============================================================

-- ── UPDATES de stock (solo cambios reales; reactiva si inactivo) ──
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='apistogramma_viejita2';
UPDATE "Product" SET stock=20, active=true, "updatedAt"=NOW() WHERE id='apistogramma_viejita_3';
UPDATE "Product" SET stock=1, active=true, "updatedAt"=NOW() WHERE id='arawuana_plateada_8cm';
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='bailarina';
UPDATE "Product" SET stock=15, active=true, "updatedAt"=NOW() WHERE id='bailarina_2';
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='bailarina_7_cm';
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='bailarina_8_cm';
UPDATE "Product" SET stock=5, active=true, "updatedAt"=NOW() WHERE id='bailarina_9_cm';
UPDATE "Product" SET stock=3, active=true, "updatedAt"=NOW() WHERE id='bailarina_pelota_de_golf_5cm';
UPDATE "Product" SET stock=2, active=true, "updatedAt"=NOW() WHERE id='barbus_oro_2cm';
UPDATE "Product" SET stock=15, active=true, "updatedAt"=NOW() WHERE id='barbo_rojo';
UPDATE "Product" SET stock=50, active=true, "updatedAt"=NOW() WHERE id='barbos_tigre';
UPDATE "Product" SET stock=40, active=true, "updatedAt"=NOW() WHERE id='barbus_verde';
UPDATE "Product" SET stock=3, active=true, "updatedAt"=NOW() WHERE id='barbus_rossy_3cm';
UPDATE "Product" SET stock=15, active=true, "updatedAt"=NOW() WHERE id='carpa_koi_2';
UPDATE "Product" SET stock=5, active=true, "updatedAt"=NOW() WHERE id='carpa_koi_11cm';
UPDATE "Product" SET stock=50, active=true, "updatedAt"=NOW() WHERE id='catalinas_3cm';
UPDATE "Product" SET stock=50, active=true, "updatedAt"=NOW() WHERE id='danio_cebra_3cm';
UPDATE "Product" SET stock=2, active=true, "updatedAt"=NOW() WHERE id='ciclido_trofeo_4cm';
UPDATE "Product" SET stock=60, active=true, "updatedAt"=NOW() WHERE id='corydora_concolor';
UPDATE "Product" SET stock=50, active=true, "updatedAt"=NOW() WHERE id='cucha_albina_lisa_5cm';
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='cucha_cebra_4cm';
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='cucha_cebra_fina';
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='cucha_cebra_fina_2';
UPDATE "Product" SET stock=45, active=true, "updatedAt"=NOW() WHERE id='cucha_diamante_azul_l_128';
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='cucha_guacacebra_5cm';
UPDATE "Product" SET stock=3, active=true, "updatedAt"=NOW() WHERE id='cucha_guacamaya_13cm';
UPDATE "Product" SET stock=20, active=true, "updatedAt"=NOW() WHERE id='cucha_pina';
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='cuchillo_falso_negro_7cm';
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='cuchillo_negro_12cm';
UPDATE "Product" SET stock=5, active=true, "updatedAt"=NOW() WHERE id='disco_amazonico_10cm';
UPDATE "Product" SET stock=20, active=true, "updatedAt"=NOW() WHERE id='dora_de_punto_5cm';
UPDATE "Product" SET stock=30, active=true, "updatedAt"=NOW() WHERE id='dora_de_raya_6cm';
UPDATE "Product" SET stock=5, active=true, "updatedAt"=NOW() WHERE id='escalar';
UPDATE "Product" SET stock=3, active=true, "updatedAt"=NOW() WHERE id='escalar_leopard_4cm';
UPDATE "Product" SET stock=20, active=true, "updatedAt"=NOW() WHERE id='estrigata_gallo_2cm';
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='gancho_azul';
UPDATE "Product" SET stock=3, active=true, "updatedAt"=NOW() WHERE id='guppy_full_black_pareja_2cm';
UPDATE "Product" SET stock=20, active=true, "updatedAt"=NOW() WHERE id='gurami_azul';
UPDATE "Product" SET stock=15, active=true, "updatedAt"=NOW() WHERE id='gurami_paraiso';
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='gurami_perla';
UPDATE "Product" SET stock=20, active=true, "updatedAt"=NOW() WHERE id='juan_viejo_daemon_special_18cm';
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='juan_viejo_jurupari_6cm';
UPDATE "Product" SET stock=40, active=true, "updatedAt"=NOW() WHERE id='juan_viejo_surinamensis_4cm';
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='juan_viejo_surinamensis_6cm';
UPDATE "Product" SET stock=4, active=true, "updatedAt"=NOW() WHERE id='labeo_albino_5cm';
UPDATE "Product" SET stock=15, active=true, "updatedAt"=NOW() WHERE id='monja_blanca';
UPDATE "Product" SET stock=50, active=true, "updatedAt"=NOW() WHERE id='monja_de_color';
UPDATE "Product" SET stock=15, active=true, "updatedAt"=NOW() WHERE id='monja_negra_3cm';
UPDATE "Product" SET stock=5, active=true, "updatedAt"=NOW() WHERE id='oscar_cobre_5cm';
UPDATE "Product" SET stock=150, active=true, "updatedAt"=NOW() WHERE id='otocinclo';
UPDATE "Product" SET stock=30, active=true, "updatedAt"=NOW() WHERE id='platy_red_top_2cm';
UPDATE "Product" SET stock=10, active=true, "updatedAt"=NOW() WHERE id='platy_verde_esmeralda';
UPDATE "Product" SET stock=2, active=true, "updatedAt"=NOW() WHERE id='pulcher_o_kribensis_3_5cm';
UPDATE "Product" SET stock=40, active=true, "updatedAt"=NOW() WHERE id='sapoara_3cm';
UPDATE "Product" SET stock=100, active=true, "updatedAt"=NOW() WHERE id='telescopio_3';
UPDATE "Product" SET stock=50, active=true, "updatedAt"=NOW() WHERE id='tetra_cardenal_mediano';
UPDATE "Product" SET stock=50, active=true, "updatedAt"=NOW() WHERE id='tetra_corazon_sangrante_2_5cm';
UPDATE "Product" SET stock=90, active=true, "updatedAt"=NOW() WHERE id='tetra_dos_puntos_4cm';
UPDATE "Product" SET stock=50, active=true, "updatedAt"=NOW() WHERE id='tetra_hilo_negro_2cm';
UPDATE "Product" SET stock=5, active=true, "updatedAt"=NOW() WHERE id='tetra_llama_4cm';
UPDATE "Product" SET stock=100, active=true, "updatedAt"=NOW() WHERE id='tetra_pencil';
UPDATE "Product" SET stock=5, active=true, "updatedAt"=NOW() WHERE id='tetra_pinguino_6cm';
UPDATE "Product" SET stock=50, active=true, "updatedAt"=NOW() WHERE id='tetra_rosita_3cm';
UPDATE "Product" SET stock=50, active=true, "updatedAt"=NOW() WHERE id='tiburon_cuatro_lineas';
UPDATE "Product" SET stock=20, active=true, "updatedAt"=NOW() WHERE id='tiburon_tigrito_6cm';

-- ── AGOTAR (33) ──
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='bailarina_10_cm';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='ciclido_texas';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='corydora_loxozono';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='corydora_melini';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='corydora_olga_2cm';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='crenicara';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='cucha_guacamaya_8cm';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='cucha_hypsotomo';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='cucha_mariposa_10cm';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='cucha_roja_7cm';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='cucha_roja';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='cucha_xenocara';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='cucha_xenocara_negra_4cm';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='cuchillo_negro';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='cuchillo_transparente_8cm';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='disco_amazonico_8cm';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='espada_comun_4cm';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='espada_tuxedo_4cm';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='falso_disco_salvaje_2';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='golfish_4';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='golfish_2';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='guppy_dragon_pareja_3cm';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='guppy_pareja_gama_media';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='guppy_santa_claus_pareja';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='gurami_albino_5_cm';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='gurami_miel_5cm';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='hemiodo_colinegro_9cm';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='loricaria_7cm';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='platy_azul';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='platy_rojo';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='tetra_cola_de_tijera_3cm';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='tetra_rojito_fino_2_cm';
UPDATE "Product" SET stock=0, active=false, "updatedAt"=NOW() WHERE id='tetra_rubi_fino_2cm';

-- ── ALTAS nuevas (2) ──
INSERT INTO "Product" ("id","name","scientificName","description","price","category","image","stock","size","active","createdAt","updatedAt")
VALUES
  ('escalar_altum_2_5cm','Escalar Altum','Pterophyllum altum','Escalar Altum - Pterophyllum altum. Talla 2.5 cm.',41000,'Peces','',30,'2.5 cm',true,NOW(),NOW()),
  ('escalar_altum_3cm','Escalar Altum','Pterophyllum altum','Escalar Altum - Pterophyllum altum. Talla 3 cm.',51000,'Peces','',30,'3 cm',true,NOW(),NOW())
ON CONFLICT ("id") DO NOTHING;
