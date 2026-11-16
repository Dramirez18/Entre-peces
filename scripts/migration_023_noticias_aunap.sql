-- ============================================================
-- Migration 023: Actualización noticias AUNAP (sección Conocimiento)
-- ============================================================
-- Refresca las 3 noticias de la tabla AunapNews con las más recientes
-- del feed oficial (https://aunap.gov.co/feed/): Aeropuerto El Dorado
-- (13 nov), Policía de Carabineros (13 nov) y Plan Regional de Tiburones
-- (11 nov). La app las ordena por createdAt DESC, por eso se usan las
-- fechas reales de publicación. Contenido rutinario (se repite cada pocas
-- semanas). Ejecutar en el SQL Editor de Supabase (RLS bloquea escritura anon).
-- ============================================================

UPDATE "AunapNews" SET title='AUNAP decomisa más de media tonelada de pescado por debajo de la talla mínima en el Aeropuerto El Dorado', url='https://aunap.gov.co/comunicado-oficiicomunicado-de-prensaaunap-decomisa-mas-de-media-tonelada-de-pescado-por-debajo-de-la-talla-minima-en-el-aeropuerto-el-doradofico-colombiano/', "publishedDate"='13 noviembre, 2026', "imageUrl"='https://aunap.gov.co/wp-content/uploads/2026/11/AUNAP-6-1-1-1024x682.jpeg', "createdAt"='2026-11-13 15:36:56' WHERE id=1;
UPDATE "AunapNews" SET title='AUNAP y Policía de Carabineros unen esfuerzos para proteger los recursos pesqueros del país', url='https://aunap.gov.co/aunap-y-policia-de-carabineros-unen-esfuerzos-para-proteger-los-recursos-pesqueros-del-pais/', "publishedDate"='13 noviembre, 2026', "imageUrl"='https://aunap.gov.co/wp-content/uploads/2026/11/AUNAP-CARABINEROS-2.jpeg', "createdAt"='2026-11-13 00:24:29' WHERE id=2;
UPDATE "AunapNews" SET title='Colombia participó en Perú en la actualización del Plan Regional para la Conservación de Tiburones, Rayas y Quimeras', url='https://aunap.gov.co/colombia-participo-en-peru-en-la-actualizacion-del-plan-regional-para-la-conservacion-de-tiburones-rayas-y-quimeras/', "publishedDate"='11 noviembre, 2026', "imageUrl"='https://aunap.gov.co/wp-content/uploads/2026/11/AUNAP-6-1-1024x632.jpeg', "createdAt"='2026-11-11 16:10:54' WHERE id=3;
