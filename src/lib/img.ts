/**
 * Optimización de imágenes remotas.
 *
 * Casi todas las imágenes del catálogo viven en `i.postimg.cc` y se sirven en su
 * resolución/peso original (PNG/JPG de 250-450 KB) aunque se muestren en tarjetas
 * de ~300 px. Con cientos de productos eso hacía que el catálogo tardara decenas de
 * segundos en cargar, sobre todo en móvil.
 *
 * Las pasamos por Photon (`i0.wp.com`, el CDN gratuito de Automattic/Jetpack):
 * redimensiona al ancho de uso, sirve WebP a los navegadores que lo aceptan y cachea
 * globalmente. Una imagen típica del catálogo baja de ~440 KB a ~15 KB (−97 %).
 *
 * Solo se reescriben las URLs de `i.postimg.cc` (el host pesado). Todo lo demás
 * —data URIs de QR/base64, rutas locales, Unsplash ya optimizado— pasa sin tocar.
 *
 * Para cambiar de proveedor (Vercel Image, Cloudinary, Supabase Storage, etc.) basta
 * con editar esta función: es el único punto del código que construye URLs de imagen.
 *
 * @param url          URL original de la imagen.
 * @param displayWidth Ancho aproximado en px CSS al que se renderiza (se pide ×2 para retina).
 * @param quality      Calidad WebP 1-100 (por defecto 82).
 */
export function optimizeImage(
  url: string | undefined | null,
  displayWidth: number,
  quality = 82,
): string {
  if (!url) return url ?? '';

  // No tocar data URIs (base64), blobs ni rutas locales/relativas.
  if (!/^https?:\/\//i.test(url)) return url;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }

  // Solo optimizamos el host que sirve los originales pesados. postimg no permite
  // redimensionar por URL, así que lo proxiamos; el resto ya llega liviano.
  if (parsed.hostname !== 'i.postimg.cc') return url;

  // Densidad 2x para pantallas retina, con un tope para no pedir imágenes gigantes.
  const w = Math.min(Math.round(displayWidth * 2), 1200);
  const source = url.replace(/^https?:\/\//i, '');
  return `https://i0.wp.com/${source}?w=${w}&quality=${quality}&ssl=1`;
}
