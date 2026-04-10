import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * EventCard - Destino Río Cuarto
 * Basado exactamente en Figma ID I3781:19227 (High Fidelity)
 */
export default function EventCard({ 
  id = "1",
  title = "Título del Evento", 
  date = "jue, 12 mar, 21:00", 
  location = "Lugar no especificado", 
  description = "Llego Iván Noble a la esquina de Elvis con “canciones traspapeladas”", 
  category = "Evento",
  typeColor = "#1a56d8",
  thumbnail = "/Thumbnail.png" 
}) {
  return (
    <Link href={`/eventos/${id}`} className="text-decoration-none">
      <div className="card h-100 border-0 bg-transparent shadow-none animate-hover-lift w-100">
        
        {/* 1. Header (Thumbnail & Tag) — Figma ID I3781:19227;3389:3472 */}
        <div className="position-relative overflow-hidden rounded-2 mb-2 card-zoom-effect" style={{ height: '207px', borderRadius: '8px' }}>
          <Image 
            src={thumbnail}
            alt={title}
            fill
            className="object-cover"
          />
          
          {/* Tag Overlay — Figma ID I3781:19227;3395:3977 */}
          <div className="position-absolute top-0 start-0 bg-black px-2 py-1" style={{ zIndex: 10 }}>
            <span className="text-white fw-semibold font-inter" style={{ fontSize: '18px', letterSpacing: '-0.54px', lineHeight: '1.2' }}>
              {date}
            </span>
          </div>
        </div>

        {/* 2. Body — Figma ID I3781:19227;3389:3474 */}
        <div className="card-body p-0 pt-2">
          
          {/* Badge Proyectivo — indigo-100/800 */}
          {category && category !== "Evento" && (
             <div className="d-inline-block px-1 py-0 rounded-1 mb-1" style={{ backgroundColor: '#e5edff' }}>
                <span className="fw-medium font-inter" style={{ color: '#42389d', fontSize: '12px' }}>
                  {category}
                </span>
             </div>
          )}

          {/* Title — Figma ID I3781:19227;3389:3478 */}
          <h3 className="h5 fw-semibold text-gray-900 mb-1 font-inter text-truncate" style={{ 
            fontSize: '22px', 
            letterSpacing: '-0.66px',
            lineHeight: '1.2'
          }}>
            {title}
          </h3>

          {/* Location — Figma ID I3781:19227;3389:3480 */}
          <p className="text-gray-800 mb-1 font-inter text-truncate" style={{ fontSize: '16px', fontWeight: 400 }}>
            {location}
          </p>

          {/* Description — Figma ID I3781:19227;3679:33962 */}
          {description && (
            <p className="text-gray-800 font-inter mb-0 overflow-hidden" style={{ 
              fontSize: '15px', 
              lineHeight: '1.5',
              opacity: 0.9,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
              {description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
