'use client';

import { useState } from 'react';
import Image from 'next/image';

// Pool de imágenes de Unsplash relacionadas a eventos y espectáculos
const EVENT_FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
  'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80',
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
];

/**
 * Imagen de evento con fallback automático.
 * Si la imagen original falla (404, CDN error, etc.), muestra
 * una imagen aleatoria de Unsplash relacionada a eventos.
 */
export default function EventImageWithFallback({ src, alt, sizes }) {
  const [imgSrc, setImgSrc] = useState(src || EVENT_FALLBACK_IMAGES[0]);
  const [hasFailed, setHasFailed] = useState(false);

  const handleError = () => {
    if (!hasFailed) {
      // Elegir imagen aleatoria del pool
      const randomIndex = Math.floor(Math.random() * EVENT_FALLBACK_IMAGES.length);
      setImgSrc(EVENT_FALLBACK_IMAGES[randomIndex]);
      setHasFailed(true);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      sizes={sizes || '(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'}
      className="object-fit-cover"
      style={{ objectFit: 'cover' }}
      onError={handleError}
    />
  );
}
