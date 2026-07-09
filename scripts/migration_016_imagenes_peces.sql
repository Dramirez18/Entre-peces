-- ============================================================
-- Migration 016: Imagenes de peces sin foto (Wikimedia Commons)
-- ============================================================
-- Fotos por nombre cientifico desde upload.wikimedia.org (URLs de
-- archivo original, permiten hotlink y funcionan con no-referrer).
-- Ejecutar en el SQL Editor (RLS bloquea escritura anon).

UPDATE "Product" SET image='https://upload.wikimedia.org/wikipedia/commons/e/ea/Corydoras_simulatus.jpg', "updatedAt"=NOW() WHERE id='corydora_olga_2cm';
UPDATE "Product" SET image='https://upload.wikimedia.org/wikipedia/commons/6/6e/Loricariidae_Peckoltia_sabaji_2.jpg', "updatedAt"=NOW() WHERE id='cucha_guacamaya_8cm';
UPDATE "Product" SET image='https://upload.wikimedia.org/wikipedia/commons/6/6e/Loricariidae_Peckoltia_sabaji_2.jpg', "updatedAt"=NOW() WHERE id='cucha_guacamaya_13cm';
UPDATE "Product" SET image='https://upload.wikimedia.org/wikipedia/commons/f/ff/Eigenmannia_virescens_000.jpg', "updatedAt"=NOW() WHERE id='cuchillo_transparente_8cm';
UPDATE "Product" SET image='https://upload.wikimedia.org/wikipedia/commons/a/ae/DSC_0690_-_Edited.jpg', "updatedAt"=NOW() WHERE id='espada_comun_4cm';
UPDATE "Product" SET image='https://upload.wikimedia.org/wikipedia/commons/1/17/Thoracocharax_stellatus_2zz.jpg', "updatedAt"=NOW() WHERE id='estrigata_gallo_2cm';
UPDATE "Product" SET image='https://upload.wikimedia.org/wikipedia/commons/0/02/Hemiodidae_Hemiodus_sp_%285806481909%29.jpg', "updatedAt"=NOW() WHERE id='hemiodo_colinegro_9cm';
UPDATE "Product" SET image='https://upload.wikimedia.org/wikipedia/commons/4/47/Satanoperca--jurupari.jpg', "updatedAt"=NOW() WHERE id='juan_viejo_jurupari_6cm';
UPDATE "Product" SET image='https://upload.wikimedia.org/wikipedia/commons/0/08/Astronotus_ocellatus.jpg', "updatedAt"=NOW() WHERE id='oscar_cobre_5cm';
UPDATE "Product" SET image='https://upload.wikimedia.org/wikipedia/commons/9/96/Semaprochilodus_insignis.jpg', "updatedAt"=NOW() WHERE id='sapoara_3cm';
UPDATE "Product" SET image='https://upload.wikimedia.org/wikipedia/commons/a/a8/Hyphessobrycon_peruvianus_%2831520%29.png', "updatedAt"=NOW() WHERE id='tetra_aleman_3cm';
UPDATE "Product" SET image='https://upload.wikimedia.org/wikipedia/commons/1/1a/Hal_-_Gymnocorymbus_bondi_-_1.jpg', "updatedAt"=NOW() WHERE id='tetra_rosita_3cm';
UPDATE "Product" SET image='https://upload.wikimedia.org/wikipedia/commons/1/1d/Pimelodus_pictus.jpg', "updatedAt"=NOW() WHERE id='tiburon_tigrito_6cm';
