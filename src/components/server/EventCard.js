import React from 'react';
import Link from 'next/link';
import EventDistanceBadge from '@/components/client/EventDistanceBadge';
import EventImageWithFallback from '@/components/client/EventImageWithFallback';

/**
 * EventCard - Destino Río Cuarto
 * Basado exactamente en Figma ID I3781:19227 (High Fidelity)
 */
export default function EventCard({ 
  id = "1",
  title = "Título", 
  date = "", 
  location = "Lugar no especificado", 
  description = "", 
  category = "",
  typeColor = "#1a56d8",
  thumbnail = "/no-img.webp",
  lat = null,
  lng = null,
  basePath = "eventos"
}) {
  return (
    <Link href={`/${basePath}/${id}`} className="text-decoration-none d-block h-100">
      <div className="card h-100 border-0 bg-transparent shadow-none w-100 overflow-hidden" style={{ minWidth: 0 }}>
        
        {/* 1. Header (Thumbnail & Tag) — Figma ID I3781:19227;3389:3472 */}
        <div className="position-relative overflow-hidden rounded-2 mb-1 card-zoom-effect w-100" 
             style={{ 
                aspectRatio: '16 / 10.5',
                borderRadius: '8px',
                width: '100%'
             }}>
          <EventImageWithFallback
            src={thumbnail}
            alt={title}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          
          {/* Tag Overlay — Figma ID I3781:19227;3395:3977 */}
          <div className="position-absolute top-0 start-0 bg-black px-2 py-1" style={{ zIndex: 10 }}>
            <span className="text-white fw-semibold font-inter" style={{ fontSize: 'clamp(14px, 4vw, 18px)', letterSpacing: '-0.54px', lineHeight: '1.2' }}>
              {date}
            </span>
          </div>
        </div>

        {/* 2. Body — Figma ID I3781:19227;3389:3474 */}
        <div className="card-body p-0 pt-1 d-flex flex-column" style={{ minWidth: 0 }}>
          
          {/* Badge Proyectivo */}
          {category && (
             <div className="d-inline-block px-2 py-0 rounded-1 mb-1 align-self-start" style={{ backgroundColor: `${typeColor}15` }}>
                <span className="fw-bold font-inter" style={{ color: typeColor, fontSize: '12px' }}>
                   {category}
                </span>
             </div>
          )}

          {/* Title — Figma ID I3781:19227;3389:3478 */}
          <h3 className="fw-semibold text-gray-900 mb-0 font-inter text-truncate-2 w-100" style={{ 
            fontSize: 'clamp(14px, 3.5vw, 17px)', 
            letterSpacing: '-0.2px',
            lineHeight: '1.2'
          }}>
            {title}
          </h3>

          <div className="mb-1">
            <EventDistanceBadge eventLat={lat} eventLng={lng} type="event" minimal={true} />
          </div>

          {/* Location — Figma ID I3781:19227;3389:3480 */}
          <div className="d-flex align-items-center gap-1 mb-1">
            <i className="bi bi-geo-alt-fill" style={{ fontSize: '13px', color: typeColor }}></i>
            <p className="text-gray-800 mb-0 font-inter text-truncate w-100" style={{ fontSize: '13px', fontWeight: 500 }}>
              {location}
            </p>
          </div>

          {/* Schedule / Days — Nuevo requerimiento */}
          {description && (
            <div className="d-flex align-items-center gap-1">
              <i className="bi bi-calendar3" style={{ fontSize: '13px', color: typeColor }}></i>
              <p className="text-gray-800 mb-0 font-inter text-truncate w-100" style={{ fontSize: '13px', fontWeight: 600 }}>
                {description}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
