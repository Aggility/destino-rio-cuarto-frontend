'use client';

import { useState } from 'react';

/**
 * Imagen de evento con fallback automático.
 * Muestra siempre la imagen real del evento (cover.medium de la API).
 * Solo si falla la carga (error de red, 404), muestra un fondo gris de reemplazo.
 */
export default function EventImageWithFallback({ src, alt, sizes }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className="w-100 h-100 d-flex align-items-center justify-content-center"
        style={{ backgroundColor: '#f3f4f6' }}
      >
        <i className="bi bi-image text-muted" style={{ fontSize: '2rem' }} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || ''}
      onError={() => setFailed(true)}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
      }}
    />
  );
}
