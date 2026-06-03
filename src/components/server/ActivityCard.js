import React from 'react';
import Link from 'next/link';
import EventImageWithFallback from '@/components/client/EventImageWithFallback';

/**
 * ActivityCard - Destino Río Cuarto
 * Basado en Figma ID 3640:28663 (Location Data)
 * Rediseñado para evitar superposición de elementos y añadir efecto zoom en imagen.
 */
export default function ActivityCard({
  id = "1",
  slug,
  title = "Título de la Actividad",
  time = "10:00 hs",
  address = "Dirección no especificada",
  schedule = "Horarios no disponibles",
  description = "Descripción breve del paseo o actividad turística.",
  thumbnail = "/no-img.webp",
  type = "actividades"
}) {
  return (
    <Link href={`/${type}/${slug || id}`} className="text-decoration-none text-reset h-100 d-block">
      <div className="activity-card bg-white border border-light-subtle rounded-3 overflow-hidden transition-all hover-lift h-100" 
           style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        
        {/* 1. Image Section with Zoom Effect */}
        <div className="position-relative overflow-hidden card-zoom-effect" style={{ height: '160px' }}>
          <EventImageWithFallback 
            src={thumbnail} 
            alt={title} 
            sizes="(max-width: 768px) 100vw, 300px"
          />
          {/* Badge Overlay */}
          <div className="position-absolute top-0 start-0 bg-black px-2 py-1" style={{ zIndex: 10 }}>
            <span className="text-white fw-semibold font-inter" style={{ fontSize: '13px', letterSpacing: '-0.54px', lineHeight: '1.2' }}>
              {time}
            </span>
          </div>
        </div>

        {/* 2. Content Section */}
        <div className="p-3 pt-2 d-flex flex-column gap-2">
          <h3 className="font-inter fw-bold text-gray-900 mb-0" 
              style={{ fontSize: '17px', lineHeight: '1.3', color: '#111928' }}>
            {title}
          </h3>

          {/* Info List */}
          <div className="d-flex flex-column gap-1 mt-0">
            {/* Ubicación / Dirección */}
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-geo-alt-fill" style={{ fontSize: '14px', color: '#8a38f5' }}></i>
              <p className="font-inter text-gray-900 mb-0 small text-truncate fw-medium" 
                 title={address}
                 style={{ lineHeight: '1.4' }}>
                {address}
              </p>
            </div>

            {/* Días / Horario */}
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-calendar3" style={{ fontSize: '14px', color: '#8a38f5' }}></i>
              <p className="font-inter text-gray-800 mb-0 small text-truncate fw-semibold" 
                 style={{ lineHeight: '1.4', fontSize: '13px' }}>
                {schedule}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
