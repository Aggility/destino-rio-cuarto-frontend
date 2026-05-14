/**
 * Obtiene la URL de la miniatura de forma segura.
 * Evita el error "Functions cannot be passed directly to Client Components"
 * causado por String.prototype.small cuando cover es un string.
 */
export function getThumbnail(cover, gallery = []) {
  // Si no hay nada, fallback
  if (!cover && (!gallery || gallery.length === 0)) {
    return '/no-img.webp';
  }

  // 1. Intentar con cover
  if (cover) {
    // Si es un string directo
    if (typeof cover === 'string') return cover;

    // Si es un objeto, buscar propiedades de imagen (verificando que sean strings)
    if (typeof cover === 'object') {
      // Prioridad: large -> medium -> small -> original
      if (typeof cover.large === 'string') return cover.large;
      if (typeof cover.medium === 'string') return cover.medium;
      if (typeof cover.small === 'string') return cover.small;
      if (typeof cover.original === 'string') return cover.original;
    }
  }

  // 2. Intentar con el primer elemento de la galería
  const firstGallery = Array.isArray(gallery) ? gallery[0] : null;
  if (firstGallery) {
    if (typeof firstGallery === 'string') return firstGallery;
    if (typeof firstGallery === 'object') {
      if (typeof firstGallery.medium === 'string') return firstGallery.medium;
      if (typeof firstGallery.small === 'string') return firstGallery.small;
      if (typeof firstGallery.large === 'string') return firstGallery.large;
      if (typeof firstGallery.original === 'string') return firstGallery.original;
    }
  }

  return '/no-img.webp';
}
