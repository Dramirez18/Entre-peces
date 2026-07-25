-- ============================================================
-- Migration 020: Actualización noticias AUNAP (sección Conocimiento)
-- ============================================================
-- Refresca las 3 noticias de la tabla AunapNews con las más recientes
-- del feed oficial (https://aunap.gov.co/feed/). La app las ordena por
-- createdAt DESC, por eso se usan las fechas reales de publicación.
-- Contenido rutinario (se repite cada pocas semanas). Ejecutar en el
-- SQL Editor de Supabase (RLS bloquea escritura anon).
-- ============================================================

UPDATE "AunapNews" SET title='AUNAP lidera la Mesa Nacional de Pesca para fortalecer el sector pesquero en Colombia', url='https://aunap.gov.co/aunap-lidera-la-mesa-nacional-de-pesca-para-fortalecer-el-sector-pesquero-en-colombia/', "publishedDate"='17 junio, 2026', "imageUrl"='https://aunap.gov.co/wp-content/uploads/2026/06/AUNAP-MESA-INTEGRAL-DE-PESCA-AUNAP-2026-1024x576.jpeg', "createdAt"='2026-06-17 21:03:00' WHERE id=1;
UPDATE "AunapNews" SET title='AUNAP y Gobierno nacional benefician a más de 280 familias de pescadores artesanales en el Caribe colombiano', url='https://aunap.gov.co/aunap-y-gobierno-nacional-benefician-a-mas-de-280-familias-de-pescadores-artesanales-en-el-caribe-colombiano/', "publishedDate"='13 junio, 2026', "imageUrl"='https://aunap.gov.co/wp-content/uploads/2026/06/AUNAP-ENTREGA-EMBARCACIONES-1024x576.jpeg', "createdAt"='2026-06-13 22:43:07' WHERE id=2;
UPDATE "AunapNews" SET title='AUNAP advierte sobre cobros irregulares a pescadores y aclara que no se requiere pagar para ejercer la actividad pesquera', url='https://aunap.gov.co/aunap-advierte-sobre-cobros-irregulares-a-pescadores-y-aclara-que-no-se-requiere-pagar-para-ejercer-la-actividad-pesquera/', "publishedDate"='12 junio, 2026', "imageUrl"='https://aunap.gov.co/wp-content/uploads/2026/06/PESCAR-AUNAP-1024x576.jpeg', "createdAt"='2026-06-12 19:40:51' WHERE id=3;
