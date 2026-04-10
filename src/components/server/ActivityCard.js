import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * ActivityCard - Destino Río Cuarto
 * Basado en Figma ID 3640:28663 (Location Data)
 * Rediseñado para evitar superposición de elementos y añadir efecto zoom en imagen.
 */
export default function ActivityCard({
  id = "1",
  title = "Título de la Actividad",
  time = "10:00 hs",
  address = "Dirección no especificada",
  schedule = "Horarios no disponibles",
  description = "Descripción breve del paseo o actividad turística.",
  thumbnail = "/Thumbnail.png"
}) {
  return (
    <div className="activity-card bg-white border border-light-subtle rounded-3 overflow-hidden transition-all hover-lift h-100" 
         style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}>
      
      {/* 1. Image Section with Zoom Effect */}
      <div className="position-relative overflow-hidden card-zoom-effect" style={{ height: '160px' }}>
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-100 h-100 object-cover"
        />
        {/* Badge Overlay */}
        <div className="position-absolute top-0 start-0 m-2 px-2 py-1 rounded-1 shadow-sm" 
             style={{ backgroundColor: '#e1effe', zIndex: 5 }}>
          <span className="font-inter fw-medium" style={{ color: '#1e429f', fontSize: '13px' }}>
            {time}
          </span>
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="p-3 d-flex flex-column gap-2">
        <h3 className="font-inter fw-bold text-gray-900 mb-1" 
            style={{ fontSize: '17px', lineHeight: '1.3', color: '#111928' }}>
          {title}
        </h3>

        {/* Info List */}
        <div className="d-flex flex-column gap-2 mt-1">
          {/* Address */}
          <div className="d-flex align-items-start gap-2">
            <i className="bi bi-geo-alt text-muted mt-1" style={{ fontSize: '14px' }}></i>
            <p className="font-inter text-gray-700 mb-0 small text-truncate" 
               title={address}
               style={{ lineHeight: '1.4' }}>
              {address}
            </p>
          </div>

          {/* Schedule */}
          <div className="d-flex align-items-start gap-2">
            <i className="bi bi-calendar3 text-muted mt-1" style={{ fontSize: '14px' }}></i>
            <p className="font-inter text-gray-700 mb-0 small" 
               style={{ lineHeight: '1.4' }}>
              {schedule}
            </p>
          </div>

          {/* Description */}
          <p className="font-inter text-gray-600 mb-0 mt-2" 
             style={{ 
               fontSize: '14px', 
               lineHeight: '1.5',
               display: '-webkit-box',
               WebkitLineClamp: 2,
               WebkitBoxOrient: 'vertical',
               overflow: 'hidden'
             }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
